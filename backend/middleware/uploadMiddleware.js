import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads-temp'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.xlsx' || ext === '.xls') cb(null, true);
  else cb(new Error('Only Excel files are allowed'));
};

export const uploadExcel = multer({ storage, fileFilter });
export const uploadImage = multer({ storage: multer.memoryStorage() });
