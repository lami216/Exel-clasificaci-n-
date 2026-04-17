import { Router } from 'express';
import { createSelection, exportSelection, getSelection } from '../controllers/selectionController.js';

const router = Router();
router.post('/', createSelection);
router.get('/:id', getSelection);
router.post('/:id/export', exportSelection);

export default router;
