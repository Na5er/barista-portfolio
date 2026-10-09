import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { guard } from "@/lib/server/guard";

export const dynamic = "force-dynamic";

// Issues short-lived upload tokens so the browser can send big files straight to Blob
// (Vercel functions reject request bodies over 4.5 MB). Only a logged-in admin gets a token.
export async function POST(req: NextRequest) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const json = await handleUpload({
      request: req,
      body: (await req.json()) as HandleUploadBody,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"],
        maximumSizeInBytes: 150 * 1024 * 1024,
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
