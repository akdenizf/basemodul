# Custom Domain Auth Fix - Callfolio

## Problem
Wenn du dich auf `callfolio.vercel.app` anmeldest, funktioniert die Session nicht auf `callfolio.de` und umgekehrt. Das liegt daran, dass Supabase Auth-Cookies domainspezifisch sind.

## Lösung

### 1. Code-Änderungen (✅ Bereits gemacht)
- `.env.local`: `NEXT_PUBLIC_SITE_URL=https://callfolio.de` hinzugefügt
- `lib/supabase/client.ts`: `siteUrl` und `redirectTo` konfiguriert
- `lib/supabase/server.ts`: Auth-Konfiguration hinzugefügt
- `middleware.ts`: Auth-Konfiguration hinzugefügt

### 2. Supabase Dashboard Konfiguration (❗ MANUELL ERFORDERLICH)

Du musst in deinem **Supabase Dashboard** die Auth-URLs konfigurieren:

1. Gehe zu **Supabase Dashboard** → **Authentication** → **URL Configuration**

2. Setze folgende URLs:

```
Site URL: https://callfolio.de

Redirect URLs (eine pro Zeile):
https://callfolio.de
https://callfolio.de/auth/callback
https://callfolio.de/login
https://callfolio.de/dashboard
https://callfolio.vercel.app
https://callfolio.vercel.app/auth/callback
https://callfolio.vercel.app/login
https://callfolio.vercel.app/dashboard
```

3. **Speichern**

### 3. Testen

1. **Logout** auf beiden Domains (lösche alle Cookies)
2. Gehe zu `https://callfolio.de/login`
3. Melde dich an
4. Öffne einen neuen Tab mit `https://callfolio.de/dashboard`
5. Du solltest automatisch eingeloggt sein

### 4. Falls es immer noch nicht funktioniert

**Option A: Cookies manuell löschen**
```javascript
// In Browser-Konsole auf beiden Domains ausführen:
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
```

**Option B: Incognito-Modus testen**
- Öffne ein Incognito-Fenster
- Gehe direkt zu `https://callfolio.de/login`
- Melde dich an
- Teste neue Tabs

**Option C: DNS-Propagation prüfen**
```bash
# Prüfe ob callfolio.de korrekt auf Vercel zeigt:
nslookup callfolio.de
```

### 5. Debugging

Falls es immer noch Probleme gibt, prüfe in den **Browser DevTools** → **Application** → **Cookies**:

- Auf `callfolio.de` sollten Cookies mit Namen wie `sb-xxbulengzotyzmllsgij-auth-token` existieren
- Diese Cookies sollten `Domain: .callfolio.de` haben (mit Punkt davor)

### 6. Vercel Domain-Konfiguration

Stelle sicher, dass in **Vercel Dashboard** → **callfolio** → **Domains**:
- `callfolio.de` als Primary Domain gesetzt ist
- `callfolio.vercel.app` als Redirect zu `callfolio.de` konfiguriert ist (optional)

## Warum passiert das?

Supabase Auth verwendet HTTP-Only Cookies für die Session. Diese Cookies sind aus Sicherheitsgründen domainspezifisch:

- Cookie von `callfolio.vercel.app` → funktioniert nur auf `*.vercel.app`
- Cookie von `callfolio.de` → funktioniert nur auf `*.callfolio.de`

Durch die Konfiguration der `Site URL` in Supabase weiß der Auth-Service, welche Domain die "Haupt-Domain" ist und setzt die Cookies entsprechend.

## Nach dem Fix

- ✅ Login auf `callfolio.de` funktioniert in allen Tabs
- ✅ Direkte Navigation zu `callfolio.de/dashboard` funktioniert
- ✅ Session bleibt bestehen beim Öffnen neuer Tabs
- ✅ Logout funktioniert korrekt auf allen Tabs