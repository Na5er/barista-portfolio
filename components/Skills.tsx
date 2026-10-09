"use client";
import SectionHead from "./SectionHead";
import { useI18n } from "@/lib/i18n";

const photos = ["/media/table-service.jpg", "/media/espresso-bar.jpg", "/media/latte-four.jpg", "/media/window-corner.jpg"];

export default function Skills() {
  const { t } = useI18n();
  return (
    <section id="skills" className="relative bg-deep px-6 sm:px-10 pt-24 pb-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/espresso-bar.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale" />
      <div className="max-w-7xl mx-auto relative">
        <SectionHead title={t.skills.title} />
        <ul className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {t.skills.items.map((s, i) => (
            <li key={s.name} className="relative ps-8">
              <span className="absolute start-0 top-0 h-[420px] w-px bg-white" /><span className="absolute -start-[3px] top-0 w-[7px] h-[7px] rounded-full bg-white" />
              <p className="text-amber text-5xl font-bold tracking-widest"><span dir="ltr" className="inline-block">0{i + 1}.</span></p>
              <p className="mt-6 text-lg text-white/90">{s.name}</p>
              <p className="text-sm text-white/60">{s.note}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[i]} alt={s.name} className="mt-6 w-full h-80 object-cover" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
