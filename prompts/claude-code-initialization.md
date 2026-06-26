# Claude Code Initialisierungs-Prompt: basemodul.de

Du arbeitest im Repo:

`/Users/user/Desktop/Projects/Agenteq-KMU-Assistants`

## Wichtig

Bitte **noch keinen Code ändern**.

Deine erste Aufgabe ist:

1. Repo-Kontext lesen
2. aktuellen Stand verstehen
3. vorhandene Änderungen/Diffs prüfen
4. Feedback geben, ob die Richtung sauber ist
5. konkreten Umsetzungsvorschlag machen

Erst wenn Fatih danach ausdrücklich sagt, dass du bauen sollst, fängst du mit
Code-Änderungen an.

## Hintergrund

AGENTEQ bleibt die Dachfirma / Enterprise-Marke.

**basemodul.de** ist die Produktmarke für modulare KI-Assistenten:

- Telefon-Modul
- Termin-Modul
- WhatsApp-Modul
- Foto-/Schaden-Modul
- Notdienst-Modul

Die bestehende Web-App unter `web/` kommt aus einem Callfolio-Template. Sie soll
schrittweise auf basemodul.de umgebaut werden.

Ziel ist **nicht**:

- eine AGENTEQ-Agentur-Landingpage
- eine Callfolio-Kopie mit anderem Text
- ein riesiges SaaS-/Dashboard-Versprechen
- Hausverwaltung als Zielnische
- generisches "KI für KMU"-Blabla

Ziel ist:

> Eine klare Produktseite für KI-Module, die Betrieben helfen, Anrufe, Termine,
> WhatsApp-Anfragen, Fotos und Notfälle vorzustrukturieren und sauber ans Team
> zu übergeben.

## Bitte zuerst lesen

Lies nur diese Dateien, bevor du tiefer gehst:

1. `CLAUDE.md`
2. `README.md`
3. `OFFER.md`
4. `PLAN.md`
5. `WIREFRAME.md`
6. `DESIGN_BRIEF.md`
7. `web/CLAUDE.md`
8. `web/components/landing/CLAUDE.md`
9. `prompts/basemodul-landing-implementation.md`

Danach prüfe:

```bash
git status --short
git diff --stat
git diff -- web/app web/components/landing
```

Wichtig: Es gibt möglicherweise bereits uncommitted Änderungen von Codex. Bitte
diese nicht blind überschreiben. Erst verstehen und bewerten.

## Deine erste Antwort an Fatih

Bitte gib eine kompakte, aber nützliche Einschätzung:

### 1. Was du verstanden hast

- Was ist basemodul.de?
- Was ist AGENTEQ?
- Welche Module sollen angeboten werden?
- Was soll bewusst vermieden werden?

### 2. Aktueller Repo-Zustand

- Welche relevanten Dateien/Sektionen gibt es?
- Welche Änderungen sind bereits im Diff?
- Sieht der bisherige Umbau sinnvoll aus oder eher zurückrollen?

### 3. Risiken / offene Punkte

Bitte ehrlich sagen:

- Wo wirkt es noch zu sehr nach Callfolio?
- Wo ist Copy noch unklar?
- Wo ist Design noch nicht passend?
- Wo könnten technische Fehler entstehen?

### 4. Dein Umsetzungsvorschlag

Bitte schlage einen kleinen, sauberen nächsten Schritt vor.

Nicht:

- kompletten Rewrite
- riesiger Design-Umbau
- neue Dependencies
- Backend reaktivieren

Sondern:

- Landing inhaltlich sauber auf basemodul.de trimmen
- Module sichtbar machen
- Demo erhalten
- Hausverwaltung raus
- AGENTEQ nur als Trust-Layer
- Build prüfen

## Antwortstil

Antworte auf Deutsch.

Locker, direkt, professionell.

Bitte mit dieser Struktur:

```text
✅ Verstanden
- ...

🧪 Repo-Check
- ...

⚠️ Wichtig
- ...

➡️ Vorschlag
- ...
```

Keine langen Theorieblöcke. Erst Orientierung geben, dann um Freigabe für die
Umsetzung bitten.
