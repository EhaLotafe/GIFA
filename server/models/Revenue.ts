import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
  source: String,
  amount: Number,
  date: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Revenue', revenueSchema);
