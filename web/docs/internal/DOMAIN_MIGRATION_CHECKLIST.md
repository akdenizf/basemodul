# Domain Migration Checklist: callfolio.de → callfolio.io

## ✅ Code-Änderungen (Abgeschlossen)

- [x] Environment Variables aktualisiert (`.env.local`)
- [x] System Email Referenzen aktualisiert (`components/`, `lib/`)
- [x] Webhook URLs in Dokumentation aktualisiert
- [x] Datenbank-Migrationen aktualisiert

---

## 🔧 Externe Konfigurationen (User Action Required)

### 1. Vercel Dashboard

**URL**: https://vercel.com/akdenizdfatihs-projects/callfolio

**Schritte**:
1. Gehe zu **Settings** → **Domains**
2. Klicke auf **Add Domain**
3. Gib `callfolio.io` ein und klicke auf **Add**
4. Folge den DNS-Anweisungen (falls noch nicht konfiguriert)
5. Warte bis der Status **Valid** zeigt
6. Setze `callfolio.io` als **Primary Domain**
7. Optional: Konfiguriere `callfolio.de` als Redirect zur Landing Page

**Wichtig**: Nach dem Domain-Wechsel einmal neu deployen!

---

### 2. Supabase Dashboard

**URL**: https://supabase.com/dashboard/project/xxbulengzotyzmllsgij

**Schritte**:
1. Gehe zu **Authentication** → **URL Configuration**
2. Aktualisiere **Site URL** auf: `https://callfolio.io`
3. Füge zu **Redirect URLs** hinzu:
   - `https://callfolio.io/auth/callback`
   - `https://callfolio.io/login`
   - `https://callfolio.io/dashboard`
4. Klicke auf **Save**

**Wichtig**: Die alte Domain (`callfolio.de`) kann in den Redirect URLs bleiben für Übergangszeit.

---

### 3. VAPI Dashboard

**URL**: https://dashboard.vapi.ai

**Schritte**:
1. Gehe zu deinem **Assistant** (Callfolio Voice Agent)
2. Navigiere zu **Tools** → **submit_ticket**
3. Aktualisiere **Server URL** auf: `https://callfolio.io/api/vapi/webhook`
4. Falls du das Tool **check_existing_ticket** nutzt:
   - Aktualisiere auch dessen URL auf: `https://callfolio.io/api/vapi/check-ticket`
5. Klicke auf **Save**

**Test nach der Änderung**:
- Mache einen Test-Anruf
- Prüfe in den Vercel Logs, ob der Webhook ankommt
- Verifiziere, dass ein Ticket erstellt wird

---

### 4. DNS-Konfiguration (falls noch nicht erledigt)

**Domain Provider**: (Dein Domain-Provider für callfolio.io)

**Schritte**:
1. Gehe zu deinem Domain-Provider Dashboard
2. Navigiere zu DNS-Einstellungen für `callfolio.io`
3. Füge folgende Records hinzu (von Vercel bereitgestellt):
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME Record**: `www` → `cname.vercel-dns.com`
4. Speichern und warten (DNS-Propagation kann bis zu 48h dauern)

**Verifikation**:
```bash
# Prüfe DNS-Auflösung
nslookup callfolio.io
nslookup www.callfolio.io

# Sollte auf Vercel-IPs zeigen
```

---

### 5. Email-Konfiguration (Resend)

**URL**: https://resend.com/domains

**Schritte**:
1. Falls du eine eigene Email-Domain nutzen möchtest:
   - Füge `callfolio.io` als Domain in Resend hinzu
   - Konfiguriere SPF, DKIM, DMARC Records
   - Verifiziere die Domain
2. Aktualisiere die Absender-Email in `.env.local` (bereits erledigt):
   - `RESEND_FROM="Callfolio Support <tickets@callfolio.io>"`

**Wichtig**: Teste nach der Änderung, ob Emails ankommen!

---

## 🧪 Testing-Checkliste

Nach allen Änderungen teste folgende Flows:

### Authentication Flow
- [ ] Login auf `https://callfolio.io/login` funktioniert
- [ ] Session bleibt nach Reload erhalten
- [ ] Logout funktioniert korrekt
- [ ] Redirect nach Login funktioniert

### Voice Agent Flow
- [ ] Test-Anruf über Vapi durchführen
- [ ] Webhook-Logs in Vercel prüfen
- [ ] Ticket wird in Dashboard angezeigt
- [ ] Email-Benachrichtigung kommt an

### Dashboard
- [ ] Alle Seiten laden korrekt
- [ ] Keine CORS-Fehler in Browser Console
- [ ] Ticket-Erstellung funktioniert
- [ ] Archivierung funktioniert

---

## 🚨 Rollback-Plan (falls Probleme auftreten)

Falls nach der Migration Probleme auftreten:

1. **Vercel**: Domain zurück auf `callfolio.de` setzen
2. **Supabase**: Site URL zurück auf `https://callfolio.de` setzen
3. **VAPI**: Webhook URL zurück auf `https://callfolio.de/api/vapi/webhook` setzen
4. **Code**: Git Revert auf vorherigen Commit

```bash
# Rollback-Befehl (falls nötig)
git revert HEAD
git push origin main
```

---

## 📝 Nach erfolgreicher Migration

- [ ] Teste alle kritischen Flows
- [ ] Informiere Benutzer über neue Domain (falls relevant)
- [ ] Aktualisiere externe Links/Bookmarks
- [ ] Überwache Logs für 24-48h auf Fehler
- [ ] Dokumentiere die Migration im `PROJECT_JOURNAL.md`

---

## ℹ️ Hinweise

- **Downtime**: Die Migration sollte ohne Downtime möglich sein, wenn Vercel die neue Domain korrekt konfiguriert ist
- **SSL-Zertifikate**: Werden automatisch von Vercel bereitgestellt
- **Alte Domain**: `callfolio.de` kann parallel weiterlaufen oder als Redirect konfiguriert werden
- **Cache**: Nach der Migration Browser-Cache leeren und Hard-Reload (`Cmd+Shift+R` / `Ctrl+Shift+F5`)

---

**Status**: ⏳ Bereit für externe Konfiguration

**Letzte Aktualisierung**: 2026-02-12
