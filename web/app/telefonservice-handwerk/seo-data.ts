export const faqs = [
  {
    question: "Was ist ein Telefonservice für Handwerksbetriebe?",
    answer:
      "Ein Telefonservice kann Anrufe entgegennehmen oder Rückrufe vorbereiten. Bei BaseModul wird der Pilot auf konkrete Anfragearten, Zeitfenster und Übergaberegeln begrenzt.",
  },
  {
    question: "Wie unterscheidet sich BaseModul von einem klassischen Sekretariatsservice?",
    answer:
      "BaseModul beschreibt keinen allgemeinen Sekretariatsersatz. Der Ablauf fragt vereinbarte Pflichtinformationen ab und bereitet eine Übergabe an Ihr Team vor, damit Rückruf oder Prüfung mit mehr Kontext starten.",
  },
  {
    question: "Kann BaseModul jeden Anruf automatisch beantworten?",
    answer:
      "Nein. Der Pilot wird auf konkrete Anfragearten und Regeln begrenzt. Unklare, sensible oder als kritisch markierte Fälle werden nach vereinbarten Regeln für eine zuständige Person gekennzeichnet und übergeben.",
  },
  {
    question: "Muss unsere bestehende Telefonnummer geändert werden?",
    answer:
      "Nicht zwingend. Ein Pilot kann mit einer Testnummer beginnen. Später lässt sich prüfen, ob Weiterleitung nach Bürozeit, nach Klingelzeit oder für bestimmte Fälle sinnvoll ist.",
  },
  {
    question: "Welche Informationen sollte die Anrufannahme erfassen?",
    answer:
      "Typische Pflichtfelder sind Name, Rückrufnummer, Einsatzort, Anliegen, Dringlichkeit, vorhandene Fotos oder Unterlagen und die zuständige Person oder Bereitschaft.",
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
        name: "Telefonservice Handwerk",
        item: "https://www.basemodul.de/telefonservice-handwerk",
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
