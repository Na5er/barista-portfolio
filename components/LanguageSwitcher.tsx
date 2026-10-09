"use client";
import { locales, useI18n, type Locale } from "@/lib/i18n";

const names: Record<Locale, string> = { en: "English", tr: "Türkçe", ar: "العربية" };

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t.common.language} dir="ltr" className="flex items-center gap-1 shrink-0 rounded-full border border-white/25 ps-2 pe-1 py-0.5">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white/60 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
      </svg>
      {locales.map((l) => (
        <button key={l} onClick={() => setLocale(l)} lang={l} title={names[l]} aria-label={names[l]} aria-pressed={locale === l}
          className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider transition-colors ${locale === l ? "bg-amber text-black" : "text-white/70 hover:text-amber"}`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
