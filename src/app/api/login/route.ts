

import { getUserByEmail, verifyPassword, generateToken } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, user.hashedPassword);

    if (!isPasswordValid) {
      console.log("wrong password")
      return NextResponse.json({ message: 'Invalid email or passwordsbdhsdhgsd' }, { status: 401 });
      
    }

    const token = generateToken(email);

    // Set token in a cookie
    const response = NextResponse.json({ message: 'Login successful', token }, { status: 200 });

    response.cookies.set('authToken', token, {
      httpOnly: true , // make it true during production
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
