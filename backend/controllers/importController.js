import fs from 'fs/promises';
import ImportBatch from '../models/ImportBatch.js';
import Product from '../models/Product.js';
import { loadWorksheetRows, parseRowsWithMapping, previewImport } from '../services/excelService.js';

export const uploadImportFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Excel file is required' });
  const batch = await ImportBatch.create({
    originalFileName: req.file.originalname,
    storedTempPath: req.file.path,
    status: 'uploaded',
  });
  res.status(201).json({ batchId: batch._id, fileName: batch.originalFileName });
};

export const previewBatch = async (req, res) => {
  const { batchId } = req.body;
  const batch = await ImportBatch.findById(batchId);
  if (!batch) return res.status(404).json({ message: 'Batch not found' });

  const preview = await previewImport(batch.storedTempPath);
  batch.detectedHeaderRow = preview.detectedHeaderRow;
  batch.totalRowsScanned = preview.totalRowsScanned;
  batch.status = 'previewed';
  await batch.save();

  res.json({ batch, preview });
};

export const confirmImport = async (req, res) => {
  const { batchId, headerRow, mapping, notes } = req.body;
  const batch = await ImportBatch.findById(batchId);
  if (!batch) return res.status(404).json({ message: 'Batch not found' });

  const { rows } = await loadWorksheetRows(batch.storedTempPath);
  const products = parseRowsWithMapping({
    rows,
    headerRow,
    mapping,
    fileName: batch.originalFileName,
    importBatchId: batch._id,
  });

  if (!products.length) return res.status(400).json({ message: 'No valid products parsed from mapping' });
  await Product.insertMany(products, { ordered: false });

  batch.confirmedHeaderRow = headerRow;
  batch.mappingUsed = mapping;
  batch.totalProductsImported = products.length;
  batch.status = 'completed';
  batch.notes = notes;
  await batch.save();

  await fs.unlink(batch.storedTempPath).catch(() => null);

  res.json({ importedCount: products.length, batch });
};

export const listBatches = async (req, res) => {
  const batches = await ImportBatch.find().sort({ createdAt: -1 });
  res.json(batches);
};

export const getBatchById = async (req, res) => {
  const batch = await ImportBatch.findById(req.params.id);
  if (!batch) return res.status(404).json({ message: 'Batch not found' });
  res.json(batch);
};
