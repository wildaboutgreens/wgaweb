import { SignJWT, jwtVerify } from 'jose';

const ALG = 'HS256';
const COOKIE_NAME = 'admin_token';
const EXPIRY = '8h';

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.ADMIN_PASSWORD!);
}

export async function signToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
