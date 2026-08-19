# BaseModul Wave 2 — Top 5 Preflight + Send Preview

Datum: 2026-07-06 08:25 CEST  
Scope: First-touch Preview für Wave 2 Kfz / Gutachter / Werkstätten. **Kein Versand**, keine InboxOutboundRecords, keine Lead-Statusänderung.
Department: `base-modul-outreach`

## Send Timing Check

- heutiger Tag: Monday
- Policy: allowed
- Guard geprüft: yes
- Fatih-Go vorhanden: no
- Ergebnis: prepare_only

## Preflight Ergebnis

- Gmail Sync: `ok=true`, syncedAt `2026-07-06T06:25:37.824Z`
- Live-Guard Gesamtcheck: `ok=true`, `department=base-modul-outreach`
- Per-Lead Guard für Top 5: `count=0`, keine bestehenden BaseModul-Outreach-Records gefunden
- Local Dedupe gegen `Outreach-Agent/data/inbox-outbound.json`: 0 Treffer für die Top-5-Empfänger
- Lead Store: alle Top 5 sind `status=researched`, `campaign_id=bm-wave-2-kfz-munich`, `contact_confidence=high`
- Legal Naming Check: keine GmbH-/Kapitalgesellschafts-Formulierung für Callfolio, AGENTEQ oder BaseModul; AGENTEQ/BaseModul nur neutral als Geschäftsbezeichnung/Brand genutzt.

## Auswahl

1. Heidari Ingenieur-Sachverständigenbüro — Score 88 — `info@heidari-gutachten.de`
2. ETH Kfz-Werkstatt GmbH — Score 83 — `info@ethwerkstatt.de`
3. Auto Münch — Score 83 — `service@automuench.de`
4. B&G Fahrzeugtechnik — Score 83 — `info@bg-automotive.de`
5. Aigner Kfz-Service GmbH & Co. KG — Score 83 — `info@aigner-kfz-service.de`

---

## 1) Heidari Ingenieur-Sachverständigenbüro

**To:** `info@heidari-gutachten.de`  
**Subject:** `Frage zu Schadenbildern und Gutachtenanfragen`

Hallo zusammen,

ich habe kurz Ihre Website angeschaut — bei Kfz-Gutachten müssen vor einem Termin oder Rückruf vermutlich einige Infos sauber vorliegen: Schadenbilder, Fahrzeugdaten, Hergang, Kontaktdaten und ggf. Versicherungsinfos.

Ich baue mit BaseModul kleine Intake-Flows, die genau solche Angaben strukturiert einsammeln und als vollständigen Fall ans Team übergeben.

Darf ich kurz fragen: Kommen neue Gutachtenanfragen bei Ihnen heute schon vollständig genug rein, oder entstehen dabei noch manuelle Rückfragen?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ · basemodul.de

---

## 2) ETH Kfz-Werkstatt GmbH

**To:** `info@ethwerkstatt.de`  
**Subject:** `Frage zu Unfall- und Reparaturanfragen`

Hallo zusammen,

ich habe auf Ihrer Website Signale zu Unfall, Schaden, Lack und Reparatur gesehen. Bei solchen Anfragen fehlen vor einem sinnvollen Rückruf oft noch Bilder, Fahrzeugdaten oder eine kurze Beschreibung des Schadens.

BaseModul ist ein kleiner Intake-Flow, der Fotos, Fahrzeuginfos, Anliegen und Dringlichkeit vorab strukturiert einsammelt und sauber ans Team übergibt.

Wäre ein kurzer Blick auf Ihren aktuellen Anfrageweg interessant, um zu prüfen, ob sich Rückfragen vor dem Termin reduzieren lassen?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ · basemodul.de

---

## 3) Auto Münch

**To:** `service@automuench.de`  
**Subject:** `Kurze Frage zu Unfallschaden-Anfragen`

Hallo zusammen,

auf Ihrer Website wirkt Auto Münch stark im Bereich Werkstatt, Karosserie und Lack. Bei Unfallschäden oder Reparaturanfragen ist vermutlich entscheidend, dass Bilder, Fahrzeugdaten und Schadenskontext schon vor dem Rückruf klar sind.

Ich baue mit BaseModul kleine Anfrage-Flows, die genau diese Infos strukturiert abfragen und als saubere Rückrufnotiz oder Fallübergabe ans Team geben.

Wäre es sinnvoll, sich Ihren aktuellen Anfrageweg dafür einmal kurz anzuschauen?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ · basemodul.de

---

## 4) B&G Fahrzeugtechnik

**To:** `info@bg-automotive.de`  
**Subject:** `Frage zu Reparatur- und Unfallanfragen`

Hallo zusammen,

ich habe kurz Ihre Website angeschaut — bei Fahrzeugtechnik, Reparatur- und Unfallanfragen kommen wahrscheinlich viele Anfragen mit unterschiedlichem Kontext rein: Fahrzeug, Schaden, Fotos, Terminwunsch und Dringlichkeit.

BaseModul kann solche Angaben vor dem Rückruf strukturiert einsammeln und als klare Übergabe fürs Team vorbereiten.

Wäre ein kurzer 20-Minuten-Blick auf Ihren Anfrageweg interessant?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ · basemodul.de

---

## 5) Aigner Kfz-Service GmbH & Co. KG

**To:** `info@aigner-kfz-service.de`  
**Subject:** `Frage zu Karosserie- und Reparaturanfragen`

Hallo zusammen,

ich habe gesehen, dass Aigner Kfz-Service öffentlich Werkstatt-/Serviceleistungen und Karosserie-/Lack-Signale zeigt. Gerade bei solchen Anfragen fehlen vorab oft noch Fotos, Fahrzeugdaten oder eine kurze Einordnung des Problems.

Ich baue mit BaseModul schlanke Intake-Flows, die diese Infos einsammeln und als strukturierte Rückruf- oder Reparaturnotiz ans Team übergeben.

Darf ich kurz fragen: Werden solche Anfragen bei Ihnen heute schon strukturiert vorqualifiziert?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ · basemodul.de

---

## Send-Voraussetzung

Vor echtem Versand nochmal direkt live prüfen:

1. Gmail Sync
2. Per-Empfänger Guard `department=base-modul-outreach`
3. Send Timing Check
4. Explizites Fatih-Go

Ohne explizites Go bleibt Ergebnis: `prepare_only`.
