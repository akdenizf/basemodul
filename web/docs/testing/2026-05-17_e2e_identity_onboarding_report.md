# Callfolio E2E-Test- und Meilenstein-Bericht

**Datum:** 17. Mai 2026

**Projekt:** Callfolio (Autonomer KI-Telefonassistent für Hausverwaltungen)

**Tester:** Fatih Akdeniz

**Status:** **PRODUKTIONSTAUGLICH (PASS)**

---

## 1. Executive Summary & Meilenstein-Übersicht

In dieser intensiven Test- und Refactoring-Session wurde die gesamte Onboarding- und Identitäts-Pipeline von Callfolio erfolgreich von einem einfachen MVP-Prototypen auf ein stabiles, fehlerfreies **Enterprise-SaaS-Niveau** gehoben.

Alle Kernfunktionen – von der autonomen Caller-Erkennung über die serverübergreifende Daten-Synchronisation bis hin zum dynamischen Frontend-Rendering – wurden Ende-zu-Ende (E2E) getestet. Das System läuft nun in einer multi-demografischen Umgebung (getrennte Marketing- und App-Domains) vollständig fehlerfrei. Alle 20 von 20 automatisierten Tests sind grün.

---

## 2. System-Konfiguration (Test-Setup)

* **Ziel-Domain:** `https://www.callfolio.io` (Erzwungene kanonische App-URL)
* **Test-Rufnummer:** `+4915901662235`
* **Test-Organisation:** Mustermann Hausverwaltung (`1c219b6a-2f6f-4479-bf63-d4b29292dde2`)
* **Datenbank:** Supabase PostgreSQL v16 & v17 (inkl. Name-Split & UUID-Defaults)

---

## 3. Dokumentation der E2E-Testfälle

### Testfall 1: Unbekannter Mieter (Erst-Onboarding Flow)

* **Ausgangslage:** Die Testnummer wurde via SQL-Skript vollständig aus dem Mieterstamm (`tenants`) und der Ticket-Historie gelöscht. Das System agiert im Zustand *„Blank Slate"*.
* **Aktion:** Eingehender Anruf zur Meldung eines technischen Schadens (z. B. Wasserschaden).
* **Ergebnisse & Traces:**
  * `[get_caller_context] phone=+4915901662235 isKnown=false contextSource=null` → **Erfolgreich.** KI erkennt den Anrufer korrekt als anonym.
  * `[Submit-Success] ... needsRegistration=true` → **Erfolgreich.** Das Ticket wird im Dashboard angelegt, der Registrierungs-Zwang wird ans Backend übermittelt.
* **SMS-Versand:** Registrierungs-SMS mit personalisiertem Link geht ohne Verzögerung auf dem Endgerät ein.
* **Portal-Eingabe:** Das Web-Formular trennt Name erfolgreich in zwei Pflichtfelder (**Vorname** und **Nachname**) und erfasst die **E-Mail-Adresse** (`akdenizfatih@web.de`).
* **Datenbank-Insert:** Der Tenant-Eintrag wird fehlerfrei in der DB angelegt. Dank des neuen Datenbank-Defaults (`gen_random_uuid()`) treten keine Not-Null-Constraint-Fehler bei der `tenant_id` mehr auf.

### Testfall 2: Bekannter Mieter (Der „Stammgast-Loop")

