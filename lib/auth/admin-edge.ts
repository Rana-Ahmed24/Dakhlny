const ADMIN_COOKIE_NAME = "nc_admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signTokenEdge(timestamp: number, secret: string): Promise<string> {
  return sha256Hex(`${timestamp}:${secret}`);
}

export async function verifyAdminSessionTokenEdge(
  token: string | undefined
): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!token || !secret || secret.length < 32) return false;

  const [timestampStr, signature] = token.split(".");
  if (!timestampStr || !signature) return false;

  const timestamp = Number(timestampStr);
  if (!Number.isFinite(timestamp)) return false;
  if (Date.now() - timestamp > SESSION_DURATION_MS) return false;

  const expected = await signTokenEdge(timestamp, secret);
  if (expected.length !== signature.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

export { ADMIN_COOKIE_NAME };
