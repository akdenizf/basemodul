# Callfolio v5.2 - Clean Architecture Migration

## Das Problem (was falsch war)

Die `tenants`-Tabelle wurde für **zwei verschiedene Zwecke** missbraucht:
1. **Organisationen** (Hausverwaltungen) - mit `vapi_phone_id`, `notification_email`
2. **Mieter** (Bewohner) - mit `phone`, `address`, `unit`

**Ergebnis:** Wenn du dich registriert hast, wurdest du selbst als "Mieter" in die Tabelle geschrieben. Das hat zu Verwechslungen geführt.

---

## Die Lösung (neue Architektur)

### Neue Tabellenstruktur:

| Tabelle | Zweck | Wichtige Spalten |
|---------|-------|------------------|
| `organizations` | Hausverwaltungen (DU als Kunde) | `slug`, `name`, `vapi_phone_id`, `notification_email` |
| `tenants` | Mieter (die Bewohner, die anrufen) | `organization_id`, `name`, `address`, `phone` |
| `profiles` | User-Accounts | `user_id`, `organization_id` |
| `tickets` | Support-Tickets | `organization_id`, `call_id`, `issue_summary` |

### Beziehungen:
```
User (auth.users)
  └── Profile (profiles)
        └── Organization (organizations)
              ├── Tenants (tenants) - die Mieter
              └── Tickets (tickets) - die Anrufe
```

---

## Migration durchführen

### Schritt 1: SQL-Skript ausführen

1. Gehe zu **Supabase Dashboard** → **SQL Editor**
2. Kopiere den Inhalt von `database/CLEAN_ARCHITECTURE_SETUP.sql`
3. Führe das Skript aus

**ACHTUNG:** Das Skript löscht ALLE bestehenden Daten (Tickets, Tenants, Profiles)!

### Schritt 2: Accounts löschen (optional)

Falls du auch die Auth-Accounts löschen willst:
1. Gehe zu **Supabase Dashboard** → **Authentication** → **Users**
2. Lösche alle Test-Accounts manuell

### Schritt 3: Neu registrieren

1. Öffne die App und registriere dich neu
2. Im Onboarding: Gib den Namen deiner Hausverwaltung ein
3. Trage die Vapi Phone ID ein: `7fadb6fe-04ac-4baf-941e-8a3c79120a78`
4. Trage deine Notification-E-Mail ein

### Schritt 4: Mieter importieren

1. Gehe zu **Dashboard** → **Import**
2. Lade deine CSV-Datei hoch (nur: `name`, `address`, `unit`, `phone`)
3. Die Mieter werden jetzt korrekt mit deiner `organization_id` verknüpft

---

## Code-Änderungen (bereits implementiert)

### Geänderte Dateien:

| Datei | Änderung |
|-------|----------|
| `app/api/onboarding/create-organization/route.ts` | Erstellt jetzt in `organizations` statt `tenants` |
| `app/api/settings/update-organization/route.ts` | Updated jetzt in `organizations` statt `tenants` |
| `app/api/vapi/webhook/route.ts` | Sucht Organisation in `organizations`, Mieter in `tenants` |
| `lib/auth-guard.ts` | Joined jetzt `profiles` → `organizations` |
| `app/api/admin/import/commit/route.ts` | Setzt `organization_id` statt nur `tenant_id` |
| `app/api/admin/import/preview/route.ts` | Nutzt `organization_id` für Konfliktprüfung |

---

## Vapi-Konfiguration

Nach der Migration muss im **Vapi Dashboard** nichts geändert werden. Der Webhook erkennt automatisch:

1. **Anruf kommt rein** → Webhook erhält `phoneNumberId`
2. **Organisation finden** → Suche in `organizations` WHERE `vapi_phone_id` = phoneNumberId
3. **Mieter finden** → Suche in `tenants` WHERE `organization_id` = gefundene Org UND `phone` LIKE Anrufernummer
4. **Ticket erstellen** → Speichere mit `organization_id`

---

## Troubleshooting

### "Keine Organisation gefunden"
→ Du hast dich nicht korrekt registriert oder das Onboarding nicht abgeschlossen.

### "Mieter wird nicht erkannt"
→ Die Telefonnummer in der CSV muss mit der Anrufernummer übereinstimmen (letzte 10 Ziffern).

### "E-Mail kommt nicht an"
→ Prüfe, ob `notification_email` in deiner Organisation gesetzt ist.

---

## Changelog

| Version | Datum | Änderung |
|---------|-------|----------|
| v5.2 | 2026-02-09 | Clean Architecture: Trennung von `organizations` und `tenants` |
| v5.1 | 2026-02-08 | Vapi Integration, CSV Import, Caller-ID |
