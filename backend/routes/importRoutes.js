import { Router } from 'express';
import {
  confirmImport,
  getBatchById,
  listBatches,
  previewBatch,
  uploadImportFile,
} from '../controllers/importController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadExcel } from '../middleware/uploadMiddleware.js';

const router = Router();
router.post('/upload', protectAdmin, uploadExcel.single('file'), uploadImportFile);
router.post('/preview', protectAdmin, previewBatch);
router.post('/confirm', protectAdmin, confirmImport);
router.get('/batches', protectAdmin, listBatches);
router.get('/batches/:id', protectAdmin, getBatchById);

export default router;
