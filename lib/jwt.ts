import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY_DAYS = 30;

export type JwtPayload = {
  id: string;
  email: string;
  created_at: string;
  iat: number;
  exp: number;
};

const base64url = (input: string) => Buffer.from(input).toString('base64url');

export function signToken(user: { id: string; email: string; created_at: string }): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + JWT_EXPIRY_DAYS * 24 * 60 * 60;

  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ id: user.id, email: user.email, created_at: user.created_at, iat, exp }));

  const data = `${header}.${payload}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');

  return `${data}.${signature}`;
}

export function verifyToken(token: string): JwtPayload | null {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;

  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');

  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString()) as JwtPayload;

    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}
