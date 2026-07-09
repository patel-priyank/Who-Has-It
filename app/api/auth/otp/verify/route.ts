import { NextRequest, NextResponse } from 'next/server';

import { verifyOtp } from '@/lib/otp';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and verification code are required.' }, { status: 400 });
    }

    const isValid = await verifyOtp(email, otp);

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid or expired verification code.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, error: 'Failed to verify verification code.' }, { status: 500 });
  }
}
