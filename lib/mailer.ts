import nodemailer from 'nodemailer';

import { emailTemplate, OTP_EXPIRY_MINUTES } from '@/lib/otp';

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendOtpEmail(to: string, text: string, otp: string) {
  const html = emailTemplate(text, otp);

  await transporter.sendMail({
    from: `"Who Has It" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your verification code',
    text: `Who Has It\n\n${text}\n\n${otp}\n\nThis code will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
    html
  });
}
