# Callfolio - Kostenplanung & Pricing Strategie

Dieses Dokument dient der internen Kalkulation unserer Preisstruktur, Margen und Wettbewerbsvorteile. Da der Markt für KI-Voice-Agenten im Hausverwaltungssektor kompetitiver wird und Mitbewerber ihre Preise senken, passen wir unsere Strategie an, um durch Premium-Qualität *und* attraktive Preise zu dominieren.

## 1. Status Quo: Was wir haben & Was wir können

### Was wir haben (Technologie & Infrastruktur)
- **Voice Engine:** Vapi (Ultra-Low Latency Voice AI)
- **LLM:** OpenAI (GPT-4o / GPT-4o-mini)
- **Kommunikation:** Twilio (Telefonnummern, SMS, E-Mail via SendGrid/Resend)
- **Backend & DB:** Supabase (PostgreSQL, Realtime, Edge Functions)
- **Frontend:** Next.js, React, Tailwind CSS im exklusiven "Full Light Theme" (Double Bezel Design)

### Was wir können (Unsere Features)
- **24/7 Voice Intake:** KI nimmt Anrufe entgegen, qualifiziert den Notfall, erfasst alle relevanten Mieter- und Objektdaten.
- **3-Tier Fuzzy Matcher:** Die KI gleicht Anrufer intelligent mit dem hochgeladenen Mieter-Stamm (CSV) ab, auch wenn die Nummer unterdrückt ist.
- **Visueller Kontext (SMS Photo Request):** Bei technischen Defekten (Sanitär, Heizung, Elektro) schickt die KI vollautomatisch eine SMS, damit der Mieter Fotos hochladen kann.
- **Auto-Kategorisierung & Priorisierung:** Automatische Zuweisung von Gewerken und Dringlichkeitsstufen.
- **Premium Dashboard:** Ein extrem hochwertiges, schnelles und übersichtliches Admin-Panel für die Hausverwaltung.

---

## 2. Abgrenzung: Was uns ausmacht (USPs)

Warum sollten Kunden uns wählen, selbst wenn andere Agenturen ähnliche Preise haben?

1. **Design & UX ("Soft-Skill" Ansatz):** Unsere UI/UX ist nicht das typische, billige SaaS-Dashboard. Das "Full Light Theme" und die "Double Bezel" Architektur vermitteln sofort Vertrauen, Sicherheit und eine extrem teure, exklusive "Agency"-Qualität.
2. **End-to-End Workflow:** Wir sind nicht nur ein Chatbot. Wir verknüpfen den Anruf sofort mit der Mieterdatenbank und fordern *visuelle* Beweise (Fotos) per SMS an. Dieser Workflow spart dem Hausverwalter reale Arbeitszeit.
3. **Keine "Blackbox":** Vollständiger, transparenter Aktivitätsverlauf (Audit-Log) im Dashboard.
4. **Fokus auf Hausverwaltung:** Unsere KI-Prompts sind extrem spitz auf den Immobilienbereich (Rohrbruch, Heizung, etc.) trainiert.

---

## 3. Kostenstruktur: Was verbraucht werden kann (Running Costs)

Um unseren Spielraum ("Luft") zu berechnen, müssen wir die reinen Verbrauchskosten (COGS - Cost of Goods Sold) pro Anruf kalkulieren.

*Annahme: Ein durchschnittliches Mieter-Telefonat dauert 3 Minuten.*

| Kostenstelle | Kosten pro Einheit | Kosten pro Ø Anruf (3 Min) |
| :--- | :--- | :--- |
| **Vapi (Voice AI)** | ~0.05 € / Minute | 0.15 € |
| **OpenAI (LLM)** | ~0.02 € / Minute | 0.06 € |
| **Twilio (Telefonie)** | ~0.015 € / Minute | 0.045 € |
| **Twilio (SMS)** | ~0.08 € / SMS | 0.08 € (nur bei 30% der Anrufe relevant = Ø 0.024 €) |
| **Summe (Verbrauch)** | | **~ 0.28 € pro Anruf** |

