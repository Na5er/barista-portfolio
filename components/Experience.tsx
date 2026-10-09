"use client";
import SectionHead from "./SectionHead";
import { timeline } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export default function Experience() {
  const { t } = useI18n();
  return (
    <section id="experience" className="relative bg-ink px-6 sm:px-10 pt-24 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <SectionHead title={t.experience.title} />
        <ol className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {timeline.map((x, i) => {
            const d = t.experience.items[x.id];
            return (
              <li key={x.id} className="relative ps-8 pb-4">
                <span className="absolute start-0 top-0 h-full w-px bg-white" /><span className="absolute -start-[3px] top-0 w-[7px] h-[7px] rounded-full bg-white" />
                <p className="text-amber text-5xl font-bold tracking-widest"><span dir="ltr" className="inline-block">0{i + 1}.</span></p>
                <h3 className="mt-6 text-xl font-bold">{x.place}</h3>
                <p className="text-white/70">{t.experience.role}, {d.city}</p>
                <p className="label mt-3 text-amber text-[10px]"><span dir="ltr" className="inline-block">{x.period}</span></p>
                <p className="mt-3 text-sm text-white/70">{d.note}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
