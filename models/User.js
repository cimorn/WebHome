import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// 防止 Next.js 热更新导致的模型重编译错误
export default mongoose.models.User || mongoose.model('User', UserSchema);