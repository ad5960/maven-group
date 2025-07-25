import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; 

export async function POST(req: NextRequest) {
  const { path } = await req.json();
  if (!path) {
    return NextResponse.json({ revalidated: false, message: 'No path provided' }, { status: 400 });
  }
  try {
    await revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}