// ✏️ Contact details and language-independent data. All translatable text lives in locales/en.json, tr.json and ar.json.
export const profile = {
  name: "Ahmed Nasser Mohammed",
  first: "Ahmed",
  years: "5+",
  email: "Ahmedmohd808@gmail.com",
  phone: "+90 501 356 91 35",
  whatsapp: "905013569135", // country code + number, digits only
  instagram: "https://www.instagram.com/33ipp",
  linkedin: "https://linkedin.com/",    // ← add your profile
  tiktok: "https://www.tiktok.com/@33ipp",
  resume: "/resume.jpg",
};

// Place names and periods are language-independent. City, role and notes live in locales/*.json (experience.items.<id>).
export const timeline = [
  { id: "countryhouse", place: "Countryhouse.om", period: "2025 – 2026" },
  { id: "locker", place: "Locker Cafe", period: "2021 – 2022" },
  { id: "ira", place: "Ira Artisan Bakery", period: "2024 – 2025" },
  { id: "jalal", place: "Jalal Efendi Kuru Kahvesi", period: "2022 – 2024" },
] as const;

// Certifications: the CV lists none, so add only the ones you actually hold.
export const certifications: string[] = [
  // "SCA Barista Skills – Foundation",
];

// Photos/videos shown before you add anything in Admin. Files live in /public/media.
// Edit titles/notes here, or delete them from the Admin panel.
export const seedMedia = [
  { id: "s1", type: "image", category: "latte", title: "Four Lattes: Heart & Swan", notes: "Café Latte", location: "Countryhouse.om", src: "/media/latte-four.jpg" },
  { id: "s2", type: "image", category: "latte", title: "Rosetta & Heart Tray", notes: "Café Latte", location: "Countryhouse.om", src: "/media/latte-tray.jpg" },
  { id: "s3", type: "image", category: "latte", title: "Swan Pour", notes: "Hot Spanish Latte", location: "Countryhouse.om", src: "/media/latte-swan.jpg" },
  { id: "s4", type: "image", category: "latte", title: "Heart Latte", notes: "Café Latte", location: "Countryhouse.om", src: "/media/latte-heart.jpg" },
  { id: "s5", type: "image", category: "workspace", title: "Window Corner", notes: "Dine-in service", location: "Countryhouse.om", src: "/media/window-corner.jpg" },
  { id: "s6", type: "image", category: "workspace", title: "Espresso Bar", notes: "Gaggia machine, cup stacks", location: "Countryhouse.om", src: "/media/espresso-bar.jpg" },
  { id: "s7", type: "image", category: "workspace", title: "Table Service", notes: "Order-ready cups", location: "Countryhouse.om", src: "/media/table-service.jpg" },
  { id: "v1", type: "video", category: "video", title: "Milk Pouring 1", notes: "Latte art", location: "Countryhouse.om", src: "/media/pour-1.mp4" },
  { id: "v2", type: "video", category: "video", title: "Milk Pouring 2", notes: "Latte art", location: "Countryhouse.om", src: "/media/pour-2.mp4" },
  { id: "v3", type: "video", category: "video", title: "Milk Pouring 3", notes: "Latte art", location: "Countryhouse.om", src: "/media/pour-3.mp4" },
  { id: "v4", type: "video", category: "video", title: "Milk Pouring 4", notes: "Latte art", location: "Countryhouse.om", src: "/media/pour-4.mp4" },
  { id: "v5", type: "video", category: "video", title: "Ahmed Nasser", notes: "Barista", location: "Istanbul", src: "/media/hero.mp4" },
] as const;
