import type { Metadata } from "next";
import "./globals.css";
import { Public_Sans, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  title: "basemodul.de — Aus Anfragen werden klare nächste Schritte.",
  description:
    "BaseModul bringt Telefon, WhatsApp, Web-Anfragen und Fotos in einen strukturierten Vorgang für lokale Servicebetriebe.",
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
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
