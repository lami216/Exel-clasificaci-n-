import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { detectHeaderRow } from '../utils/headerDetection.js';
import { suggestMapping } from '../utils/mapping.js';
import { INTERNAL_SCHEMA, INTERNAL_TO_DB_FIELD } from '../utils/schema.js';

const normalizeCell = (cell) => {
  if (cell === undefined || cell === null) return '';
  if (typeof cell === 'object' && cell.text) return String(cell.text).trim();
  return String(cell).trim();
};

export const loadWorksheetRows = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];
  const rows = [];
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    rows.push(row.values.slice(1).map(normalizeCell));
  });
  return { workbook, worksheet, rows };
};

export const previewImport = async (filePath) => {
  const { rows } = await loadWorksheetRows(filePath);
  const { detectedHeaderRow, candidates } = detectHeaderRow(rows);
  const header = rows[detectedHeaderRow - 1] || [];
  const headers = header.filter(Boolean);
  const mappingSuggestion = suggestMapping(headers);

  return {
    detectedHeaderRow,
    headerCandidates: candidates,
    headers,
    mappingSuggestion,
    sampleRows: rows.slice(detectedHeaderRow, detectedHeaderRow + 10),
    totalRowsScanned: rows.length,
  };
};

const rowIsEmpty = (rowObj) => Object.values(rowObj).every((val) => !String(val ?? '').trim());

export const parseRowsWithMapping = ({ rows, headerRow, mapping, fileName, importBatchId }) => {
  const headerValues = rows[headerRow - 1] || [];
  const headerIndexMap = {};
  headerValues.forEach((h, idx) => {
    headerIndexMap[h] = idx;
  });

  const products = [];
  for (let i = headerRow; i < rows.length; i += 1) {
    const row = rows[i];
    const rawData = {};
    headerValues.forEach((h, idx) => {
      rawData[h || `col_${idx + 1}`] = normalizeCell(row[idx]);
    });

    const product = {
      sourceFileName: fileName,
      sourceRowIndex: i + 1,
      importBatchId,
      rawData,
    };

    INTERNAL_SCHEMA.forEach((schemaKey) => {
      const selectedHeader = mapping[schemaKey];
      if (!selectedHeader) return;
      const idx = headerIndexMap[selectedHeader];
      const dbField = INTERNAL_TO_DB_FIELD[schemaKey];
      if (!dbField) return;
      if (dbField === 'picture') {
        product.picture = { url: normalizeCell(row[idx]), source: 'excel' };
      } else {
        product[dbField] = normalizeCell(row[idx]);
      }
    });

    if (!product.name && product.no) product.name = `Product ${product.no}`;
    if (rowIsEmpty(product)) continue;
    if (!product.name) continue;

    if (!product.totalPrice && product.price && product.pcs) {
      const total = Number(product.price) * Number(product.pcs);
      if (!Number.isNaN(total)) product.totalPrice = String(total);
    }

    products.push(product);
  }

  return products;
};

export const generateSelectionExcel = async ({ selectionId, rows, outputDir }) => {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('Selection');

  const headers = ['Image URL', 'NAME', 'Selected Qty', ...INTERNAL_SCHEMA.filter((s) => s !== 'PICTURE' && s !== 'NAME')];
  ws.addRow(headers);

  rows.forEach((item) => {
    const p = item.product;
    ws.addRow([
      p.picture?.url || '',
      p.name,
      item.quantity,
      p.no || '',
      p.cartonQty || '',
      p.pcs || '',
      p.price || '',
      p.totalPrice || '',
      p.cbm || '',
      p.cbms || '',
      p.kg || '',
      p.kgs || '',
      p['السعر_بالاوقية'] || '',
      p['نسبة_المكتب'] || '',
      p['الشحن'] || '',
      p['سعر_الطياح'] || '',
    ]);
  });

  ws.columns.forEach((col) => {
    col.width = 18;
  });

  await fs.mkdir(outputDir, { recursive: true });
  const fileName = `selection-${selectionId}-${uuidv4().slice(0, 8)}.xlsx`;
  const filePath = path.join(outputDir, fileName);
  await workbook.xlsx.writeFile(filePath);
  return { filePath, fileName };
};
