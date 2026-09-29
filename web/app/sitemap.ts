import type { MetadataRoute } from "next";

const SITE_URL = "https://www.basemodul.de";

const routes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/ki-telefonassistent-shk", changeFrequency: "weekly", priority: 0.9 },
  { path: "/kundenanfragen-handwerk-automatisieren", changeFrequency: "weekly", priority: 0.85 },
  { path: "/kontakt", changeFrequency: "monthly", priority: 0.6 },
  { path: "/ueber-uns", changeFrequency: "monthly", priority: 0.5 },
  { path: "/karriere", changeFrequency: "monthly", priority: 0.4 },
  { path: "/impressum", changeFrequency: "yearly", priority: 0.2 },
  { path: "/datenschutz", changeFrequency: "yearly", priority: 0.2 },
  { path: "/agb", changeFrequency: "yearly", priority: 0.2 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date("2026-09-29"),
    changeFrequency,
    priority,
  }));
}
