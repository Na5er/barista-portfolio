"use client";
import { useState } from "react";
import Bean from "@/components/Bean";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (!r.ok) { setError((await r.json().catch(() => ({}))).error || "Login failed."); return; }
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.replace(next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
    } catch { setError("Network error. Try again."); } finally { setBusy(false); }
  };

  const input = "w-full bg-deep border border-white/25 px-4 py-3 focus:border-amber outline-none";
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-deep border border-white/15 p-8 space-y-4">
        <Bean className="w-20 h-20 mx-auto" />
        <h1 className="text-2xl font-bold text-center">Admin login</h1>
        <label className="block"><span className="text-sm text-white/70">Email</span>
          <input type="email" required autoComplete="username" autoFocus className={input} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block"><span className="text-sm text-white/70">Password</span>
          <input type="password" required autoComplete="current-password" className={input} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button disabled={busy} className="w-full px-6 py-3 rounded-full bg-amber text-black font-bold hover:bg-white transition-colors disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
        <a href="/" className="block text-center text-sm text-white/50 hover:text-amber">← Back to site</a>
      </form>
    </main>
  );
}
