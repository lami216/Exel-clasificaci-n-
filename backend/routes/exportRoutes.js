import { Router } from 'express';
import { downloadExport } from '../controllers/exportController.js';

const router = Router();
router.get('/:id/download', downloadExport);

export default router;
