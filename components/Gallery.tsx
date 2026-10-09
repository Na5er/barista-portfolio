"use client";
import { useState } from "react";
import SmartVideo from "./SmartVideo";
import SectionHead from "./SectionHead";
import { useI18n } from "@/lib/i18n";
import { categories, toEmbed, type Category, type MediaItem } from "@/lib/media";

function VideoView({ src, controls = false }: { src: string; controls?: boolean }) {
  const { t } = useI18n();
  const embed = toEmbed(src);
  return embed
    ? <iframe src={embed} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={t.gallery.videoTitle} />
    : <div className="relative w-full h-full"><SmartVideo src={src} controls={controls} className="w-full h-full object-cover" /></div>;
}

export default function Gallery({ items, ready }: { items: MediaItem[]; ready: boolean }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [open, setOpen] = useState<MediaItem | null>(null);
  // Built-in items are translated by id; items added in Admin keep the text typed by the owner.
  const seed = t.gallery.seed as Record<string, { title: string; notes: string }>;
  const places = t.gallery.seedLocation as Record<string, string>;
  const view = (i: MediaItem) => ({ ...i, title: seed[i.id]?.title ?? i.title, notes: seed[i.id]?.notes ?? i.notes, location: places[i.location] ?? i.location });
  const shown = items.filter((i) => filter === "all" || i.category === filter).map(view);

  return (
    <section id="portfolio" className="relative bg-ink px-6 sm:px-10 pt-24 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <SectionHead title={t.gallery.title} />
        <div className="mt-16 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} aria-pressed={filter === c}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${filter === c ? "bg-amber text-black font-bold" : "border border-white/40 hover:bg-white/10"}`}>{t.gallery.categories[c]}</button>
          ))}
        </div>

        {ready && shown.length === 0 && (
          <div className="mt-10 border border-dashed border-white/30 p-10 text-center">
            <p className="text-white/70">{t.gallery.empty}</p>
          </div>
        )}

        <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4">
          {shown.map((i) => (
            <button key={i.id} onClick={() => setOpen(i)} className="group relative block w-full mb-4 overflow-hidden bg-deep text-start break-inside-avoid">
              {i.type === "image"
                ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={i.src} alt={i.title} className="w-full transition-transform duration-500 group-hover:scale-105" />
                : <div className="aspect-video pointer-events-none"><VideoView src={i.src} /></div>}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <p className="font-bold text-lg">{i.title}</p>
                <p className="text-xs text-white/70">{[i.notes, i.location].filter(Boolean).join(" • ")}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <button className="absolute top-4 end-5 text-3xl" aria-label={t.gallery.close}>×</button>
          <div className="max-w-4xl w-full max-h-[80vh] flex justify-center" onClick={(e) => e.stopPropagation()}>
            {open.type === "image"
              ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={open.src} alt={open.title} className="max-h-[80vh] object-contain" />
              : <div className="w-full aspect-video"><VideoView src={open.src} controls /></div>}
          </div>
          <p className="mt-4 font-bold text-xl">{open.title}</p>
          <p className="text-sm text-white/70">{[open.notes, open.location].filter(Boolean).join(" • ")}</p>
        </div>
      )}
    </section>
  );
}
