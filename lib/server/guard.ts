import { NextRequest, NextResponse } from "next/server";
import { COOKIE, verifySession } from "@/lib/auth";

// Returns an error response when the caller is not the logged-in admin, otherwise null.
export async function guard(req: NextRequest): Promise<NextResponse | null> {
  if (!(await verifySession(req.cookies.get(COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (req.method !== "GET") {
    const origin = req.headers.get("origin");
    if (origin && new URL(origin).host !== req.headers.get("host")) {
      return NextResponse.json({ error: "Bad origin" }, { status: 403 });
    }
  }
  return null;
}
