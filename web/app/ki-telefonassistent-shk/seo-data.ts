export const faqs = [
  { question: "Was macht ein KI-Telefonassistent für SHK-Betriebe?", answer: "Er nimmt erste Informationen zu einer Anfrage auf, fragt vereinbarte Pflichtangaben ab und bereitet den nächsten menschlichen Schritt vor. Bei BaseModul bleibt die fachliche Bewertung beim Betrieb." },
  { question: "Ersetzt BaseModul unsere Disposition oder Rezeption?", answer: "Nein. BaseModul sichert die erste Aufnahme der Anfragen, die heute durchfallen - etwa während Einsätzen oder außerhalb der Erreichbarkeit. Zuständigkeit und fachliche Entscheidung bleiben bei Ihrem Team." },
  { question: "Müssen wir unsere bestehende Nummer ändern?", answer: "Nein. Ein Pilot kann mit einer Testnummer starten. Später lässt sich Ihre Nummer nach klaren Regeln weiterleiten, etwa außerhalb der Bürozeit oder nach einer vereinbarten Zahl an Klingelzeichen." },
  { question: "Entscheidet BaseModul selbst, ob ein Notfall vorliegt?", answer: "Nein. Der Ablauf arbeitet nach Ihren vorab vereinbarten Signalen und fragt die benötigten Informationen ab. Hinweise auf kritische Fälle werden markiert und nach vereinbarten Regeln zur menschlichen Prüfung übergeben." },
  { question: "Was kostet der Einstieg?", answer: "Ein klar abgegrenzter Anfrage-Eingang startet ab 750 € Setup. Laufende Kosten für Telefonie, WhatsApp, Betreuung oder zusätzliche Infrastruktur legen wir vor dem Go-live transparent fest." },
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
        name: "KI-Telefonassistent SHK",
        item: "https://www.basemodul.de/ki-telefonassistent-shk",
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
