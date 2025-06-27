import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  clientName: String,
  amount: Number,
  status: { type: String, enum: ['paid', 'pending', 'overdue'] },
  dueDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
