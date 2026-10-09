"use client";
import Bean from "./Bean";
import { useI18n } from "@/lib/i18n";

// Slide-style header: big title + amber arrow pill, name block and logo on the end side.
export default function SectionHead({ title }: { title: string }) {
  const { t } = useI18n();
  return (
    <>
      <div className="absolute top-0 end-0 w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center"><Bean className="w-14 h-14 sm:w-24 sm:h-24" /></div>
      <div className="hidden md:block absolute top-8 end-40 w-[34%] border-t border-white pt-6">
        <p className="label">{t.common.name}</p><p className="label mt-8">{t.common.portfolio}</p>
      </div>
      <h2 className="text-5xl sm:text-7xl font-bold leading-[1.1] max-w-[11ch] sm:max-w-[14ch]">
        {title}
        <span className="inline-flex align-middle ms-4 w-20 h-9 sm:w-28 sm:h-12 rounded-full bg-amber text-black items-center justify-center" aria-hidden>
          <svg viewBox="0 0 40 16" className="w-10 sm:w-14 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M0 8H38M31 1l7 7-7 7" /></svg>
        </span>
      </h2>
    </>
  );
}
