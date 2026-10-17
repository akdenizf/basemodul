import type { Metadata } from "next";
import "./globals.css";
import { Public_Sans, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

const sitewideStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.basemodul.de/#organization",
      name: "BaseModul",
      legalName: "AGENTEQ",
      url: "https://www.basemodul.de",
      description:
        "BaseModul strukturiert Kundenanfragen aus Telefon, WhatsApp, Web und Fotos für lokale Service- und Handwerksbetriebe.",
      logo: {
        "@type": "ImageObject",
        url: "https://www.basemodul.de/logo.png",
        width: 500,
        height: 500,
      },
      founder: {
        "@type": "Person",
        name: "Fatih Mehmet Akdeniz",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@agenteq.de",
        telephone: "+4915901662235",
        availableLanguage: ["de"],
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Karl-Marx-Ring 17",
        postalCode: "81735",
        addressLocality: "München",
        addressCountry: "DE",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "BaseModul Lösungen für Kundenanfragen",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@id": "https://www.basemodul.de/ki-telefonassistent-shk#service" } },
          { "@type": "Offer", itemOffered: { "@id": "https://www.basemodul.de/kundenanfragen-handwerk-automatisieren#service" } },
          { "@type": "Offer", itemOffered: { "@id": "https://www.basemodul.de/whatsapp-bot-handwerk#service" } },
          { "@type": "Offer", itemOffered: { "@id": "https://www.basemodul.de/telefonservice-handwerk#service" } },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.basemodul.de/#website",
      url: "https://www.basemodul.de",
      name: "BaseModul",
      inLanguage: "de-DE",
      publisher: { "@id": "https://www.basemodul.de/#organization" },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.basemodul.de"),
  title: "basemodul.de — Aus Anfragen werden klare nächste Schritte.",
  description:
    "BaseModul bringt Telefon, WhatsApp, Web-Anfragen und Fotos in einen strukturierten Vorgang für lokale Servicebetriebe.",
  robots: {
    index: true,
    follow: true,
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitewideStructuredData) }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
