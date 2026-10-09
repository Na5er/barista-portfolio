import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin · Ahmed Nasser", robots: { index: false, follow: false } };

// The dashboard is English-only and always left-to-right, whatever language the public site uses.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div dir="ltr" lang="en" className="min-h-screen bg-ink">{children}</div>;
}
