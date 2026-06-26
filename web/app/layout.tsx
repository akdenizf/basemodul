import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  title: "basemodul.de — KI-Telefonassistent für Servicebetriebe",
  description:
    "KI-Telefonassistent für Servicebetriebe: Anrufe entgegennehmen, fehlende Infos abfragen und Rückrufnotizen, Termine oder Notfälle sauber ans Team übergeben.",
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
      <body
        className={`min-h-screen font-sans bg-paper text-ink ${inter.variable} ${jetbrainsMono.variable} ${inter.className}`}
        style={{ WebkitFontSmoothing: "antialiased" }}
      >
        {children}
      </body>
    </html>
  );
}
