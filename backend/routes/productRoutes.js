import { Router } from 'express';
import {
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
  uploadProductImage,
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = Router();
router.get('/', listProducts);
router.get('/:id', getProduct);
router.patch('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);
router.post('/:id/upload-image', protectAdmin, uploadImage.single('image'), uploadProductImage);

export default router;
