import mongoose from 'mongoose';

const importBatchSchema = new mongoose.Schema(
  {
    originalFileName: { type: String, required: true },
    storedTempPath: String,
    detectedHeaderRow: Number,
    confirmedHeaderRow: Number,
    mappingUsed: mongoose.Schema.Types.Mixed,
    totalRowsScanned: Number,
    totalProductsImported: Number,
    status: {
      type: String,
      enum: ['uploaded', 'previewed', 'completed', 'failed'],
      default: 'uploaded',
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('ImportBatch', importBatchSchema);
