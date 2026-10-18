export const homepageFaqs = [
  {
    question: "Ist das ein Callcenter mit echten Menschen?",
    answer:
      "Nein. Ein KI-gestütztes System nimmt die Anfrage nach einem vereinbarten Ablauf auf und sammelt die Angaben, die Ihr Team für den nächsten Schritt braucht.",
  },
  {
    question: "Müssen wir gleich alles nutzen?",
    answer:
      "Nein. Sie starten mit einem Kanal, meistens dem Telefon. WhatsApp, Termine oder Fotos kommen erst dazu, wenn Sie das wollen.",
  },
  {
    question: "Wo kommt die fertige Anfrage bei uns an?",
    answer:
      "Da, wo Sie heute schon arbeiten — E-Mail, WhatsApp oder eine Tabelle. Sie brauchen kein neues System.",
  },
  {
    question: "Entscheidet die KI irgendwas selbst?",
    answer:
      "Nein. Sie sammelt Infos und gibt sie weiter. Zusagen, Angebote und Termine entscheidet immer Ihr Team.",
  },
  {
    question: "Was passiert bei einem echten Notfall?",
    answer:
      "BaseModul erfasst die vereinbarten Angaben und leitet markierte Hinweise nach Ihrem definierten Ablauf an die zuständige Person weiter. Die Bewertung und Entscheidung trifft Ihr Betrieb.",
  },
  {
    question: "Was kostet der Einstieg?",
    answer:
      "Ab 750 € einmalig für einen Kanal, plus 30 Tage testen. Details unten bei den Preisen.",
  },
] as const;

export const homepageStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.basemodul.de/#webpage",
    url: "https://www.basemodul.de/",
    name: "BaseModul | Kundenanfragen für Handwerksbetriebe strukturieren",
    description:
      "BaseModul bringt Telefon, WhatsApp, Web-Anfragen und Fotos in einen strukturierten Vorgang für lokale Servicebetriebe.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.basemodul.de/#website" },
    about: { "@id": "https://www.basemodul.de/#organization" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://www.basemodul.de/#faq",
    mainEntity: homepageFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
] as const;
