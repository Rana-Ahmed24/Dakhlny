import { createHash, timingSafeEqual } from "crypto";

const ADMIN_COOKIE_NAME = "nc_admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set and at least 32 characters long."
    );
  }
  return secret;
}

function signToken(timestamp: number): string {
  return createHash("sha256")
    .update(`${timestamp}:${getSessionSecret()}`)
    .digest("hex");
}

export function createAdminSessionToken(): string {
  const timestamp = Date.now();
  const signature = signToken(timestamp);
  return `${timestamp}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const [timestampStr, signature] = token.split(".");
  if (!timestampStr || !signature) return false;

  const timestamp = Number(timestampStr);
  if (!Number.isFinite(timestamp)) return false;

  if (Date.now() - timestamp > SESSION_DURATION_MS) return false;

  const expected = signToken(timestamp);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const inputBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(adminPassword);

  if (inputBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(inputBuffer, expectedBuffer);
}

export { ADMIN_COOKIE_NAME };
