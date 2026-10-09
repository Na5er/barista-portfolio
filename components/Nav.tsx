"use client";
import Bean from "./Bean";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

const links = [["intro", "#intro"], ["skills", "#skills"], ["experience", "#experience"], ["portfolio", "#portfolio"], ["contact", "#contact"]] as const;

export default function Nav() {
  const { t } = useI18n();
  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-deep/80 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-3">
        <a href="#" className="flex items-center gap-2 text-amber shrink-0" aria-label={t.common.name}><Bean className="w-9 h-9 shrink-0" /><span className="label text-white hidden lg:inline">{t.common.name}</span></a>
        <div className="flex items-center gap-3 sm:gap-8 min-w-0">
          <ul className="flex gap-3 sm:gap-6 lg:gap-8">
            {links.map(([k, h]) => (<li key={h} className={k === "intro" || k === "skills" ? "hidden md:block" : k === "experience" ? "hidden sm:block" : ""}><a href={h} className="uppercase font-bold text-[9px] tracking-[0.1em] sm:text-xs sm:tracking-[0.25em] text-white/70 hover:text-amber transition-colors">{t.nav[k]}</a></li>))}
          </ul>
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}