Zusätzliche fixe Infrastrukturkosten pro Monat:
- Twilio Telefonnummer: ~1.50 € / Monat pro Kunde
- Supabase / Hosting (skaliert sehr gut): ~25 € flat für viele Kunden (Anteil pro Kunde extrem gering, max 1-2 €)

**Gesamtkosten pro Kunde (bei z.B. 100 Anrufen / Monat):**
- 100 Anrufe x 0.28 € = 28.00 €
- Fixkosten (Nummer, Server-Anteil) = 3.50 €
- **Total: ~ 31.50 € Kosten pro Monat für 100 Anrufe**

---

## 4. Preisstrategie & "Luft nach unten"

Da der Marktpreis für solche Software aktuell bei ca. 149 € bis 249 € im Monat liegt, haben wir enormen Spielraum. Um die Konkurrenz direkt auszustechen und uns Marktanteile zu sichern, können wir extrem aggressiv in den Markt gehen, *ohne* Verluste zu machen.

### Das neue "Grand Slam Offer" (Bestätigtes Pricing)

#### Einmaliges Setup (Onboarding)
- **Verkaufspreis:** **990,- € (einmalig)**
- **Inhalt:** Individuelle KI-Konfiguration, Daten-Import, Onboarding-Call.
- **Marge:** Nahezu 100% (rein zeitlicher Aufwand).

#### Paket: Starter (Bis zu 100 Anrufe / Monat)
- **Unser Verkaufspreis:** **89,- € / Monat** *(Kampfpreis, extrem attraktiv für kleine Verwaltungen!)*
- **Unsere Kosten:** ~ 31,50 €
- **Unser Gewinn (Marge):** **57,50 € pro Monat (64% Marge)**

#### Paket: Pro (Bis zu 300 Anrufe / Monat)
- **Unser Verkaufspreis:** **199,- € / Monat**
- **Unsere Kosten:** ~ 87,50 €
- **Unser Gewinn (Marge):** **111,50 € pro Monat (56% Marge)**

### Haben wir noch mehr Luft?
**Ja, absolut.**
Selbst wenn ein Konkurrent auf 79,- € oder gar 69,- € für das Einstiegspaket runtergeht, bleiben wir profitabel:
- Bei 69,- € VK und 31,50 € Kosten machen wir immer noch **37,50 € Reingewinn (54% Marge)** pro Kunde fürs reine "Nichtstun" (Software läuft vollautomatisch). 

### Upsell-Potenzial (Hier holen wir den echten Gewinn)
Wir können den Grundpreis niedrig halten (z.B. 89 €) und zusätzliche Gebühren verlangen für:
1. **Overage:** Jeder Anruf über dem Limit kostet 0,80 € (Kosten für uns: 0,28 € -> fast 200% Aufschlag).
2. **Premium-Nummern:** Eigene Ortsvorwahl (München, Berlin) statt generischer Nummer: +10 € / Monat.
3. **Whitelabel / Eigene E-Mail Domain:** +29 € / Monat.

---

## 5. Fazit & Bestätigung

**Der Preis ist bestätigt:** Wir können bedenkenlos ein **"Under 100 €"** Einstiegsangebot (z.B. 89 € oder 99 €) auf den Markt werfen. 

Das schlägt die teuren Agenturen (die oft 300+ € nehmen) um Längen.
Gleichzeitig sieht Callfolio durch das Premium Double-Bezel Design so aus, als ob es 500 € im Monat kosten müsste. Dieser Kontrast (Luxus-Look vs. No-Brainer-Preis) wird unsere Conversion-Rate massiv steigern.

**Zusammenfassung:**
- **Einrichtung:** 990 € einmalig (deckt initialen Aufwand & qualifiziert Kunden).
- **Marge:** Wir arbeiten selbst beim Kampfpreis mit >60% Marge auf die laufenden Kosten.
- **Sicherheit:** Wir haben genug Puffer (bis zu 35 € können wir noch runtergehen, bevor es weh tut).
- **Positionierung:** Wir sind das "Apple" unter den Voice-Agenten (Premium UI/UX) zum Preis eines agilen Startups.
