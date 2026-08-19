# Implementation Brief für Claude Code

Dieses Briefing dient als direkte Arbeitsanweisung für Claude Code zur schrittweisen Transformation der BaseModul Landingpage.

## 1. Betroffene Dateien
Die Änderungen betreffen hauptsächlich die Frontend-Komponenten der Next.js App unter `web/`.
Voraussichtlich anzupassende Dateien (oder deren Äquivalente):
- `web/content/landing.md` (Primärer Content-Layer für Texte)
- `web/src/components/HeroSection.tsx`
- `web/src/components/ModuleSection.tsx` (oder ähnlich, wo "01 — DIE MODULE" definiert ist)
- Neue Komponente für "Use Cases / Nischen" (z.B. `web/src/components/UseCaseSection.tsx`)
- `web/src/components/HowItWorksSection.tsx`

## 2. Reihenfolge der Umsetzung

Bitte die Änderungen strikt in dieser Reihenfolge durchführen und nach jedem Schritt die Seite (auf `localhost:3000`) prüfen.

### Schritt 1: Content Layer aktualisieren
- **Aufgabe:** Aktualisiere die `web/content/landing.md` mit den neuen Texten aus `04-copy-draft.md`.
- **Fokus:** Hero Headline, Subheadline, Module-Beschreibungen und die neuen Use-Case-Texte einfügen.

### Schritt 2: Hero Section umbauen
- **Aufgabe:** Die Hero-Komponente anpassen.
- **Details:** Die neue Headline ("Aus chaotischen Anfragen werden fertige Arbeitsaufträge.") implementieren. Das Visual (rechts) soll nicht mehr nur ein Smartphone sein, sondern idealerweise andeuten, dass Anfragen aus verschiedenen Kanälen strukturiert werden (z.B. abstrakte Icons für Telefon, Chat, Mail, die in einer sauberen Liste enden).
- **Wichtig:** Keine neuen komplexen Animationen bauen, vorhandene UI-Elemente nutzen.

### Schritt 3: Neue Problem Section einfügen
- **Aufgabe:** Direkt unter dem Hero eine kurze Sektion einfügen, die den Painpoint triggert.
- **Details:** Texte aus `04-copy-draft.md` (Abschnitt 2) nutzen. Visuell simpel halten (z.B. 3 kleine Karten oder eine reine Text-Sektion).

### Schritt 4: Module Section anpassen
- **Aufgabe:** Die Hierarchie ("Telefon zuerst") entfernen.
- **Details:** Alle Module (Telefon, WhatsApp, Foto, Termin, Notdienst) als gleichwertige Kacheln/Karten in einem Raster darstellen. Die Artefakt-Darstellung (z.B. die "Rückrufnotiz"-Karte) beibehalten, da sie sehr gut funktioniert.

### Schritt 5: Use-Case Section (Nischen) einbauen
- **Aufgabe:** Die neue Sektion für SHK, Kfz und Entrümpelung einbauen.
- **Details:** Diese Sektion ersetzt oder erweitert das bisherige "Praxisbeispiel". Nutze die Texte aus `04-copy-draft.md` (Abschnitt 4). Visuell können dies einfache Cards sein, die das "Vorher / Mit BaseModul" Szenario beschreiben.

## 3. Was NICHT verändert werden soll
- **Design-System:** Farben (Dark Mode, das spezifische Grün), Typografie und das generelle "Premium"-Gefühl bleiben exakt erhalten.
- **Pricing / Pilot Section:** Die Struktur der Preis-Karten und das Angebot (750€ Pilot) bleiben unangetastet.
- **Backend / Logik:** Es werden keine echten Integrationen, Form-Submits oder API-Calls eingebaut. Reine Frontend-Anpassung.
- **Audio-Player:** Die bestehende Audio-Demo-Komponente bleibt erhalten (kann später durch Videos ergänzt werden, aber für diesen Sprint bleibt sie).

## 4. Akzeptanzkriterien
- Die Landingpage kommuniziert klar ein *horizontales* Intake-System, keinen reinen Telefon-Bot.
- Die Nischen (SHK, Kfz, Service) sind als greifbare Beispiele (Use Cases) präsent.
- Die Seite ist responsive (Mobile-Ansicht darf nicht brechen).
- Der Build (`npm run build`) läuft ohne Fehler durch.

## 5. Hinweis zu Visuals
Erfinde keine komplett neuen UI-Konzepte. Nutze die bestehenden Tailwind-Klassen und Komponenten-Strukturen (wie die Artefakt-Karten aus der aktuellen Module-Section), um die neuen Inhalte darzustellen.
