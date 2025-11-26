import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// ✨ 偷懒逻辑：如果没配 JWT_SECRET，就直接用密码当密钥，或者用个固定字符串
// 这样你就不用在 .env 里填 JWT_SECRET 了
const JWT_SECRET = process.env.JWT_SECRET || ADMIN_PASSWORD || "fallback_secret_key_123456";

export async function POST(req) {
  try {
    const { action, password } = await req.json();

    if (action === 'login') {
      if (!ADMIN_PASSWORD) {
        return NextResponse.json({ error: '未配置 ADMIN_PASSWORD 环境变量' }, { status: 500 });
      }

      if (password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '30d' });
        return NextResponse.json({ success: true, token });
      } else {
        return NextResponse.json({ error: '密码错误' }, { status: 401 });
      }
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}