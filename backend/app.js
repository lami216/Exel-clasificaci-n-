import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import importRoutes from './routes/importRoutes.js';
import productRoutes from './routes/productRoutes.js';
import selectionRoutes from './routes/selectionRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/files/exports', express.static(path.join(__dirname, 'exports')));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/import', importRoutes);
app.use('/api/products', productRoutes);
app.use('/api/selections', selectionRoutes);
app.use('/api/exports', exportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
