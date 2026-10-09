"use client";
import { useCallback, useEffect, useState } from "react";
import { seedMedia } from "./data";
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
      if (!r.ok) throw new Error(String(r.status));
      setItems(await r.json());
    } catch {
      // API unreachable: keep whatever is shown, or fall back to the bundled media on first load.
      setItems((cur) => (cur.length ? cur : (seedMedia as unknown as MediaItem[])));
    }
    setReady(true);
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
