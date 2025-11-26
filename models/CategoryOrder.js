import mongoose from 'mongoose';

const CategoryOrderSchema = new mongoose.Schema({
  // 我们只存一个文档，里面放一个数组，记录顺序
  type: { type: String, default: 'main' }, 
  order: [String] // 比如 ["Home", "工作", "娱乐", "AI"]
});

export default mongoose.models.CategoryOrder || mongoose.model('CategoryOrder', CategoryOrderSchema);