export type Category = "latte" | "filter" | "workspace" | "video";
export type MediaItem = {
  id: string; type: "image" | "video"; category: Category;
  title: string; notes: string; location: string; src: string;
};

export const categories: (Category | "all")[] = ["all", "latte", "filter", "workspace", "video"];
export const itemCategories: Category[] = ["latte", "filter", "workspace", "video"];

// Converts YouTube / Vimeo links to embed URLs; returns null for direct video files.
export function toEmbed(url: string): string | null {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}
