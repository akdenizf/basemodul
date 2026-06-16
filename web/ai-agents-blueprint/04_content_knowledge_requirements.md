# Apollo Knowledge Base — Content Agent Wiki

> **Karpathy-Prinzip:** Der Agent braucht rohe, faktische Textblöcke und Snippets. Keine langen Marketing-Texte. Er soll aus echten Datenpunkten neuen Content generieren.

---

## 1. Core-Snippets & Journal-Einträge (Rohdaten)

Der Agent benötigt folgende Roh-Dateien in seiner Wissensbasis, um authentisch und floskel-frei schreiben zu können:

### A. Technische Snippets (`tech_core_snippets.txt`)
- **Architektur-Entscheidungen:** 
  - v12.9 Multi-Ticket-Handling (Unterscheidung von Folgeanruf & neuem Problem)
  - v5.4 SMS-Foto-Upload (Unauthenticated Upload-Flow für PLUMBING, HEATING etc.)
  - v15.2 Master-Lookup (Zusammenfassung von DB-Queries zur Latenz-Optimierung)
  - Ghost Tickets (Speichern abgebrochener Calls via Vapi End-of-Call-Reports)
- **Tech Stack:** Next.js 14, Supabase (pg_trgm für Fuzzy Matching), Vapi, Twilio (SMS).

### B. Gründer & Projekt-Historie (`founder_journal_raw.txt`)
- **Feature Freeze (v5.1):** Reduzierung auf den Kern. 47 Ideen, 44 gestrichen.
- **UI/UX Entscheidungen:** Der Weg vom Dark Mode zum "Full Light Theme" mit Double Bezel (B2B Trust vs. Startup Hype).
- **Pricing & Margen:** Setup 990€, Starter 89€/Mo. COGS: 0,28€/Anruf. Marge: >60%. Warum keine Minutentaktung existiert (Kunden-Psychologie).
- **DSGVO:** No-Recording Policy als bewusste Entscheidung für Vertrauen.

### C. Markt-Insights & Pain Points (`market_data_b2b.txt`)
- **Das Erreichbarkeits-Problem:** #1 Beschwerde in Google Reviews für Hausverwaltungen.
- **Personalmangel:** Immobilienbranche leidet massiv, "mehr Personal" ist nicht die Lösung.
- **Zettelwirtschaft:** Endlose Telefonketten (Mieter ↔ HV ↔ Handwerker) führen zu Informationsverlust ("Was genau ist beim Wasserschaden defekt?").

---

## 2. Die 3 Content-Pillars

Die Wissensbasis strukturiert sich rund um drei feste inhaltliche Säulen, aus denen der Agent seine Posts konstruiert:

### Pillar 1: Technical Deep-Dive (Engineering)
- **Fokus:** Das "Wie". Einblick in den Code und die Architektur.
- **Wissens-Bedarf:** Code-Snippets, Latenz-Zeiten, Bug-Fixes (z.B. GoTrueClient Warning), SQL-Query-Logik.
- **Ziel:** Technische Autorität bei CTOs und in der Dev-Community aufbauen.

### Pillar 2: B2B Pain-Points (Industry Solutions)
- **Fokus:** Das "Warum". Reale Probleme der Hausverwaltungen und wie die Technik sie löst.
- **Wissens-Bedarf:** Branchen-Metriken (Google Reviews), typische Workflows einer HV, pain-points der Mieterkommunikation.
- **Ziel:** B2B-Entscheidern aus der Seele sprechen und Callfolio als die einzige logische Lösung positionieren.

### Pillar 3: Gründer-Reise (Build-in-Public)
- **Fokus:** Der "Mensch". Die Reise eines Solo-Developers, der SaaS baut.
- **Wissens-Bedarf:** Emotionale Rückschläge (gelöschter Code, Fehlversuche), Business-Logik (Pricing, Margen), Produkt-Philosophie (Einfachheit).
- **Ziel:** Authentizität, Sympathie und Vertrauen schaffen (Hustle vs. Handwerk).

---

## 3. Format-Regeln für die Text-Snippets

1. **Kein Marketing-Sprech:** Ausschließlich echte Fakten, Zahlen und Journal-Zitate ("1.5s schneller", "147x das Wort erreichbar").
2. **Modularität:** Jeder Fakt in einer separaten Zeile oder einem YAML/JSON Block, damit der Agent verschiedene Fakten zu neuen Posts rekombinieren kann.
3. **Kontext-Bindung:** Ein technischer Fakt muss immer mit seinem B2B-Nutzen verknüpft sein (z.B. `Tech: SMS-Upload` -> `B2B: Vermeidet nutzlose Handwerker-Anfahrten`).
