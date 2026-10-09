import { NextRequest, NextResponse } from "next/server";
import { guard } from "@/lib/server/guard";
import { deleteUpload, listMedia, removeMedia, updateMedia } from "@/lib/server/store";
import { asCategory, clean } from "@/lib/server/validate";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await guard(req);
  if (denied) return denied;
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch {}

  const current = (await listMedia()).find((x) => x.id === params.id);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const patch: Parameters<typeof updateMedia>[1] = {};
  if (b.title !== undefined) { patch.title = clean(b.title, 120); if (!patch.title) return NextResponse.json({ error: "Title is required." }, { status: 400 }); }
  if (b.notes !== undefined) patch.notes = clean(b.notes, 200);
  if (b.location !== undefined) patch.location = clean(b.location, 120);
  if (b.category !== undefined && current.type === "image") {
    const c = asCategory(b.category);
    if (!c || c === "video") return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    patch.category = c;
  }
  return NextResponse.json(await updateMedia(params.id, patch));
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await guard(req);
  if (denied) return denied;
  const removed = await removeMedia(params.id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteUpload(removed.src);
  return NextResponse.json({ ok: true });
}
