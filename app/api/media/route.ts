import { NextRequest, NextResponse } from "next/server";
import { guard } from "@/lib/server/guard";
import { del } from "@vercel/blob";
import { addMedia, head, isBlobUrl, listMedia } from "@/lib/server/store";
import { asCategory, classifyUrl, clean } from "@/lib/server/validate";

export const dynamic = "force-dynamic";
const MAX_IMAGE = 20 * 1024 * 1024;

export async function GET() {
  return NextResponse.json(await listMedia(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;

  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch {}
  const title = clean(b.title, 120);
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const notes = clean(b.notes, 200), location = clean(b.location, 120);

  let src: string, type: "image" | "video";
  const url = clean(b.url, 2000);
  if (isBlobUrl(url)) {
    // File was uploaded straight to Blob; trust the stored content type, not the client.
    const meta = await head(url).catch(() => null);
    const ct = meta?.contentType ?? "";
    if (!meta || !/^(image|video)\//.test(ct)) return NextResponse.json({ error: "Unsupported file." }, { status: 415 });
    type = ct.startsWith("video/") ? "video" : "image";
    if (type === "image" && meta.size > MAX_IMAGE) {
      await del(url).catch(() => {});
      return NextResponse.json({ error: "Image is too large (max 20 MB)." }, { status: 413 });
    }
    src = meta.url;
  } else {
    const c = classifyUrl(url);
    if (!c) return NextResponse.json({ error: "Choose a file or enter a valid http(s) URL." }, { status: 400 });
    src = c.url; type = c.type;
  }

  const picked = asCategory(b.category);
  const category = type === "video" ? "video" : picked && picked !== "video" ? picked : "latte";
  const item = await addMedia({ id: crypto.randomUUID(), type, category, title, notes, location, src });
  return NextResponse.json(item, { status: 201 });
}
