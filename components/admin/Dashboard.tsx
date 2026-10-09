"use client";
import { upload } from "@vercel/blob/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { itemCategories, toEmbed, type Category, type MediaItem } from "@/lib/mediaTypes";

const labels: Record<Category, string> = { latte: "Latte Art", filter: "Filter & Pour Over", workspace: "Coffee Shops / Workspaces", video: "Videos" };
const input = "w-full bg-deep border border-white/25 px-3 py-2 focus:border-amber outline-none";
const btn = "px-3 py-1 rounded-full border border-white/30 text-sm hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init);
  if (r.status === 401) { window.location.href = "/admin/login"; throw new Error("Session expired"); }
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.error || "Request failed");
  return body;
}

const MAX_IMAGE = 20 * 1024 * 1024, MAX_VIDEO = 150 * 1024 * 1024;

// The file goes straight from the browser to Vercel Blob (serverless functions cap bodies at 4.5 MB),
// then the API stores the item.
async function uploadItem(meta: Record<string, string>, file: File | null, onProgress: (n: number) => void) {
  let url = meta.url;
  if (file) {
    if (file.size > (file.type.startsWith("video/") ? MAX_VIDEO : MAX_IMAGE)) throw new Error(file.type.startsWith("video/") ? "Video is too large (max 150 MB)." : "Image is too large (max 20 MB).");
    const ext = (file.name.split(".").pop() || "bin").replace(/[^a-z0-9]/gi, "").toLowerCase();
    const blob = await upload(`uploads/${crypto.randomUUID()}.${ext}`, file, {
      access: "public", handleUploadUrl: "/api/media/upload", multipart: file.size > 8 * 1024 * 1024,
      onUploadProgress: (p) => onProgress(Math.round(p.percentage)),
    });
    url = blob.url;
  }
  return api<MediaItem>("/api/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...meta, url }) });
}

function Thumb({ item }: { item: MediaItem }) {
  const cls = "w-20 h-20 object-cover bg-deep shrink-0";
  if (item.type === "image") return /* eslint-disable-next-line @next/next/no-img-element */ <img src={item.src} alt="" className={cls} />;
  if (toEmbed(item.src)) return <div className={`${cls} flex items-center justify-center text-xs text-white/60`}>Embed</div>;
  return <video src={item.src} className={cls} muted playsInline preload="metadata" />;
}

export default function Dashboard() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", notes: "", location: "Countryhouse.om", url: "", category: "latte" as Category });
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", notes: "", location: "", category: "latte" as Category });

  const flash = (ok: boolean, text: string) => setMsg({ ok, text });
  const load = useCallback(async () => {
    try { setItems(await api<MediaItem[]>("/api/media", { cache: "no-store" })); } catch (e) { flash(false, (e as Error).message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const isVideoFile = file?.type.startsWith("video/");

  const add = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(null);
    if (!file && !form.url.trim()) return flash(false, "Choose a file or paste a URL.");
    setProgress(0);
    try {
      const created = await uploadItem({ title: form.title, notes: form.notes, location: form.location, category: form.category, url: file ? "" : form.url }, file, setProgress);
      setItems((x) => [created, ...x]);
      setForm({ ...form, title: "", notes: "", url: "" }); setFile(null); if (fileRef.current) fileRef.current.value = "";
      flash(true, "Added. It is live on the site now.");
    } catch (err) { flash(false, (err as Error).message); } finally { setProgress(null); }
  };

  const remove = async (i: MediaItem) => {
    if (!confirm(`Delete "${i.title}"? This cannot be undone.`)) return;
    try { await api(`/api/media/${i.id}`, { method: "DELETE" }); setItems((x) => x.filter((y) => y.id !== i.id)); flash(true, "Deleted."); }
    catch (e) { flash(false, (e as Error).message); }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const next = [...items]; const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setItems(next);
    try { await api("/api/media/reorder", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: next.map((x) => x.id) }) }); }
    catch (e) { flash(false, (e as Error).message); load(); }
  };

  const startEdit = (i: MediaItem) => { setEditing(i.id); setDraft({ title: i.title, notes: i.notes, location: i.location, category: i.category }); };
  const saveEdit = async (i: MediaItem) => {
    try {
      const body = i.type === "image" ? draft : { title: draft.title, notes: draft.notes, location: draft.location };
      const updated = await api<MediaItem>(`/api/media/${i.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setItems((x) => x.map((y) => (y.id === i.id ? updated : y))); setEditing(null); flash(true, "Saved.");
    } catch (e) { flash(false, (e as Error).message); }
  };

  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Media dashboard</h1>
        <div className="flex gap-2"><a href="/" target="_blank" rel="noreferrer" className={btn}>View site ↗</a><button onClick={logout} className={btn}>Log out</button></div>
      </header>

      {msg && <p role="status" className={`mt-4 text-sm px-4 py-2 border ${msg.ok ? "border-green-400/40 text-green-300" : "border-red-400/40 text-red-300"}`}>{msg.text}</p>}

      <form onSubmit={add} className="mt-8 grid gap-3 bg-deep border border-white/15 p-5">
        <h2 className="font-bold text-xl">Add photo or video</h2>
        <input required placeholder="Title, e.g. Flat White – Rosetta" className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} />
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder="Coffee type / notes" className={input} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} maxLength={200} />
          <input placeholder="Cafe location" className={input} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} maxLength={120} />
        </div>
        {!isVideoFile && (
          <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} aria-label="Category (photos only)">
            {itemCategories.filter((c) => c !== "video").map((c) => <option key={c} value={c}>{labels[c]}</option>)}
          </select>
        )}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
        <input placeholder="…or paste an image URL, YouTube / Vimeo link, or .mp4 URL" className={input} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} disabled={!!file} />
        <p className="text-xs text-white/50">JPG, PNG, WebP, GIF up to 20 MB. MP4, WebM, MOV up to 150 MB. iPhone HEIC must be exported as JPG first. Videos are auto-filed under “Videos”.</p>
        {progress !== null && <div className="h-2 bg-white/10"><div className="h-2 bg-amber transition-all" style={{ width: `${progress}%` }} /></div>}
        <button disabled={progress !== null} className="justify-self-start px-6 py-2 rounded-full bg-amber text-black font-bold hover:bg-white transition-colors disabled:opacity-50">{progress !== null ? `Uploading ${progress}%…` : "Add to portfolio"}</button>
      </form>

      <h2 className="mt-10 font-bold text-xl">Portfolio items ({items.length})</h2>
      <p className="text-sm text-white/50">Order here is the order on the site. Use the arrows to reorder.</p>
      {loading ? <p className="mt-4 text-white/60">Loading…</p> : items.length === 0 ? <p className="mt-4 text-white/60">Nothing yet. Add your first item above.</p> : (
        <ul className="mt-4 divide-y divide-white/10 border border-white/10">
          {items.map((i, idx) => (
            <li key={i.id} className="p-3 bg-deep/60">
              <div className="flex items-center gap-3">
                <Thumb item={i} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate">{i.title}</p>
                  <p className="text-xs text-white/60 truncate">{[labels[i.category], i.notes, i.location].filter(Boolean).join(" • ")}</p>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  <button className={btn} onClick={() => move(idx, -1)} disabled={idx === 0} aria-label="Move up">↑</button>
                  <button className={btn} onClick={() => move(idx, 1)} disabled={idx === items.length - 1} aria-label="Move down">↓</button>
                  <button className={btn} onClick={() => (editing === i.id ? setEditing(null) : startEdit(i))}>{editing === i.id ? "Cancel" : "Edit"}</button>
                  <button className={`${btn} hover:!bg-red-500/20`} onClick={() => remove(i)}>Delete</button>
                </div>
              </div>
              {editing === i.id && (
                <div className="mt-3 grid gap-2">
                  <input className={input} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" maxLength={120} />
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input className={input} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Notes" maxLength={200} />
                    <input className={input} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="Location" maxLength={120} />
                  </div>
                  {i.type === "image" && (
                    <select className={input} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}>
                      {itemCategories.filter((c) => c !== "video").map((c) => <option key={c} value={c}>{labels[c]}</option>)}
                    </select>
                  )}
                  <button onClick={() => saveEdit(i)} disabled={!draft.title.trim()} className="justify-self-start px-5 py-2 rounded-full bg-amber text-black font-bold disabled:opacity-50">Save changes</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
