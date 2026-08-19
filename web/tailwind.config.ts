import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        // ── basemodul.de · Handwerklich klar (v3) ───────────────────────────
        // Warmes Arbeitsumfeld statt Dark-Premium-SaaS.
        paper: "#F7F5EF",
        paperdeep: "#EFEEE6",
        paper2: "#FFFFFF",
        surface2: "#F8F8F3",
        cta: "#EAF0E8",
        // Linien
        line: "#DDDCD3",
        linesoft: "#E7E5DD",
        // Text
        ink: "#1F2A23",
        label: "#455249",
        inksoft: "#687169",
        faint: "#849087",
        // Vertrauen & Status
        leafbtn: "#2E6246",
        leafbtnhover: "#214D36",
        leaf: "#2E6246",
        leafbright: "#2E6246",
        leafaccent: "#2E6246",
        leafdim: "#EAF0E8",
        leafdimline: "#BED2C1",
      },
    },
  },
  plugins: [],
};
export default config;
