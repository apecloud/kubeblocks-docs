import { encryptCookie } from '@/utils/encryptCookie';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import svgCaptcha from 'svg-captcha';

export async function GET() {
  try {
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
      noise: 2,
      background: '#FFF',
      width: 120,
      height: 40,
      fontSize: 50,
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'captcha',
      value: encryptCookie(captcha.text),
      httpOnly: true,
      path: '/',
      maxAge: 60, // 1min
      sameSite: 'strict',
    });

    return new NextResponse(captcha.data, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}
