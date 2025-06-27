import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['product', 'service'] },
  price: Number,
  stock: Number,
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
