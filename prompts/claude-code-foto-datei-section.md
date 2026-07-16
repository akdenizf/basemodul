# Claude Code Prompt: BaseModul Foto-&-Datei-Sektion separat ausbauen

Du arbeitest im Repo:

`/Users/user/Desktop/Projects/basemodul`

## Aufgabe

Baue bzw. schärfe eine separate **Foto-&-Datei-Sektion** für die BaseModul-Landing.

Wichtig: Diese Aufgabe kommt **nach** dem globalen Komprimierungs-/CTA-Feinschliff. Falls die Seite schon insgesamt zu voll wirkt, baue die Foto-Sektion schlank und modular — nicht als langen Zusatzblock.

## Kontext zuerst lesen

1. `CLAUDE.md`
2. `web/CLAUDE.md`
3. `web/components/landing/CLAUDE.md`
4. `docs/content/heykiki-strategy-transfer-2026-07-16.md`
5. `web/app/page.tsx`
6. bestehende relevante Komponenten, z. B. `VisualContextSection.tsx`, `ModulesSection.tsx`, `UseCasesSection.tsx`, `LiveDemoSection.tsx`

## Ziel der Sektion

Die Sektion soll zeigen:

> Wenn nach einem Anruf, einer WhatsApp oder einem Formular ein Foto/Dokument fehlt, fragt BaseModul gezielt nach und bündelt alles in einem vollständigen Vorgang.

Das ist besonders relevant für:

- Kfz / Gutachter / Werkstätten
- Handwerk / Reparaturfälle
- Entrümpelung / Reinigung
- Servicebetriebe mit Vor-Ort-Einschätzung

## Positionierung

Nicht:

> KI erkennt automatisch alles und erstellt verbindliche Angebote.

Sondern:

> Fotos, Dokumente und Kontext werden sauber eingesammelt, damit das Team schneller einschätzen und zurückrufen kann.

Mensch bleibt in Kontrolle.

## Empfohlene Copy

Section Label:

> Foto & Datei

Headline-Option A:

> Fotos rein. Vollständiger Vorgang raus.

Headline-Option B:

> Wenn ein Bild fehlt, fragt BaseModul nach.

Headline-Option C:

> Aus Fotos und kurzen Nachrichten wird ein bearbeitbarer Fall.

Empfehlung: Option A, wenn die Seite mehr Punch braucht. Option B, wenn es ruhiger und prozessnäher bleiben soll.

Subline:

> BaseModul sammelt Fotos, Dokumente und fehlende Angaben ein — und übergibt alles mit Kontakt, Kontext und nächstem Schritt ans Team.

## Inhaltlicher Ablauf

Die Sektion soll in 3 Schritten funktionieren:

1. **Anfrage kommt unvollständig rein**
   - „Kunde schickt 3 Fotos per WhatsApp“
   - Problem: kein Ort, kein Kontext, keine Rückrufnummer oder kein Fahrzeugschein

2. **BaseModul fragt gezielt nach**
   - Rückrufnummer
   - Ort / Objekt / Fahrzeugdaten
   - kurze Beschreibung
   - Dringlichkeit
   - weitere Fotos/Dokumente über Upload-Link

3. **Team bekommt einen Vorgang**
   - Kontakt
   - Bilder/Dateien
   - Kurzbeschreibung
   - fehlende Infos markiert oder „vollständig“
   - empfohlener nächster Schritt

## Visual-Idee

Bitte keinen großen neuen Overkill bauen. Eine kompakte visuelle Karte reicht:

Links:

- WhatsApp/Fotos/Formular als Eingang
- 2–3 kleine Chips: „Foto erhalten“, „Fahrzeugschein fehlt“, „Ort fehlt“

Rechts:

- Übergabekarte „Schadenfall / Reparaturfall / Anfrage mit Anhang“
- Status: „Bereit zur Übergabe“
- Felder: Kontakt, Anliegen, Anhänge, fehlende Infos, nächster Schritt

## Copy-Details

Gute Microcopy:

- „Foto erhalten — Kontext fehlt“
- „Upload-Link verschickt“
- „2 Fotos + Fahrzeugschein ergänzt“
- „Rückruf vorbereitet“
- „Team entscheidet“

Vermeiden:

- „automatisch Angebot erstellt“
- „Schaden sicher erkannt“
- „rechtlich verbindliche Einschätzung“
- „vollautomatische Gutachten“

## Platzierung

Empfohlene Position:

Nach `WorkflowSection` oder nach `ModulesSection`, aber nicht zu spät, wenn Foto/Kfz ein wichtiger Proof ist.

Wenn bereits eine `VisualContextSection` existiert und genau diese Rolle erfüllt, bitte eher diese Komponente schärfen statt eine neue zusätzliche Sektion zu bauen.

Wenn eine neue Komponente sinnvoll ist, nutze einen klaren Namen, z. B.:

`web/components/landing/PhotoFileSection.tsx`

und binde sie in `web/app/page.tsx` ein.

## Kompaktheits-Regel

Maximal:

- eine Headline
- eine Subline
- 3 Schrittpunkte
- eine visuelle Übergabekarte
- ein kurzer CTA oder Link

Kein langer Branchenblock. Keine zweite Module-Sektion.

## CTA

Falls ein CTA in der Sektion vorkommt, nutze:

> 30-Minuten-Check buchen

oder sekundär:

> Beispiel ansehen

Nicht zu viele verschiedene CTA-Varianten.

## Technische Regeln

- Dark Premium beibehalten.
- Keine neuen Dependencies.
- Keine Backend-/Upload-Funktion wirklich bauen.
- Kein echter Upload, kein echtes Kundendaten-Handling.
- Nur statische/demoartige Darstellung.
- Keine API-Routes aus `_parked` reaktivieren.
- Keine Secrets.
- Keine Hausverwaltung.
- Keine Callfolio-Begriffe.

## Verifikation

Nach Änderung:

```bash
cd web
npm run build
```

Browser-Check:

- Sektion wirkt nicht zu voll
- Foto-&-Datei-Nutzen ist in 5 Sekunden verständlich
- Mensch bleibt in Kontrolle
- kein falsches Versprechen von automatischer Schadensbewertung oder Angebotserstellung
- CTA bleibt konsistent mit 30-Minuten-Check

## Ergebnisbericht

Kurz berichten:

- ob neue Komponente oder bestehende Komponente angepasst wurde
- wo sie in `page.tsx` eingebunden ist
- ob `npm run build` grün war
- ob die Sektion eher kompakt oder noch zu voll wirkt
