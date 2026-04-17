import Product from '../models/Product.js';
import { uploadToImageKit } from '../services/imageKitService.js';

export const listProducts = async (req, res) => {
  const { q } = req.query;
  const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Deleted' });
};

export const uploadProductImage = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (!req.file) return res.status(400).json({ message: 'Image file required' });

  const encoded = req.file.buffer.toString('base64');
  const uploaded = await uploadToImageKit({ file: encoded, fileName: req.file.originalname });

  product.picture = { ...uploaded, source: 'manual' };
  await product.save();

  res.json(product);
};
