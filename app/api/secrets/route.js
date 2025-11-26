import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Secret from '@/models/Secret';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// 获取数据 (GET)
export async function GET(req) {
  const token = req.headers.get('x-auth-token');
  
  // 简单的鉴权
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    jwt.verify(token, JWT_SECRET);
    await dbConnect();
    // 找到所有数据
    const secrets = await Secret.find({});
    return NextResponse.json(secrets);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
  }
}

// 添加数据 (POST) - 方便你测试用
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const secret = await Secret.create(body);
    return NextResponse.json(secret);
  } catch (e) {
    return NextResponse.json({ error: 'Error creating secret' }, { status: 500 });
  }
}