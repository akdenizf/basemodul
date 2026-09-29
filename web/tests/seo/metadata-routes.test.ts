import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata as shkMetadata } from "@/app/ki-telefonassistent-shk/page";
import { faqs, structuredData } from "@/app/ki-telefonassistent-shk/seo-data";
import { metadata as requestAutomationMetadata } from "@/app/kundenanfragen-handwerk-automatisieren/page";
import {
  faqs as requestAutomationFaqs,
  structuredData as requestAutomationStructuredData,
} from "@/app/kundenanfragen-handwerk-automatisieren/seo-data";
import { metadata as whatsappMetadata } from "@/app/whatsapp-bot-handwerk/page";
import {
  faqs as whatsappFaqs,
  structuredData as whatsappStructuredData,
} from "@/app/whatsapp-bot-handwerk/seo-data";

describe("public SEO metadata routes", () => {
  it("allows public crawling and advertises the canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/design/", "/_next/"],
      },
      sitemap: "https://www.basemodul.de/sitemap.xml",
      host: "https://www.basemodul.de",
    });
  });

  it("lists every public route on the canonical host", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual([
      "https://www.basemodul.de",
      "https://www.basemodul.de/ki-telefonassistent-shk",
      "https://www.basemodul.de/kundenanfragen-handwerk-automatisieren",
      "https://www.basemodul.de/whatsapp-bot-handwerk",
      "https://www.basemodul.de/kontakt",
      "https://www.basemodul.de/ueber-uns",
      "https://www.basemodul.de/karriere",
      "https://www.basemodul.de/impressum",
      "https://www.basemodul.de/datenschutz",
      "https://www.basemodul.de/agb",
    ]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("keeps the SHK landing page aligned with the primary search intent", () => {
    expect(shkMetadata.title).toBe("KI-Telefonassistent für SHK-Betriebe | BaseModul");
    expect(shkMetadata.alternates?.canonical).toBe("/ki-telefonassistent-shk");

    const breadcrumb = structuredData.find((entry) => entry["@type"] === "BreadcrumbList");
    const faqPage = structuredData.find((entry) => entry["@type"] === "FAQPage");

    expect(breadcrumb).toMatchObject({
      itemListElement: [
        { item: "https://www.basemodul.de" },
        { item: "https://www.basemodul.de/ki-telefonassistent-shk" },
      ],
    });
    expect(faqPage).toMatchObject({
      mainEntity: expect.arrayContaining([
        expect.objectContaining({
          name: "Was macht ein KI-Telefonassistent für SHK-Betriebe?",
        }),
      ]),
    });
    expect(faqPage?.mainEntity).toHaveLength(faqs.length);
  });

  it("publishes the handwerk request automation pillar page with schema support", () => {
    expect(requestAutomationMetadata.title).toBe("Kundenanfragen im Handwerk automatisieren | BaseModul");
    expect(requestAutomationMetadata.alternates?.canonical).toBe("/kundenanfragen-handwerk-automatisieren");

    const breadcrumb = requestAutomationStructuredData.find((entry) => entry["@type"] === "BreadcrumbList");
    const faqPage = requestAutomationStructuredData.find((entry) => entry["@type"] === "FAQPage");

    expect(breadcrumb).toMatchObject({
      itemListElement: [
        { item: "https://www.basemodul.de" },
        { item: "https://www.basemodul.de/kundenanfragen-handwerk-automatisieren" },
      ],
    });
    expect(faqPage).toMatchObject({
      mainEntity: expect.arrayContaining([
        expect.objectContaining({
          name: "Wie kann ein Handwerksbetrieb Kundenanfragen automatisieren?",
        }),
      ]),
    });
    expect(faqPage?.mainEntity).toHaveLength(requestAutomationFaqs.length);
  });

  it("publishes the WhatsApp bot handwerk page with schema support", () => {
    expect(whatsappMetadata.title).toBe("WhatsApp-Bot für Handwerksbetriebe | BaseModul");
    expect(whatsappMetadata.alternates?.canonical).toBe("/whatsapp-bot-handwerk");

    const breadcrumb = whatsappStructuredData.find((entry) => entry["@type"] === "BreadcrumbList");
    const faqPage = whatsappStructuredData.find((entry) => entry["@type"] === "FAQPage");

    expect(breadcrumb).toMatchObject({
      itemListElement: [
        { item: "https://www.basemodul.de" },
        { item: "https://www.basemodul.de/whatsapp-bot-handwerk" },
      ],
    });
    expect(faqPage).toMatchObject({
      mainEntity: expect.arrayContaining([
        expect.objectContaining({
          name: "Was macht ein WhatsApp-Bot für Handwerksbetriebe?",
        }),
      ]),
    });
    expect(faqPage?.mainEntity).toHaveLength(whatsappFaqs.length);
  });
});
