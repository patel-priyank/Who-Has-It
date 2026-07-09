import { NextRequest, NextResponse } from 'next/server';

import { sendOtpEmail } from '@/lib/mailer';
import { generateOtp, storeOtp } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'A valid email is required.' }, { status: 400 });
    }

    const otp = generateOtp();

    await storeOtp(email, otp);
    await sendOtpEmail(email, 'Use this verification code to sign in or create your account.', otp);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, error: 'Failed to generate verification code.' }, { status: 500 });
  }
}
