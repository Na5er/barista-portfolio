import { itemCategories, toEmbed, type Category } from "@/lib/mediaTypes";

export const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
export const asCategory = (v: unknown): Category | null => (itemCategories.includes(v as Category) ? (v as Category) : null);

// Identifies the real file type from its first bytes instead of trusting the client's name or MIME type.
export function sniff(b: Buffer): { ext: string; type: "image" | "video" } | null {
  const is = (off: number, s: string) => b.subarray(off, off + s.length).toString("latin1") === s;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", type: "image" };
  if (b[0] === 0x89 && is(1, "PNG")) return { ext: "png", type: "image" };
  if (is(0, "GIF8")) return { ext: "gif", type: "image" };
  if (is(0, "RIFF") && is(8, "WEBP")) return { ext: "webp", type: "image" };
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return { ext: "webm", type: "video" };
  if (is(4, "ftyp")) return { ext: is(8, "qt") ? "mov" : "mp4", type: "video" };
  return null;
}

export function classifyUrl(raw: string): { url: string; type: "image" | "video" } | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    const isVideo = !!toEmbed(raw) || /\.(mp4|webm|mov)$/i.test(u.pathname);
    return { url: u.toString(), type: isVideo ? "video" : "image" };
  } catch { return null; }
}
