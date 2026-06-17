import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono, Calistoga } from "next/font/google";

// AGENTEQ "Professional Navy" type system:
// Body = Inter, Display/Headings = Calistoga (serif), Mono = JetBrains Mono.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const calistoga = Calistoga({ subsets: ["latin"], weight: "400", variable: "--font-calistoga" });

// ============================================================
// AGENTEQ ROOT LAYOUT
// ============================================================
// Shared root layout for all routes.
// Route groups add their own providers (e.g., ThemeProvider for app).
// ============================================================

export const metadata: Metadata = {
  title: "AGENTEQ — Anfrage-Assistent für KMU",
  description:
    "Der Anfrage-Assistent für kleine Betriebe: nimmt Anrufe und Nachrichten entgegen, erkennt Dringlichkeit, fragt fehlende Infos ab und legt jede Anfrage sauber für Ihr Team bereit.",
  icons: {
    icon: "/icon.svg?v=2",
    shortcut: "/icon.svg?v=2",
    apple: "/icon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning className="antialiased scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`min-h-screen font-sans ${inter.variable} ${jetbrainsMono.variable} ${calistoga.variable} ${inter.className} bg-neutral-100 text-neutral-900`}>
        {/* SVG Noise Overlay */}
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03] mix-blend-overlay">
          <svg className="absolute inset-0 h-full w-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        {children}
      </body>
    </html>
  );
}
