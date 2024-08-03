import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      console.error('Token not found');
      return NextResponse.json({ error: 'Token not found' }, { status: 401 });
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    // Verify the token
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    // Return success response if token is valid
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
