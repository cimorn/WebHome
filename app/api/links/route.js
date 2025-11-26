import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Link from '@/models/Link';
import jwt from 'jsonwebtoken';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// ✨ 保持逻辑一致：没有配置就用密码或固定串
const JWT_SECRET = process.env.JWT_SECRET || ADMIN_PASSWORD || "fallback_secret_key_123456";

const verifyAdmin = (req) => {
  const token = req.headers.get('x-auth-token');
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (e) { return false; }
};

// GET: 获取所有链接
export async function GET(req) {
  await dbConnect();
  const isAdmin = verifyAdmin(req);

  let query = {};
  if (!isAdmin) {
    query = { isSecret: false }; // 未登录只查公开的
  }

  // 按分类和创建时间排序
  const links = await Link.find(query).sort({ category: 1, createdAt: -1 });

  return NextResponse.json({ isAdmin, data: links });
}

// POST: 添加链接
export async function POST(req) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: '无权操作' }, { status: 401 });
  
  await dbConnect();
  try {
    const body = await req.json();
    if (Array.isArray(body)) {
      await Link.insertMany(body); // 批量导入
    } else {
      await Link.create(body); // 单个添加
    }
    return NextResponse.json({ message: '添加成功' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT: 修改链接
export async function PUT(req) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: '无权操作' }, { status: 401 });

  await dbConnect();
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) return NextResponse.json({ error: '缺少 ID' }, { status: 400 });

    await Link.findByIdAndUpdate(_id, updateData);
    return NextResponse.json({ message: '修改成功' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE: 删除链接
export async function DELETE(req) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: '无权操作' }, { status: 401 });

  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: '缺少 ID' }, { status: 400 });

    await Link.findByIdAndDelete(id);
    return NextResponse.json({ message: '删除成功' });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}