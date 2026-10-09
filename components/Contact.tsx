"use client";
import { useState } from "react";
import SectionHead from "./SectionHead";
import { profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export default function Contact() {
  const { t } = useI18n();
  const [f, setF] = useState({ name: "", email: "", message: "" });
  // No backend needed: opens the visitor's mail app addressed to you.
  // For a real inbox form, swap this for Formspree / Resend / a Next.js route handler.
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${f.message}\n\n${t.contact.mailFrom}: ${f.name} (${f.email})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(t.contact.mailSubject.replace("{name}", f.name))}&body=${encodeURIComponent(body)}`;
  };
  const input = "w-full bg-ink border border-white/30 px-4 py-3 focus:border-amber outline-none";
  return (
    <section id="contact" className="relative bg-deep px-6 sm:px-10 pt-24 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
      <SectionHead title={t.contact.title} />
      <div className="mt-16 grid md:grid-cols-2 gap-12">
        <div>
          <p className=" text-white/70 max-w-sm">{t.contact.intro}</p>
          <p className="mt-6 text-sm text-white/70">{t.contact.location}<br /><span dir="ltr" className="inline-block whitespace-nowrap">{profile.phone}</span><br /><span dir="ltr" className="inline-block">{profile.email}</span></p>
          <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" className="inline-block mt-6 px-6 py-3 rounded-full bg-amber text-black font-bold hover:bg-white transition-colors">{t.contact.whatsapp}</a>
          <div className="mt-6 flex gap-5 text-sm">
            {[["Instagram", profile.instagram], ["LinkedIn", profile.linkedin], ["TikTok", profile.tiktok]].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noreferrer" className="underline underline-offset-4 text-white/80 hover:text-amber">{l}</a>
            ))}
          </div>
        </div>
        <form onSubmit={send} className="space-y-4">
          <label className="block"><span className="text-sm text-white/70">{t.contact.name}</span><input required className={input} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label className="block"><span className="text-sm text-white/70">{t.contact.email}</span><input required type="email" className={input} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
          <label className="block"><span className="text-sm text-white/70">{t.contact.message}</span><textarea required rows={5} className={input} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></label>
          <button className="px-7 py-3 rounded-full bg-amber text-black font-bold hover:bg-white transition-colors">{t.contact.send}</button>
        </form>
      </div>
      </div>
    </section>
  );
}
