import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE, SESSION_SECONDS, createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const sha = (s: string) => createHash("sha256").update(s).digest();
const same = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));

// Naive per-IP throttle: 5 failures locks that IP for a minute (in-memory, per server instance).
const fails = new Map<string, { n: number; until: number }>();

export async function POST(req: NextRequest) {
  const email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD;
  if (!email || !password || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return NextResponse.json({ error: "Admin login is not configured on the server." }, { status: 500 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const rec = fails.get(ip);
  if (rec && rec.until > Date.now()) return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });

  let body: { email?: unknown; password?: unknown } = {};
  try { body = await req.json(); } catch {}
  const okEmail = same(String(body.email ?? "").trim().toLowerCase(), email.toLowerCase());
  const okPass = same(String(body.password ?? ""), password);

  if (!(okEmail && okPass)) {
    const n = (rec?.n ?? 0) + 1;
    fails.set(ip, { n, until: n >= 5 ? Date.now() + 60_000 : 0 });
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  fails.delete(ip);
  const token = await createSession(email.toLowerCase());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token!, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_SECONDS });
  return res;
}
