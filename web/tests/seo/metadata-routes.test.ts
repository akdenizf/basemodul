import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

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
      "https://www.basemodul.de/kontakt",
      "https://www.basemodul.de/ueber-uns",
      "https://www.basemodul.de/karriere",
      "https://www.basemodul.de/impressum",
      "https://www.basemodul.de/datenschutz",
      "https://www.basemodul.de/agb",
    ]);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
