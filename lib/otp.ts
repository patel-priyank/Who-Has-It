import crypto from 'crypto';

import { sql } from '@/lib/db';

export const OTP_EXPIRY_MINUTES = 15;

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export async function storeOtp(email: string, otp: string) {
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await sql`DELETE FROM otps WHERE email = ${email}`;
  await sql`
    INSERT INTO otps (email, otp_hash, expires_at)
    VALUES (${email}, ${otpHash}, ${expiresAt})
  `;
}

export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  const otpHash = hashOtp(otp);

  const rows = await sql`
    SELECT id FROM otps
    WHERE email = ${email} AND otp_hash = ${otpHash} AND expires_at > now()
  `;

  if (rows.length === 0) {
    return false;
  }

  await sql`DELETE FROM otps WHERE email = ${email}`;

  return true;
}

export const emailTemplate = (text: string, code: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          .container {
            font-family: system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji;
            max-width: 600px;
            margin: 0 auto;
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            color: #111827;
          }
          .title {
            font-size: 1.5rem;
            margin-top: 0;
          }
          p {
            font-size: 1rem;
            line-height: 1.5;
          }
          .text {
            color: #374151;
          }
          .code-container {
            background-color: #f3f4f6;
            padding: 1.25rem;
            text-align: center;
            border-radius: 8px;
            margin: 1.5rem 0;
          }
          .code {
            font-size: 2rem;
            font-weight: bold;
            letter-spacing: 0.375rem;
          }
          .expiry-text {
            font-size: 0.875rem;
            color: #4b5563;
          }
          .divider {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 1.25rem 0;
          }
          .footer-text {
            font-size: 0.75rem;
            color: #6b7280;
            margin-bottom: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="title">Who Has It</h2>
          <p>Hello!</p>
          <p class="text">${text}</p>
          <div class="code-container">
            <span class="code">${code}</span>
          </div>
          <p class="expiry-text">This code will expire in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
          <hr class="divider" />
          <p class="footer-text">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
  `;
};
