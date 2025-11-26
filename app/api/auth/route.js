import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export async function POST(req) {
  await dbConnect();
  const { action, username, password } = await req.json();

  if (action === 'register') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username, password: hashedPassword });
      return NextResponse.json({ message: 'User created' });
    } catch (e) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
  }

  if (action === 'login') {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    return NextResponse.json({ token, username: user.username });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}