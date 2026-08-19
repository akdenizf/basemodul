#import "report-theme.typ": report-theme

#show: report-theme.with(
  title: "BaseModule SHK-Anfrage-Eingang Pilot",
  author: "BaseModule · AGENTEQ",
  rhythm: "report",
  running-header: false,
)

#set page(
  paper: "a4",
  margin: (top: 1.15cm, bottom: 1cm, x: 1.3cm),
  header: none,
  footer: align(center, text(size: 7pt, fill: rgb("788294"))[Arbeitsvorlage · vor Versand kundenspezifisch ausfüllen]),
)
#set text(font: "Noto Sans", size: 8.5pt, fill: rgb("182230"))
#set par(first-line-indent: 0pt, leading: 1.08em, spacing: 0.2em)

#let ink = rgb("182230")
#let muted = rgb("586579")
#let green = rgb("23713D")
#let pale = rgb("EEF6F0")
#let line = rgb("D9E2DC")
#let soft = rgb("F7F9F8")
#let label(body) = text(size: 7.2pt, weight: "bold", fill: green, tracking: 0.06em, upper(body))
#let card(body) = block(fill: soft, stroke: 0.7pt + line, radius: 7pt, inset: 8pt, body)
#let tick(body) = grid(columns: (11pt, 1fr), column-gutter: 4pt, text(fill: green, weight: "bold")[✓], body)

#label[BaseModule · Ein Produkt von AGENTEQ]
#v(4pt)
#text(size: 22pt, weight: "bold", fill: ink)[SHK-Anfrage-Eingang Pilot]
#v(1pt)
#text(size: 11.5pt, fill: muted)[Ein klarer Eingang. Vollständige Übergaben. 30 Tage messbar prüfen.]

#v(8pt)
#block(fill: pale, radius: 7pt, inset: 9pt)[
  #text(size: 10.2pt, weight: "bold", fill: green)[Damit relevante Anfragen nicht in Mailbox, Zettel oder unvollständiger Nachricht enden.]
  #v(2pt)
  BaseModule testet mit Ihrem Betrieb einen klar abgegrenzten Anfrage-Eingang. Ihr Team erhält vollständige, priorisierte nächste Schritte — ohne großes Systemprojekt.
]

#v(8pt)
#grid(
  columns: (1fr, 1fr),
  gutter: 8pt,
  card[
    #label[Ihr Pilot]
    #v(4pt)
    #grid(
      columns: (1fr, auto),
      row-gutter: 2pt,
      [Dauer], [*30 Kalendertage*],
      [Eingang], [*Genau ein Primärkanal*],
      [Bereich], [*Ihr klarer SHK-Prozess*],
      [Preis], [*1.250 € einmalig zzgl. USt.*],
    )
    #v(5pt)
    #text(size: 7.6pt, fill: muted)[Telefonie-, Messaging- und weitere externe Nutzungskosten nur transparent und vorab abgestimmt.]
  ],
  card[
    #label[Enthalten]
    #v(4pt)
    #stack(
      spacing: 3pt,
      tick[Prozess-Check, Pflichtinformationen und Zuständigkeiten],
      tick[Begrenzte Konfiguration, Testfälle und Produktivstart],
      tick[Strukturierte Team-Übergabe und menschlicher Fallback],
      tick[Wöchentlicher Review und Tag-30-Auswertung],
    )
  ],
)

#v(8pt)
#label[Der Ablauf]
#v(4pt)
#grid(
  columns: (1fr, 1fr, 1fr, 1fr),
  gutter: 5pt,
  card[#text(size: 8pt, weight: "bold", fill: green)[01 · Scope] #v(2pt) Kanal, Pflichtinfos, Zuständigkeit, Fallback und Baseline festlegen.],
  card[#text(size: 8pt, weight: "bold", fill: green)[02 · Test] #v(2pt) Normalfall, unvollständige Anfrage und kritischen Fall prüfen.],
  card[#text(size: 8pt, weight: "bold", fill: green)[03 · Pilot] #v(2pt) Reale Anfragen mit Wochen-Scorecard begleiten.],
  card[#text(size: 8pt, weight: "bold", fill: green)[04 · Tag 30] #v(2pt) Ausbauen, nachschärfen, vereinfachen oder pausieren entscheiden.],
)

#v(8pt)
#grid(
  columns: (1fr, 1fr),
  gutter: 8pt,
  card[
    #label[Was Ihr Team erhält]
    #v(4pt)
    Eine relevante Anfrage enthält — gemäß Ihren Regeln — Kontakt, Einsatzort, Anliegen, Dringlichkeit, Kontext und den nächsten Schritt.
    #v(4pt)
    #text(size: 7.7pt, fill: muted)[Fachliche Diagnose, Preis, Vertrag und kritische Entscheidung verbleiben bewusst bei Ihrem Team.]
  ],
  card[
    #label[Was wir gemeinsam messen]
    #v(4pt)
    #stack(
      spacing: 3pt,
      tick[Relevante und nicht angenommene Eingänge],
      tick[Vollständige Übergaben und Zeit bis zum Team],
      tick[Termin- oder Rückrufquote, falls im Scope],
      tick[Korrekturen und menschliche Fallbacks],
    )
  ],
)

#v(8pt)
#block(fill: ink, radius: 7pt, inset: 10pt)[
  #text(fill: white, size: 10pt, weight: "bold")[Nächster Schritt: gemeinsamer 30-Minuten-Check]
  #v(2pt)
  #text(fill: rgb("E2EAE5"), size: 8pt)[Danach erhalten Sie den ausgefüllten „BaseModule Anfrage-Eingang Pilot — Scope & Success Plan“ mit Kanal, Pflichtinformationen, Zuständigkeiten, Fallback und Go-live-Ablauf.]
]

#v(6pt)
#text(size: 7pt, fill: muted)[Für: {{Betriebsname}} · Ansprechpartner: {{Name, Rolle}} · Angebots-ID: {{BM-OFFER-JJJJ-NNN}} · Gültig bis: {{TT.MM.JJJJ}}]
