import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { I18nProvider, initScript } from "@/lib/i18n";
import en from "@/locales/en.json";

const sans = Noto_Sans({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "600", "700", "800"], variable: "--font-sans" });
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "600", "700", "800"], variable: "--font-arabic" });

export const metadata: Metadata = { title: en.meta.title, description: en.meta.description };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: initScript }} /></head>
      <body className={`${sans.variable} ${arabic.variable}`}><I18nProvider>{children}</I18nProvider></body>
    </html>
  );
}
