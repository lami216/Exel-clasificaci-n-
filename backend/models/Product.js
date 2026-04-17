import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    no: String,
    picture: {
      url: String,
      fileId: String,
      name: String,
      source: { type: String, default: 'manual' },
    },
    name: { type: String, required: true, trim: true },
    cartonQty: String,
    pcs: String,
    price: String,
    totalPrice: String,
    cbm: String,
    cbms: String,
    kg: String,
    kgs: String,
    السعر_بالاوقية: String,
    نسبة_المكتب: String,
    الشحن: String,
    سعر_الطياح: String,
    sourceFileName: String,
    sourceRowIndex: Number,
    importBatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'ImportBatch' },
    rawData: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
