import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // ── basemodul.de · Dark Premium (v2) ──────────────────────────────
        // Surfaces
        paper: "#0D0D0D",        // page background
        paperdeep: "#0A0A0A",    // alternating / deep sections + footer
        paper2: "#161616",       // cards / elevated surfaces
        surface2: "#1C1C1C",     // card hover
        cta: "#111111",          // CTA panel
        // Lines
        line: "#262626",         // borders
        linesoft: "#1F1F1F",     // soft dividers / nav border
        // Text
        ink: "#FFFFFF",          // primary text
        label: "#A1A1AA",        // nav links / lighter labels
        inksoft: "#71717A",      // body / secondary text
        faint: "#52525B",        // eyebrows, muted labels
        // Green system (military green, not neon)
        leafbtn: "#15803D",      // primary button bg
        leafbtnhover: "#166534", // primary button hover
        leaf: "#16A34A",         // general accent (featured border etc.)
        leafbright: "#4ADE80",   // arrows, checks, chevrons, tag text
        leafaccent: "#22C55E",   // headline accent ONLY
        leafdim: "#14532D",      // tag / badge / aktion bg
        leafdimline: "#166534",  // tag / badge border
        leafdark: "#166534",     // legacy alias
      },
    },
  },
  plugins: [],
};
export default config;
