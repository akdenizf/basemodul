# 🧊 Callfolio v5.1 – Feature Freeze Dokument

**Status:** AKTIV (ab jetzt)

Dieses Dokument definiert verbindlich, was **Callfolio v5.1** ist – und was **nicht mehr gebaut wird**. Es dient als interner Schutzmechanismus gegen Feature-Creep, Überengineering und strategische Verwässerung.

---

## 🎯 Ziel des Feature Freeze

Callfolio v5.1 soll:

* **verkaufbar** sein
* **pilotfähig** sein
* **haftungs- & DSGVO-sicher** sein
* **ein klar abgegrenztes Kernproblem lösen**

> **Alles, was diese Ziele nicht direkt unterstützt, ist für v5.1 verboten.**

---

## 🧱 Was Callfolio v5.1 FINAL kann

### 1️⃣ Telefonannahme & Strukturierung

* KI nimmt Anrufe entgegen
* erkennt Anliegen
* erstellt Tickets
* eskaliert Notfälle
* erstellt nachvollziehbare Zusammenfassungen

### 2️⃣ Sicheres Mieterdaten-Onboarding (CSV Import)

**STEP 1 – Validierung & Normalisierung**

* Jede Zeile wird geprüft
* Eindeutige Identität erforderlich (tenant_id ODER Name+Adresse+Einheit)
* Telefonnummern werden vereinheitlicht
* Excel-/CSV-Injection wird verhindert
* Ungültige Daten werden abgelehnt, nicht still korrigiert

**STEP 2 – Vorschau / Dry-Run**

* Import ist zunächst nur eine Analyse
* Jede Zeile wird sichtbar kategorisiert (OK / Konflikt / Fehler)
* Keine Daten werden ohne Freigabe gespeichert

**STEP 3 – Commit (Atomic Write)**

* Server-seitige Re-Validierung
* Re-Check aller Konflikte
* ALL-OR-NOTHING: entweder alles korrekt oder nichts
* Keine halben Imports

### 3️⃣ Sicherheit & Haftung

* Admin-only Zugriff
* Session-basierte Authentifizierung
* Keine stillen Aktionen
* Audit-fähige Abläufe

---

## 🚫 Was EXPLIZIT NICHT Teil von v5.1 ist

Diese Punkte sind **bewusst ausgeschlossen**, auch wenn sie technisch möglich wären:

* ❌ Mieter-App
* ❌ Handwerker-Login
* ❌ Automatische Handwerker-Beauftragung ohne Vorschau
* ❌ SAP / Domus / ERP-Integrationen
* ❌ Webhooks zu Drittsystemen
* ❌ Rollen- & Rechteverwaltung über Admin hinaus
* ❌ Realtime-Sync / WebSockets
* ❌ Teil-Importe oder „best effort"-Logik

> **Begründung:**
> Diese Features erhöhen Komplexität, Verkaufswiderstand und Haftungsrisiko – ohne den Kernnutzen für KMU-Hausverwaltungen zu verbessern.

---

## 🛑 Freeze-Regeln (verbindlich)

Ab jetzt gilt:

### ❌ Verboten

* Neue Features
* Neue Endpoints
* Neue Datenmodelle
* Neue Integrationen
* "Könnte man noch …"

### ✅ Erlaubt

* Bugfixes
* Stabilisierung
* Performance-Verbesserungen
* Pilot-spezifische Anpassungen **nur**, wenn sie keinen Scope erweitern

---

## 🧠 Entscheidungsregel (intern)

Wenn jemand eine Idee hat, wird **nur eine Frage** gestellt:

> **„Braucht ein Hausverwalter mit 500–3.000 Einheiten das zwingend, um Callfolio jetzt zu kaufen?"**

* ❌ Nein → Nicht v5.1
* ✅ Ja → Nur Bugfix oder Klarstellung, kein neues Feature

---

## 📌 Strategische Wahrheit

> **Callfolio v5.1 gewinnt nicht durch Funktionsfülle, sondern durch Vertrauen.**

* Kontrolle statt Automatik
* Nachvollziehbarkeit statt Magie
* Sicherheit statt Geschwindigkeit

---

## 🚀 Nächster Fokus (außerhalb der Entwicklung)

* Pilotkunden
* Vertriebsgespräche
* Demo-Stories
* Feedback aus der Praxis

**Nicht:** Weiterbauen.

---

## 🖊️ Sign-off

Dieses Dokument ist bindend für:

* Produkt
* Entwicklung
* Vertrieb

**Callfolio v5.1 ist abgeschlossen.**

---

## 📎 Addendum: v8.0 Ausnahme (2026-02-24)

> [!IMPORTANT]
> Die folgenden Features wurden **bewusst außerhalb des Freeze** als Erweiterung des Kernprodukts nachgezogen. Begründung: Kaufmännische Anfragen machen ~40% des realen Anrufvolumens aus und sind damit keine "Nice-to-have"-Features, sondern Teil des Kernproblems.

**Genehmigte Erweiterungen:**
- ✅ **Kaufmännische Kategorien:** COMMERCIAL, BILLING, UTILITIES, NOISE_COMPLAINT
- ✅ **Priority Mapping:** `urgency`/`priority` Normalisierung im Webhook
- ✅ **System Prompt v2.0:** Aktive Empathie, Triage, kaufmännische Deeskalation
- ✅ **Deutsche Übersetzungen:** E-Mail-Templates und Template-Parser aktualisiert

**Nicht genehmigt (weiterhin verboten):**
- ❌ Alle anderen Items aus der "NICHT Teil von v5.1" Liste bleiben gesperrt
- ❌ Neue Endpoints oder Datenmodelle über die Kategorien hinaus