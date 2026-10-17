import type { MetadataRoute } from "next";

const SITE_URL = "https://www.basemodul.de";

const routes = [
  { path: "", lastModified: "2026-10-17", changeFrequency: "weekly", priority: 1 },
  { path: "/ki-telefonassistent-shk", lastModified: "2026-10-17", changeFrequency: "weekly", priority: 0.9 },
  { path: "/kundenanfragen-handwerk-automatisieren", lastModified: "2026-10-17", changeFrequency: "weekly", priority: 0.85 },
  { path: "/whatsapp-bot-handwerk", lastModified: "2026-10-17", changeFrequency: "weekly", priority: 0.8 },
  { path: "/telefonservice-handwerk", lastModified: "2026-10-17", changeFrequency: "weekly", priority: 0.75 },
  { path: "/kundenanfragen-qualifizieren-handwerk", lastModified: "2026-10-17", changeFrequency: "weekly", priority: 0.7 },
  { path: "/kontakt", lastModified: "2026-10-17", changeFrequency: "monthly", priority: 0.6 },
  { path: "/ueber-uns", lastModified: "2026-10-17", changeFrequency: "monthly", priority: 0.5 },
  { path: "/karriere", lastModified: "2026-09-29", changeFrequency: "monthly", priority: 0.4 },
  { path: "/impressum", lastModified: "2026-09-29", changeFrequency: "yearly", priority: 0.2 },
  { path: "/datenschutz", lastModified: "2026-09-29", changeFrequency: "yearly", priority: 0.2 },
  { path: "/agb", lastModified: "2026-09-29", changeFrequency: "yearly", priority: 0.2 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
  }));
}
