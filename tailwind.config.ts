import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#242424", deep: "#1b1b1b", gold: "#A97F3E", amber: "#FFC15A", sand: "#E6D3B3", bronze: "#8E6A2E", smoke: "#4a4a4a" },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
