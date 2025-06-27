import mongoose from 'mongoose';
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String,
  date: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
