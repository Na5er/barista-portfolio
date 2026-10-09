"use client";
import { useCallback, useEffect, useState } from "react";
import type { MediaItem } from "./mediaTypes";

export { categories, toEmbed } from "./mediaTypes";
export type { Category, MediaItem } from "./mediaTypes";

// Public gallery data. Always reads fresh from the server and refreshes when the tab regains focus,
// so additions/deletions made in /admin show up without a manual reload.
export function useMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/media", { cache: "no-store" });
      if (r.ok) { setItems(await r.json()); setReady(true); }
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    const timer = setInterval(onVisible, 30000);
    return () => { document.removeEventListener("visibilitychange", onVisible); window.removeEventListener("focus", onVisible); clearInterval(timer); };
  }, [refresh]);

  return { items, ready, refresh };
}