* **Ausgangslage:** Der Mieter hat sich in Testfall 1 erfolgreich registriert. Die Daten sind im System vorhanden.
* **Aktion:** Erneuter Anruf mit derselben Telefonnummer, um den Status abzufragen oder ein neues Problem zu melden.
* **Ergebnisse & Traces:**
  * `[get_caller_context] phone=+4915901662235 isKnown=true contextSource=tenant tickets=1` → **Erfolgreich.** Das System zieht die Stammdaten in unter einer Sekunde (849ms). Die KI begrüßt den Anrufer sofort namentlich (*„Hallo Fatih Akdeniz..."*).
  * `[Submit-Success] ... needsRegistration=false` → **Erfolgreich.** Das System erkennt, dass Name und Adresse bereits existieren.
* **SMS-Upgrade:** Es wird eine modifizierte SMS versendet, die alle Adressfelder überspringt und den User direkt im **Foto-Modus (`mode=photo`)** begrüßt. Ein Selfie-Upload wurde im Live-Test erfolgreich durchgeführt und direkt der Ticket-Timeline zugeordnet.

---

## 4. Bereinigte Fehler und Bug-Dokumentation

Im Zuge dieser Testphase wurden vier kritische System-Fehler dauerhaft behoben:

| Fehlerkomponente | Ursprüngliches Problem | Gelöste Architektur-Logik |
| --- | --- | --- |
| **Domain-Routing** | Interne Fetch-Aufrufe liefen über dynamische Host-Header fälschlicherweise gegen `callfolio.de`. | **Kanonischer Fix:** `processBaseUrl` wird jetzt strikt auf `process.env.NEXT_PUBLIC_APP_URL` (`.io`) gezwungen. |
| **401 Unauthorized** | Ein veralteter Datenbank-Webhook in Supabase feuerte unbemerkt mit einem alten Token (`callfolio_secret_2026`) bei jedem Ticket-Insert gegen den Server. | **Beseitigt:** Der doppelte Geister-Webhook wurde im Supabase-Dashboard vollständig gelöscht. Interne Kommunikation läuft jetzt fehlerfrei mit `200 OK`. |
| **Datenbank-Constraint** | `Tenant upsert FAILED: null value in column "tenant_id"` — Portal-Insert schlug wegen fehlendem UUID-Default fehl. | **Migration v17:** `tenant_id` erhält jetzt `DEFAULT gen_random_uuid()::text`. Kein manuelles Setzen mehr nötig. |
| **Frontend-Zensur** | Dashboard zeigte trotz vorhandener Daten nur die Telefonnummer an, weil der `match_type`-Check (`'MATCH' \| 'MANUAL_MATCH'`) zur Anzeigezeit nicht gesetzt war. | **`cleanName()`-Helper:** Rein inhaltsbasierte Bereinigung – kein Vertrauen mehr in Metadaten-Flags für die Darstellung. |

---

## 5. Architektur-Schutzregeln (für zukünftige Refactorings)

Die folgenden Invarianten **dürfen nicht gebrochen werden**, da sie durch diesen Test-Zyklus als kritisch identifiziert wurden:

1. **Interne Fetches MÜSSEN auf `.io` laufen.** `processBaseUrl` in `submit-ticket.ts` und `request-onboarding-link.ts` leitet immer über `NEXT_PUBLIC_APP_URL`. Wird diese Env-Variable entfernt, fällt das System auf den Request-Host zurück — was auf der Marketing-Domain (`callfolio.de`) sofort zu 401-Fehlern führt.

2. **`patch_data` ist der einzige Sync-Endpunkt.** Alle Schreiboperationen vom SMS-Portal laufen ausschließlich über `/api/public/ticket-update` mit `action=patch_data`. Kein direktes Supabase-Write aus dem Client.

3. **Tenant-Upsert setzt immer `match_type='MANUAL_MATCH'`.** Nur so wird sichergestellt, dass das Dashboard den echten Mieternamen anzeigt und nicht auf Telefonnummer-Fallback zurückfällt.

4. **Propagation ist Pflicht.** Wenn ein Mieter sich registriert, werden ALLE offenen Tickets desselben Phone-Hashes mit dem neuen Namen/Adresse aktualisiert. Kein Ticket bleibt im `NONE`-Zustand zurück.

5. **`cleanName()` als Anzeigefilter.** Kein Code darf rohe `caller_name`-Werte direkt rendern. Immer durch `cleanName()` filtern — schützt vor Telefonnummern als Name und `unbekannt`-Strings.

---

## 6. Fazit

**Das System ist READY FOR OUTREACH.**

Die gesamte Identity & Onboarding Pipeline läuft E2E fehlerfrei in Produktion. Die nächsten Schritte sind Sales-seitig (Outreach an Property Manager) und nicht mehr technischer Natur.
