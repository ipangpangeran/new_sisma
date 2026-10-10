import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-key-must-be-changed-in-production-32-bytes"
);

export interface AuthSession {
  userId: number;
  username: string;
  namaLengkap: string;
  level: "admin" | "bendahara" | "siswa";
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: AuthSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as number,
      username: payload.username as string,
      namaLengkap: payload.namaLengkap as string,
      level: payload.level as "admin" | "bendahara" | "siswa",
    };
  } catch {
    return null;
  }
}

export async function getSession(req?: NextRequest): Promise<AuthSession | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get("sisma_session")?.value;
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get("sisma_session")?.value;
    } catch {
      return null;
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}
