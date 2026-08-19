# basemodul.de Design-Brief

> **Diese Datei ist die verbindliche Design-Richtlinie.**
>
> Die frühere „Dark Premium“-Richtung ist abgelöst. Maßgeblich ist die aktive Next.js-Landing unter [`web/`](web/) zusammen mit [`DESIGN_DIRECTION_HANDWERKSNAH.md`](DESIGN_DIRECTION_HANDWERKSNAH.md). Die ältere Root-Referenz `index.html` dient nicht mehr als visuelle Vorgabe.

## Richtung

**Hell, klar, handwerksnah und verlässlich.** BaseModul darf modern aussehen, aber niemals wie eine abstrakte AI- oder SaaS-Oberfläche. Die visuelle Welt beginnt beim Arbeitsalltag eines Servicebetriebs: Rückrufnotiz, Einsatzort, Ansprechpartner, Dringlichkeit, Zuständigkeit und nächster Schritt.

> Nicht: „Hier ist eine intelligente Software.“
>
> Sondern: „So kommt eine Anfrage bei Ihrem Team an, damit es handeln kann.“

Die entscheidende Bildmetapher ist die **saubere Arbeitsmappe**. Eine starke Seite zeigt ein brauchbares Ergebnis, nicht zuerst ein Gerät, ein Dashboard oder eine technische Funktion.

## Farben

| Rolle | Wert | Wirkung |
|---|---|---|
| Seitenhintergrund | `#F7F5EF` | Warmes Off-White, wie ein ruhiger Arbeitsbereich |
| Papier / Karten | `#FFFFFF` | Sauber, verständlich, greifbar |
| Alternative Fläche | `#EFEEE6` | Ruhige Abschnittstrennung |
| Tinte / Headlines | `#1F2A23` | Ernsthaft und bodenständig |
| Fließtext | `#687169` | Lesbar, nicht technisch-kalt |
| Linien | `#DDDCD3` | Materielle Papierlinie statt UI-Haarrand |
| Primärfarbe | `#2E6246` | Tiefes Waldgrün für Vertrauen, CTA und bestätigte Übergaben |
| Funktionsakzent | `#D8843F` | Gedämpftes Orange für Priorität, Warnung oder Markierung |
| Statusfläche | `#EAF0E8` | Ruhiges Grün für gelöste/übergebene Vorgänge |

Waldgrün ist die einzige dominante Markenfarbe. Orange ist kein zweiter CTA-Farbton und kein Dekoelement; es markiert funktional Dringlichkeit oder einen Orientierungspunkt im Ablauf.

## Typografie

- **Inter** bleibt die Grundschrift: direkt, modern und im Betrieb gut lesbar.
- Hero-Headlines bleiben klar und groß, aber ohne Tech-Launch-Gefühl. Der Akzent liegt auf einem betriebsnahen Ergebnis, nicht auf „KI“.
- Kleine Labels dürfen in Uppercase erscheinen; Hauptüberschriften und Absätze bleiben in natürlicher Schreibweise.
- Monospace ist ausschließlich für praktische Metadaten wie Vorgangsnummer, Zeit oder Status geeignet, nie als Design-Selbstzweck.

## Komponenten

- **Navigation:** Helles, ruhiges Headerband; Waldgrün nur für den klaren nächsten Schritt.
- **Hero:** Helle Fläche, echte Betriebssituation in der Copy und eine Rückruf-/Einsatznotiz als zentraler Beleg. Keine dominanten Smartphone-Mockups.
- **Arbeitsmappe / Vorgang:** Weiße Fläche, solide Linien, leichte Schatten, konkrete Felder und sichtbare Zuständigkeit. Der Leser muss sie in Sekunden verstehen.
- **Karten:** Weiß oder leicht gebrochen, geringer Radius, robuste Linie, zurückhaltender Schatten. Kein Glassmorphism, keine Glows, keine schwebenden App-Kacheln.
- **CTA:** Waldgrüne Schaltfläche mit weißer Schrift; sekundäre Aktion als weiße Papierfläche mit grüner oder neutraler Linie.
- **Abschnittsübergänge:** Ruhige Papierlinie mit kleiner Markierung statt animierter Lichtnaht.

## Bildsprache

- Bevorzugt echte, lizenzierte oder selbst erstellte Szenen aus Service, Werkstatt, Anlage, Einsatz und Teamübergabe.
- Keine generischen Stock-Handshake-Motive, keine Roboter, keine futuristischen Gerätebilder und keine austauschbaren Software-Screenshots.
- Wenn kein Foto nötig ist, sind klare Arbeitsartefakte – Rückrufnotiz, Einsatzkarte, Ablaufzettel – die bessere Wahl.

## Inhaltliche Leitplanken

- Marke: **basemodul.de**; **AGENTEQ** bleibt Trust-/Anbieter-Layer im Hintergrund.
- Module: Telefon, Termin, WhatsApp, Foto-/Schaden und Notdienst folgen immer demselben Prinzip: **Eingang → fehlende Informationen → vollständige Übergabe**.
- Keine Hausverwaltung als BaseModul-Lane. Keine Fake-Claims und keine AI-Buzzwords.
- Telefon ist ein häufiger Einstieg, aber nie die gesamte Markenidentität.
- Notfälle werden nach Regeln an Menschen informiert; fachliche und verbindliche Entscheidungen bleiben beim Betrieb.

## Technische Leitplanken

- Die aktive Referenz ist die Next.js-Landing in `web/`.
- Responsive Gestaltung, echte Tastaturfokusse und `prefers-reduced-motion` bleiben erhalten.
- Neue Elemente werden zuerst auf ihre Alltagsrelevanz geprüft: Hilft dieses Element dem Betrieb, Vorgang und nächsten Schritt sofort zu verstehen?
