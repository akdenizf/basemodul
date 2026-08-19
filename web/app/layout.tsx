import type { Metadata } from "next";
import "./globals.css";
import { Public_Sans, JetBrains_Mono } from "next/font/google";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  title: "basemodul.de — Anfragen strukturieren. Übergaben automatisieren.",
  description:
    "KI-Telefonassistent für Servicebetriebe: Anrufe entgegennehmen, fehlende Infos abfragen und Rückrufnotizen, Termine oder Notfälle sauber ans Team übergeben.",
  icons: {
    icon: "/icon.svg?v=3",
    shortcut: "/icon.svg?v=3",
    apple: "/icon.svg?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning className="antialiased scroll-smooth">
      <body
        className={`min-h-screen font-sans bg-paper text-ink ${publicSans.variable} ${jetbrainsMono.variable} ${publicSans.className}`}
        style={{ WebkitFontSmoothing: "antialiased" }}
      >
        {children}
      </body>
    </html>
  );
}
