import { SignJWT, jwtVerify } from 'jose';
import 'server-only';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type CodePayload = {
  code: string;
};

export async function encrypt(payload: CodePayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = '',
): Promise<CodePayload | undefined> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as CodePayload;
  } catch (error) {
    console.log(error);
    return;
  }
}
