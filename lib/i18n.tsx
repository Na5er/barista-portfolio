"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "@/locales/en.json";
import tr from "@/locales/tr.json";
import ar from "@/locales/ar.json";

export type Dict = typeof en;
export const locales = ["en", "tr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const STORAGE_KEY = "barista_locale_v1";

const dictionaries: Record<Locale, Dict> = { en, tr, ar };
export const dirOf = (l: Locale): "rtl" | "ltr" => (l === "ar" ? "rtl" : "ltr");
const isLocale = (v: unknown): v is Locale => locales.includes(v as Locale);

type Ctx = { locale: Locale; dir: "rtl" | "ltr"; t: Dict; setLocale: (l: Locale) => void };
const I18nContext = createContext<Ctx>({ locale: "en", dir: "ltr", t: en, setLocale: () => {} });

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLocale(saved)) setLocaleState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dirOf(locale);
    document.title = dictionaries[locale].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", dictionaries[locale].meta.description);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const value = useMemo(() => ({ locale, dir: dirOf(locale), t: dictionaries[locale], setLocale }), [locale, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

// Runs before first paint so returning visitors don't see a flash of the wrong direction.
export const initScript = `try{var l=localStorage.getItem("${STORAGE_KEY}");if(l==="en"||l==="tr"||l==="ar"){var d=document.documentElement;d.lang=l;d.dir=l==="ar"?"rtl":"ltr"}}catch(e){}`;
