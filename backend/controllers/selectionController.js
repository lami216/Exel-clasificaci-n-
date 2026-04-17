import path from 'path';
import Selection from '../models/Selection.js';
import Product from '../models/Product.js';
import { generateSelectionExcel } from '../services/excelService.js';

export const createSelection = async (req, res) => {
  const { clientName, sessionIdentifier, selectedProducts } = req.body;
  if (!Array.isArray(selectedProducts) || !selectedProducts.length) {
    return res.status(400).json({ message: 'selectedProducts is required' });
  }

  const selection = await Selection.create({ clientName, sessionIdentifier, selectedProducts });
  res.status(201).json(selection);
};

export const getSelection = async (req, res) => {
  const selection = await Selection.findById(req.params.id).populate('selectedProducts.product');
  if (!selection) return res.status(404).json({ message: 'Selection not found' });
  res.json(selection);
};

export const exportSelection = async (req, res) => {
  const selection = await Selection.findById(req.params.id).lean();
  if (!selection) return res.status(404).json({ message: 'Selection not found' });

  const productIds = selection.selectedProducts.map((s) => s.product);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const rows = selection.selectedProducts
    .map((s) => ({ product: productMap.get(String(s.product)), quantity: s.quantity }))
    .filter((s) => s.product);

  const { filePath, fileName } = await generateSelectionExcel({
    selectionId: selection._id,
    rows,
    outputDir: path.resolve('exports'),
  });

  const generatedExcelUrl = `/files/exports/${fileName}`;
  await Selection.findByIdAndUpdate(selection._id, { generatedExcelPath: filePath, generatedExcelUrl });

  res.json({ selectionId: selection._id, generatedExcelUrl });
};
