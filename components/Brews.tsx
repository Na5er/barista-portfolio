"use client";
import { useI18n } from "@/lib/i18n";

export default function Brews() {
  const { t } = useI18n();
  return (
    <section id="brews" className="bg-deep px-6 sm:px-10 py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl sm:text-6xl font-bold">{t.brews.title}</h2>
        <ul className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
          {t.brews.items.map((s) => (
            <li key={s.name} className="border-t border-gold pt-4"><h3 className="text-xl font-bold text-amber">{s.name}</h3><p className="mt-2 text-white/70 text-sm">{s.desc}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
