import { NextRequest, NextResponse } from 'next/server';

import { sql } from '@/lib/db';
import { signToken } from '@/lib/jwt';
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

    const [user] = await sql`
      INSERT INTO users (email)
      VALUES (${email})
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING id, email, created_at
    `;

    const token = signToken({ id: user.id, email: user.email, created_at: user.created_at });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, error: 'Failed to verify verification code.' }, { status: 500 });
  }
}
