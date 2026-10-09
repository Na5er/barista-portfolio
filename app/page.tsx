"use client";
import { useMedia } from "@/lib/media";
import { useI18n } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Toc from "@/components/Toc";
import Experience from "@/components/Experience";
import Brews from "@/components/Brews";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Page() {
  const media = useMedia();
  const { t } = useI18n();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Toc />
        <About />
        <Skills />
        <Experience />
        <Gallery items={media.items} ready={media.ready} />
        <Brews />
        <Contact />
      </main>
      <footer className="bg-deep px-6 py-8 text-sm text-white/50 flex justify-between max-w-6xl mx-auto">
        <span>© {new Date().getFullYear()} {t.common.fullName}</span>
        <a href="/admin" className="hover:text-amber">{t.footer.admin}</a>
      </footer>
    </>
  );
}
