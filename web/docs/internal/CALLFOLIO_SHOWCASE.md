# Callfolio: Project Architecture & Professional Showcase

Dieses Dokument dient als technischer und architektonischer Überblick über das **Callfolio**-Projekt. Es demonstriert die professionellen Entwicklungsstandards, die moderne Technologie-Stack-Auswahl und die komplexe Systemarchitektur, die in diesem B2B SaaS-MVP implementiert wurden.

## 1. Executive Summary
**Callfolio** ist eine KI-gestützte Telefonzentrale und ein Ticket-Management-System (SaaS), das speziell für Hausverwaltungen entwickelt wurde. Eingehende Mieteranrufe werden von einem Voice-AI-Agenten in Echtzeit entgegengenommen, transkribiert und durch komplexe Matching-Algorithmen (Database) dem korrekten Mieter, Gebäude und Gewerk zugeordnet. 

## 2. Technology Stack
Das Projekt basiert auf einem hochmodernen, skalierbaren Stack:

- **Frontend & Core:** Next.js 14 (App Router), React, TypeScript
- **Styling & UI:** Tailwind CSS, Framer Motion (Micro-Interactions & komplexe Animationen), Lucide Icons, Recharts (Data Visualization)
- **Backend & Database:** Supabase (PostgreSQL, Edge Functions, Row Level Security, Realtime Subscriptions)
- **AI & Integrations:**
  - **Vapi:** Realtime Voice AI für die automatisierte Anrufentgegennahme.
  - **OpenAI:** NLP-Verarbeitung für Sentiment-Analyse und Ticket-Zusammenfassungen.
  - **Twilio:** SMS-Infrastruktur für die "Visual Context" Funktion (Foto-Upload-Requests an Mieter).
  - **Resend:** Transaktionaler E-Mail-Versand (White-labeled, Mandantenfähig).

## 3. Architektur & Backend-Logik

### 3.1 Advanced Webhook & Data Parsing
Der Vapi-Webhook (`/api/vapi/webhook/route.ts`) ist robust gegen Strukturänderungen der KI-Prompts entwickelt. Er unterstützt "Deep Object Tracking" sowie "Flat Structure Parsing", um inkonsistente LLM-Outputs sicher in typisierte Datenbank-Insertions zu konvertieren (Smart Fallbacks wie `issue_summary` Extrahiert aus `issue_details`).

### 3.2 3-Tier Matching Engine
Um eingehende Anrufe Datenbank-Entitäten zuzuordnen, wurde ein mehrstufiger Algorithmus implementiert:
1.  **Vapi Phone ID Match:** Strikte Zuordnung der gerufenen Nummer zur Mandanten-Organisation.
2.  **Phone Exact Match:** Abgleich der bereinigten letzten 10 Ziffern der Anrufernummer mit der Mieter-Datenbank.
3.  **Fuzzy Name Match:** Fallback-Logik, falls die Nummer unterdrückt ist, basierend auf phonetischer oder partieller Namensähnlichkeit, die von der AI transkribiert wurde.
4.  **Follow-Up System:** Erkennt asynchron, ob ein Anrufer zu einem bestehenden offenen Ticket erneut anruft, vermeidet Duplikate und fügt den Anruf als `ticket_activity` zum Verlauf hinzu.

## 4. Code Quality & Best Practices

- **Strict TypeScript:** Vollständige Typisierung von Supabase-Responses, API-Payloads und React-Props.
- **Component Driven Design:** Saubere Trennung von UI-Komponenten (Dumb Components) und Business Logic.
- **Context-Optimized Agent Routing:** Die Markdown-Dateien im Root-Verzeichnis (`GEMINI.md`, `AGENTS.md`) sind auf absolute Token-Effizienz getrimmt (Master-Router Konzept). Dies ermöglicht AI-gestütztes Pair-Programming mit extrem niedrigem Token-Overhead.
- **UX/UI Excellence:** 
  - Glassmorphism-Effekte.
  - Reibungslose Skeleton-Loader während asynchroner Fetching-Prozesse.
  - Onboarding-Flows mit geführten 2-Step Kartenlayouts (inklusive Drag&Drop CSV Upload).
- **Security & Compliance:** 
  - Mandantenfähigkeit durch strikte `organization_id` Filter in jedem API-Call.
  - DSGVO-konforme Architektur (Server in Frankfurt, Vermeidung persistenter Sprachaufzeichnungen, Legal-Seiten).

## 5. Besonderes Highlight: "Visual Context"
Um der "Blindheit" des Telefons entgegenzuwirken, wurde ein asynchroner Loop entwickelt:
1. KI nimmt Anruf an und wertet Urgency/Category aus (z.B. `WATER_DAMAGE`).
2. Server triggert asynchron Twilio-SMS an die Anrufernummer mit einzigartigem Magic Link.
3. Mieter öffnet Next.js Web-App, macht ein Foto vom Schaden.
4. Upload wandert in Supabase Storage → Websocket pusht Event ins Dashboard → Hausverwaltung sieht Foto live zum gerade erst erstellten Ticket.

## Fazit zur Entwickler-Profession
Die Codebase von Callfolio beweist ein tiefgreifendes Verständnis für Event-Driven Architecture, asynchrone Systeme, KI-Orchestrierung und modernes Frontend-Engineering. Der Fokus lag nicht nur auf Funktionalität, sondern gleichermaßen auf Edge-Cases, Ausfallsicherheit, Skalierbarkeit und einem extrem immersiven Premium-UX/UI.
