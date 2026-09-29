export const faqs = [
  {
    question: "Wie kann ein Handwerksbetrieb Kundenanfragen automatisieren?",
    answer:
      "Sinnvoll ist ein kleiner Start: einen Eingangskanal auswählen, Pflichtinformationen definieren, Zuständigkeiten festlegen und die Übergabe an das Team messbar machen. Erst danach sollten weitere Kanäle oder Automatisierungen ergänzt werden.",
  },
  {
    question: "Welche Kundenanfragen eignen sich für einen ersten Pilot?",
    answer:
      "Geeignet sind wiederkehrende Erstkontakte wie Rückrufwünsche, neue Reparaturanfragen, Terminwünsche oder unvollständige WhatsApp-Nachrichten. Hinweise auf kritische Fälle brauchen vorab definierte Regeln und eine menschliche Prüfung.",
  },
  {
    question: "Ersetzt BaseModul Mitarbeitende in der Anfrageannahme?",
    answer:
      "Nein. BaseModul unterstützt die strukturierte Aufnahme, Vorqualifizierung und Übergabe. Fachliche Entscheidungen, Priorisierung im Grenzfall und Kundenkommunikation bleiben beim Betrieb.",
  },
  {
    question: "Welche Informationen sollte eine Kundenanfrage enthalten?",
    answer:
      "Typische Pflichtfelder sind Name, Kontaktmöglichkeit, Einsatzort, Anliegen, Dringlichkeit, Fotos oder Dokumente sowie der gewünschte nächste Schritt. Die genaue Liste wird je Betrieb und Gewerk festgelegt.",
  },
  {
    question: "Wie wird der Erfolg eines Anfrageprozesses gemessen?",
    answer:
      "Messbar sind zum Beispiel Übergaben mit vereinbarten Pflichtfeldern, gemessene Zeit bis zum Rückruf, fehlende Pflichtfelder, Korrekturen durch das Team und Fälle mit menschlichem Fallback. Nicht verfügbare Ausgangsdaten sollten klar als Datenlücke markiert werden.",
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
        name: "Kundenanfragen Handwerk automatisieren",
        item: "https://www.basemodul.de/kundenanfragen-handwerk-automatisieren",
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
