import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import CategoryOrder from '@/models/CategoryOrder';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// 验证管理员权限
const verifyAdmin = (req) => {
  const token = req.headers.get('x-auth-token');
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (e) { return false; }
};

// GET: 获取保存的顺序
export async function GET() {
  await dbConnect();
  const doc = await CategoryOrder.findOne({ type: 'main' });
  return NextResponse.json({ order: doc ? doc.order : [] });
}

// POST: 保存新顺序
export async function POST(req) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: '无权操作' }, { status: 401 });
  
  await dbConnect();
  const { order } = await req.json();
  
  // 更新或插入 (Upsert)
  await CategoryOrder.findOneAndUpdate(
    { type: 'main' },
    { order: order },
    { upsert: true, new: true }
  );
  
  return NextResponse.json({ success: true });
}