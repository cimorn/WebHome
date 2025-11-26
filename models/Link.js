// models/Link.js
import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String },
  desc: { type: String },
  category: { type: String, default: '默认' },
  isSecret: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false }, // ✨ 新增：置顶字段
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Link || mongoose.model('Link', LinkSchema);