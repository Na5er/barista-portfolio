import { del, head, put } from "@vercel/blob";
import { seedMedia } from "@/lib/data";
import type { MediaItem } from "@/lib/mediaTypes";

/**
 * Vercel Blob storage. The media list is one JSON blob; uploaded photos/videos are separate blobs
 * that the browser uploads directly (see app/api/media/upload). Needs BLOB_READ_WRITE_TOKEN.
 */
const DB = "portfolio/media.json";
const BLOB_HOST = /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i;

export const isBlobUrl = (raw: string) => {
  try { const u = new URL(raw); return u.protocol === "https:" && BLOB_HOST.test(u.hostname); } catch { return false; }
};

// Serialises read-modify-write cycles inside one server instance (a single admin makes cross-instance races unlikely).
let chain: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(() => fn());
  chain = run.catch(() => {});
  return run;
}

async function write(items: MediaItem[]) {
  await put(DB, JSON.stringify(items), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

async function read(): Promise<MediaItem[]> {
  try {
    const meta = await head(DB);
    // uploadedAt in the query defeats CDN caching of the previous version.
    const r = await fetch(`${meta.url}?v=${new Date(meta.uploadedAt).getTime()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(`Blob read failed: ${r.status}`);
    return await r.json();
  } catch (e) {
    if ((e as Error).name !== "BlobNotFoundError") throw e;
    return [...(seedMedia as unknown as MediaItem[])];
  }
}

export const listMedia = () => locked(read);

export const addMedia = (item: MediaItem) => locked(async () => {
  const items = await read();
  await write([item, ...items]);
  return item;
});

export const updateMedia = (id: string, patch: Partial<Pick<MediaItem, "title" | "notes" | "location" | "category">>) =>
  locked(async () => {
    const items = await read();
    const i = items.findIndex((x) => x.id === id);
    if (i < 0) return null;
    items[i] = { ...items[i], ...patch };
    await write(items);
    return items[i];
  });

export const removeMedia = (id: string) => locked(async () => {
  const items = await read();
  const item = items.find((x) => x.id === id);
  if (!item) return null;
  await write(items.filter((x) => x.id !== id));
  return item;
});

export const reorderMedia = (ids: string[]) => locked(async () => {
  const items = await read();
  const byId = new Map(items.map((x) => [x.id, x]));
  const ordered = ids.map((id) => byId.get(id)).filter((x): x is MediaItem => !!x);
  const rest = items.filter((x) => !ids.includes(x.id));
  const next = [...ordered, ...rest];
  await write(next);
  return next;
});

export async function deleteUpload(src: string) {
  if (isBlobUrl(src)) await del(src);
}

export { head };
