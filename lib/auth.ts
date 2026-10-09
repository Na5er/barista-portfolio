// Edge-safe (Web Crypto only) so both middleware and route handlers can verify the session.
export const COOKIE = "admin_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

const enc = new TextEncoder();
const dec = new TextDecoder();

const toB64u = (b: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64u = (s: string) => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

const secret = () => {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
};
const hmacKey = (s: string) => crypto.subtle.importKey("raw", enc.encode(s), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);

export async function createSession(email: string): Promise<string | null> {
  const s = secret();
  if (!s) return null;
  const payload = toB64u(enc.encode(JSON.stringify({ sub: email, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(s), enc.encode(payload));
  return `${payload}.${toB64u(sig)}`;
}

export async function verifySession(token?: string): Promise<boolean> {
  const s = secret();
  if (!s || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(s), fromB64u(sig), enc.encode(payload));
    if (!ok) return false;
    const { sub, exp } = JSON.parse(dec.decode(fromB64u(payload)));
    return sub === process.env.ADMIN_EMAIL?.toLowerCase() && typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}
