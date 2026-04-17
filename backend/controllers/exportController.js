import path from 'path';
import fs from 'fs';
import Selection from '../models/Selection.js';

export const downloadExport = async (req, res) => {
  const selection = await Selection.findById(req.params.id);
  if (!selection?.generatedExcelPath) return res.status(404).json({ message: 'Export not generated' });
  if (!fs.existsSync(selection.generatedExcelPath)) return res.status(404).json({ message: 'File missing on disk' });
  return res.download(path.resolve(selection.generatedExcelPath));
};
