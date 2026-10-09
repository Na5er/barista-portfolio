import { NextRequest, NextResponse } from "next/server";
import { guard } from "@/lib/server/guard";
import { reorderMedia } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;
  let b: { ids?: unknown } = {};
  try { b = await req.json(); } catch {}
  if (!Array.isArray(b.ids) || !b.ids.every((x) => typeof x === "string")) return NextResponse.json({ error: "ids must be a string array." }, { status: 400 });
  return NextResponse.json(await reorderMedia(b.ids as string[]));
}
