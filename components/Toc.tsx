"use client";
import { useI18n } from "@/lib/i18n";

const items = [["01", "intro", "#intro"], ["02", "skills", "#skills"], ["03", "experience", "#experience"], ["04", "portfolio", "#portfolio"], ["05", "brews", "#brews"], ["06", "contact", "#contact"]] as const;

export default function Toc() {
  const { t } = useI18n();
  return (
    <section className="bg-deep px-6 sm:px-10 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-5xl sm:text-6xl font-bold leading-[1.1]">{t.toc.title1}{t.toc.title2 && <><br />{t.toc.title2}</>}</h2>
          <div className="mt-16 flex" aria-hidden>
            {["#ffffff", "#E6D3B3", "#C9A15F", "#A97F3E", "#4a4a4a"].map((c, i) => (<span key={c} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full -ms-2 first:ms-0" style={{ background: c, zIndex: 5 - i }} />))}
          </div>
        </div>
        <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-2 content-start">
          {items.map(([n, k, h]) => (
            <li key={n}><a href={h} className="group flex items-baseline gap-4 py-4 border-b border-gold">
              <span dir="ltr" className="text-3xl sm:text-4xl font-light">{n}.</span><span className="text-sm group-hover:text-amber transition-colors">{t.toc.items[k]}</span></a></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
