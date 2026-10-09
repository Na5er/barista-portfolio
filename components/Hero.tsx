"use client";
import Bean from "./Bean";
import SmartVideo from "./SmartVideo";
import { profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative isolate min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <SmartVideo src="/media/hero.mp4" poster="/media/espresso-bar.jpg" preload="auto" hideButton className="object-cover w-full h-full absolute inset-0 -z-10" />
      <div className="absolute inset-0 bg-black/60" />
      <p className="label hidden sm:block absolute left-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[10px]">{t.common.fullName}</p>
      <p className="label hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-[10px]">{t.common.portfolio}</p>
      <div className="relative z-10">
        <Bean className="w-20 h-20 mx-auto" />
        <h1 className="mt-10 text-6xl sm:text-8xl lg:text-9xl font-light uppercase leading-[0.9] rtl:leading-[1.2]">{t.hero.title1}<br />{t.hero.title2}</h1>
        <div className="mt-12 mx-auto max-w-xl grid grid-cols-2 border border-white/80 text-[10px] sm:text-xs tracking-[0.25em] uppercase">
          <span className="py-3 px-2 border-e border-white/80">{t.hero.location}</span>
          <span dir="ltr" className="py-3 px-2 truncate">{profile.email}</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href="#portfolio" className="px-7 py-3 rounded-full bg-amber text-black font-bold hover:bg-white transition-colors">{t.hero.viewPortfolio}</a>
          <a href="#contact" className="px-7 py-3 rounded-full border border-white/80 font-bold hover:bg-white hover:text-black transition-colors">{t.hero.getInTouch}</a>
          <a href={profile.resume} download className="px-7 py-3 rounded-full border border-white/80 font-bold hover:bg-white hover:text-black transition-colors">{t.hero.downloadResume}</a>
        </div>
      </div>
    </section>
  );
}
