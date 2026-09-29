export const faqs = [
  {
    question: "Was bedeutet Kundenanfragen qualifizieren?",
    answer:
      "Eine Anfrage ist qualifiziert, wenn das Team genug Informationen hat, um den nächsten Schritt zu entscheiden: Rückruf, Termin, Angebot, Nachforderung oder menschliche Prüfung.",
  },
  {
    question: "Welche Informationen braucht ein Handwerksbetrieb für eine gute Anfrage?",
    answer:
      "Typische Pflichtfelder sind Name, Rückrufmöglichkeit, Einsatzort, Anliegen, Dringlichkeit, Fotos oder Dokumente, gewünschter Zeitraum und zuständige Person oder Team.",
  },
  {
    question: "Wie priorisiert man Kundenanfragen im Handwerk?",
    answer:
      "Priorisierung sollte nach vereinbarten Signalen erfolgen: Dringlichkeit, Gewerk, Ort, vorhandene Unterlagen, Kundensituation und verfügbare Zuständigkeit. Unklare Fälle gehören in eine menschliche Prüfung.",
  },
  {
    question: "Kann BaseModul automatisch entscheiden, was wichtig ist?",
    answer:
      "BaseModul kann Informationen sammeln und nach vereinbarten Regeln vorbereiten. Fachliche Bewertung, als kritisch markierte Fälle und Grenzentscheidungen bleiben beim Betrieb.",
  },
  {
    question: "Wie startet man mit besserer Anfragequalifizierung?",
    answer:
      "Starten Sie mit einem wiederkehrenden Anfragefall, definieren Sie Pflichtfelder, messen Sie Pflichtfeld-Abdeckung und Rückrufzeit im Pilot und schärfen Sie den Ablauf nach echten Fällen nach.",
  },
];

export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "BaseModul",
        item: "https://www.basemodul.de",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kundenanfragen qualifizieren",
        item: "https://www.basemodul.de/kundenanfragen-qualifizieren-handwerk",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
];
