import mongoose from 'mongoose';

const selectedProductSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const selectionSchema = new mongoose.Schema(
  {
    clientName: String,
    sessionIdentifier: String,
    selectedProducts: [selectedProductSchema],
    generatedExcelPath: String,
    generatedExcelUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model('Selection', selectionSchema);
