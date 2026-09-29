import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karriere | BaseModul",
  description: "Offene Positionen im Team hinter BaseModul.",
  alternates: { canonical: "/karriere" },
};

export default function KarriereLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
