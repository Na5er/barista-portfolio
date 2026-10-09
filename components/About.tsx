"use client";
import SectionHead from "./SectionHead";
import { profile, certifications } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export default function About() {
  const { t } = useI18n();
  return (
    <section id="intro" className="relative bg-ink px-6 sm:px-10 pt-24 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <SectionHead title={t.about.title} />
        <div className="mt-20 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 border-s border-white ps-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/profile.jpg" alt={t.common.fullName} className="w-44 h-44 sm:w-56 sm:h-56 rounded-full object-cover object-[50%_30%] border-2 border-amber mb-8" />
            <p className="text-amber text-5xl font-bold">{profile.years}</p>
            <p className="label mt-2 text-white/70">{t.about.yearsLabel}</p>
            <p className="mt-8 text-lg leading-relaxed text-white/85 max-w-xl">{t.about.summary}</p>
          </div>
          <dl className="space-y-8 text-sm">
            <div><dt className="label text-amber">{t.about.education}</dt><dd className="mt-2 text-white/80">{t.about.educationValue}</dd></div>
            <div><dt className="label text-amber">{t.about.languages}</dt><dd className="mt-2 text-white/80">{t.about.languagesValue}</dd></div>
            <div><dt className="label text-amber">{t.about.certifications}</dt><dd className="mt-2 text-white/80">{certifications.length ? certifications.join(", ") : t.about.certificationsEmpty}</dd></div>
            <div><dt className="label text-amber">{t.about.equipment}</dt><dd className="mt-2 text-white/80">{t.about.equipmentValue}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
