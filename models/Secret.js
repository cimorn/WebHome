import mongoose from 'mongoose';

const SecretSchema = new mongoose.Schema({
  title: String,
  encryptedContent: String, // 这里存 AES 加密的乱码
});

export default mongoose.models.Secret || mongoose.model('Secret', SecretSchema);