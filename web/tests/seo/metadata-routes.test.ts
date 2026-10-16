import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
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
import { metadata as phoneServiceMetadata } from "@/app/telefonservice-handwerk/page";
import {
  faqs as phoneServiceFaqs,
  structuredData as phoneServiceStructuredData,
} from "@/app/telefonservice-handwerk/seo-data";
import { metadata as qualifyMetadata } from "@/app/kundenanfragen-qualifizieren-handwerk/page";
import {
  faqs as qualifyFaqs,
  structuredData as qualifyStructuredData,
} from "@/app/kundenanfragen-qualifizieren-handwerk/seo-data";

describe("public SEO metadata routes", () => {
  it("publishes a homepage entity graph for BaseModul", () => {
    const homepageSource = readFileSync(new URL("../../app/page.tsx", import.meta.url), "utf8");

    expect(homepageSource).toContain('type="application/ld+json"');
    expect(homepageSource).toContain("#organization");
    expect(homepageSource).toContain("#website");
    expect(homepageSource).toContain("#webpage");
  });

  it("does not expose placeholder copy on the public about page", () => {
    const aboutSource = readFileSync(new URL("../../app/ueber-uns/page.tsx", import.meta.url), "utf8");

    expect(aboutSource).not.toContain("[Platzhalter:");
  });

  it("connects the about page to the canonical BaseModul entity", () => {
    const aboutSource = readFileSync(new URL("../../app/ueber-uns/page.tsx", import.meta.url), "utf8");

    expect(aboutSource).toContain('type="application/ld+json"');
    expect(aboutSource).toContain('"@type": "AboutPage"');
    expect(aboutSource).toContain("https://www.basemodul.de/#organization");
    expect(aboutSource).toContain("https://www.basemodul.de/#website");
  });

  it("links every priority SEO route from the shared public footer", () => {
    const footerSource = readFileSync(new URL("../../components/landing/Footer.tsx", import.meta.url), "utf8");
    const priorityRoutes = [
      "/kundenanfragen-handwerk-automatisieren",
      "/ki-telefonassistent-shk",
      "/whatsapp-bot-handwerk",
      "/telefonservice-handwerk",
      "/kundenanfragen-qualifizieren-handwerk",
    ];

    for (const route of priorityRoutes) {
      expect(footerSource).toContain(`href: "${route}"`);
    }
  });

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
      "https://www.basemodul.de/telefonservice-handwerk",
      "https://www.basemodul.de/kundenanfragen-qualifizieren-handwerk",
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
    const service = structuredData.find((entry) => entry["@type"] === "Service");

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
    expect(service).toMatchObject({
      url: "https://www.basemodul.de/ki-telefonassistent-shk",
      provider: { "@id": "https://www.basemodul.de/#organization" },
    });
  });

  it("publishes the handwerk request automation pillar page with schema support", () => {
    expect(requestAutomationMetadata.title).toBe("Kundenanfragen im Handwerk automatisieren | BaseModul");
    expect(requestAutomationMetadata.alternates?.canonical).toBe("/kundenanfragen-handwerk-automatisieren");

    const breadcrumb = requestAutomationStructuredData.find((entry) => entry["@type"] === "BreadcrumbList");
    const faqPage = requestAutomationStructuredData.find((entry) => entry["@type"] === "FAQPage");
    const service = requestAutomationStructuredData.find((entry) => entry["@type"] === "Service");

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
    expect(service).toMatchObject({
      url: "https://www.basemodul.de/kundenanfragen-handwerk-automatisieren",
      provider: { "@id": "https://www.basemodul.de/#organization" },
    });
  });

  it("publishes the WhatsApp bot handwerk page with schema support", () => {
    expect(whatsappMetadata.title).toBe("WhatsApp-Bot für Handwerksbetriebe | BaseModul");
    expect(whatsappMetadata.alternates?.canonical).toBe("/whatsapp-bot-handwerk");

    const breadcrumb = whatsappStructuredData.find((entry) => entry["@type"] === "BreadcrumbList");
    const faqPage = whatsappStructuredData.find((entry) => entry["@type"] === "FAQPage");
    const service = whatsappStructuredData.find((entry) => entry["@type"] === "Service");

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
    expect(service).toMatchObject({
      url: "https://www.basemodul.de/whatsapp-bot-handwerk",
      provider: { "@id": "https://www.basemodul.de/#organization" },
    });
  });

  it("publishes the telefonservice handwerk page with schema support", () => {
    expect(phoneServiceMetadata.title).toBe("Telefonservice für Handwerksbetriebe | BaseModul");
    expect(phoneServiceMetadata.alternates?.canonical).toBe("/telefonservice-handwerk");

    const breadcrumb = phoneServiceStructuredData.find((entry) => entry["@type"] === "BreadcrumbList");
    const faqPage = phoneServiceStructuredData.find((entry) => entry["@type"] === "FAQPage");
    const service = phoneServiceStructuredData.find((entry) => entry["@type"] === "Service");

    expect(breadcrumb).toMatchObject({
      itemListElement: [
        { item: "https://www.basemodul.de" },
        { item: "https://www.basemodul.de/telefonservice-handwerk" },
      ],
    });
    expect(faqPage).toMatchObject({
      mainEntity: expect.arrayContaining([
        expect.objectContaining({
          name: "Was ist ein Telefonservice für Handwerksbetriebe?",
        }),
      ]),
    });
    expect(faqPage?.mainEntity).toHaveLength(phoneServiceFaqs.length);
    expect(service).toMatchObject({
      url: "https://www.basemodul.de/telefonservice-handwerk",
      provider: { "@id": "https://www.basemodul.de/#organization" },
    });
  });

  it("publishes the kundenanfragen qualifizieren page with schema support", () => {
    expect(qualifyMetadata.title).toBe("Kundenanfragen qualifizieren im Handwerk | BaseModul");
    expect(qualifyMetadata.alternates?.canonical).toBe("/kundenanfragen-qualifizieren-handwerk");

    const breadcrumb = qualifyStructuredData.find((entry) => entry["@type"] === "BreadcrumbList");
    const faqPage = qualifyStructuredData.find((entry) => entry["@type"] === "FAQPage");

    expect(breadcrumb).toMatchObject({
      itemListElement: [
        { item: "https://www.basemodul.de" },
        { item: "https://www.basemodul.de/kundenanfragen-qualifizieren-handwerk" },
      ],
    });
    expect(faqPage).toMatchObject({
      mainEntity: expect.arrayContaining([
        expect.objectContaining({
          name: "Was bedeutet Kundenanfragen qualifizieren?",
        }),
      ]),
    });
    expect(faqPage?.mainEntity).toHaveLength(qualifyFaqs.length);
  });
});
