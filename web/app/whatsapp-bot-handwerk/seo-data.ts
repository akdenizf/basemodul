export const faqs = [
  {
    question: "Was macht ein WhatsApp-Bot für Handwerksbetriebe?",
    answer:
      "Er hilft, Nachrichten, Fotos und fehlende Angaben strukturiert abzufragen, damit aus einer losen WhatsApp-Anfrage ein bearbeitbarer Vorgang wird. Bei BaseModul bleibt die fachliche Entscheidung beim Betrieb.",
  },
  {
    question: "Welche Angaben kann BaseModul über WhatsApp abfragen?",
    answer:
      "Typische Angaben sind Name, Rückrufnummer, Einsatzort, Anliegen, Dringlichkeit, Fotos, Dokumente und der gewünschte nächste Schritt. Die Pflichtfelder werden je Betrieb und Gewerk festgelegt.",
  },
  {
    question: "Kann BaseModul WhatsApp-Anfragen automatisch priorisieren?",
    answer:
      "BaseModul kann vereinbarte Signale erfassen und eine Übergabe vorbereiten. Kritische oder unklare Fälle sollten nach klaren Regeln an eine zuständige Person gehen.",
  },
  {
    question: "Ersetzt ein WhatsApp-Bot den persönlichen Kundenkontakt?",
    answer:
      "Nein. Der Bot unterstützt die erste Aufnahme und Sortierung. Rückruf, fachliche Einschätzung, Angebot und Terminentscheidung bleiben beim Team.",
  },
  {
    question: "Wie startet ein Betrieb mit WhatsApp-Automatisierung?",
    answer:
      "Sinnvoll ist ein Pilot mit einem konkreten Anfragefall: zum Beispiel Reparaturanfrage mit Foto. Danach werden Vollständigkeit, Rückrufzeit, Korrekturen und Fallbacks geprüft.",
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
        name: "WhatsApp-Bot Handwerk",
        item: "https://www.basemodul.de/whatsapp-bot-handwerk",
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
