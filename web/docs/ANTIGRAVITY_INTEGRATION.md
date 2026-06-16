# Anti Gravity + Opus Integration Guide
## Callfolio v5.5 – Hybrid Frontend Development Workflow

---

## 🎯 Zielsetzung
Nutze **Anti Gravity** für visuelles UI-Design und **Opus (Claude)** für die nahtlose Integration in das bestehende Next.js 14 Multi-Domain-Setup.

---

## 📋 Voraussetzungen

### Aktueller Tech-Stack (Callfolio v5.5)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Backend:** Supabase (Auth + PostgreSQL)
- **Domains:** 
  - `callfolio.de` → Marketing Landingpage (statisch, keine Auth)
  - `callfolio.io` → App Dashboard (authentifiziert)
- **Middleware:** Domain-basiertes Routing in `middleware.ts`

### Was du brauchst
1. Anti Gravity CLI/Tool installiert
2. Zugriff auf Opus (Claude 3 Opus via API oder Cursor)
3. Git-Branch für sichere Experimente

---

## 🏗️ Bauplan: 3-Phasen-Strategie

### Phase 1: Anti Gravity Setup (UI-Generierung)
**Ziel:** Erstelle die visuellen Komponenten ohne Backend-Logik

#### Schritt 1.1: Projekt-Namespace vorbereiten
```bash
mkdir -p components/ui-gravity
mkdir -p app/(landing-v2)
```

**Warum?**
- `components/ui-gravity/` → Isolierter Namespace für Anti Gravity Komponenten
- `app/(landing-v2)/` → Neue Route Group für die überarbeitete Landingpage

#### Schritt 1.2: Anti Gravity Konfiguration
Erstelle `antigravity.config.json` im Root:

```json
{
  "framework": "nextjs",
  "version": "14",
  "styling": {
    "system": "tailwind",
    "configPath": "./tailwind.config.ts"
  },
  "outputDirectory": "./components/ui-gravity",
  "componentLibrary": "shadcn",
  "constraints": {
    "maxComponentSize": "500 lines",
    "enforceAccessibility": true,
    "mobileFirst": true
  },
  "excludePaths": [
    "app/api/**",
    "lib/supabase/**",
    "middleware.ts"
  ]
}
```

#### Schritt 1.3: Komponenten in Anti Gravity bauen
**Fokus auf diese Bereiche:**
1. **Landingpage Hero Section** (`HeroSection.tsx`)
2. **Feature Grid** (`FeatureGrid.tsx`)
3. **Pricing Table** (`PricingTable.tsx`)
4. **Footer** (`LandingFooter.tsx`)
5. **CTA Sections** (`CTASection.tsx`)

**Wichtig:** Diese Komponenten sollen **rein visuell** sein, keine Datenanbindung!

---

### Phase 2: Opus Integration (Logik-Verbindung)
**Ziel:** Verbinde die UI-Komponenten mit dem Backend

#### Schritt 2.1: System-Prompt für Opus
Nutze diesen Prompt, wenn du Opus die Komponenten gibst:

```markdown
# Kontext: Callfolio v5.5 Multi-Domain Setup

## Projekt-Architektur
- Next.js 14 App Router mit Route Groups
- Multi-Domain: callfolio.de (Landing) vs. callfolio.io (App)
- Middleware-basiertes Routing (siehe middleware.ts)
- Supabase Auth NUR auf .io Domain aktiv

## Deine Aufgabe
Ich habe UI-Komponenten aus Anti Gravity in `components/ui-gravity/`.
Integriere diese in das Projekt mit folgenden Regeln:

### Kritische Constraints
1. **Landingpage (callfolio.de):**
   - KEINE Supabase-Imports
   - KEINE `'use client'` Hooks für Auth
   - Statische Komponenten für SEO
   - Links zu .io für Login/Dashboard

2. **Dashboard (callfolio.io):**
   - Nutze bestehende Supabase-Clients aus `lib/supabase/`
   - Respektiere `AuthGuard` für geschützte Routen
   - Verwende `ThemeProvider` aus `app/(app)/layout.tsx`

3. **Styling:**
   - Nutze bestehende Tailwind-Klassen
   - Indigo-600 als Primary Color (Brand)
   - Respektiere Dark Mode via ThemeProvider

### Datei-Struktur
- API-Routen: `app/api/` (NICHT ändern)
- App-Komponenten: `app/(app)/`
- Landing-Komponenten: `app/page.tsx` oder neue Route Group
- Shared UI: `components/`

### Beispiel-Integration
Wenn du eine `HeroSection.tsx` von Anti Gravity bekommst:
1. Prüfe, ob sie Client-State nutzt → Füge `'use client'` hinzu
2. Ersetze Dummy-Links durch echte Next.js `<Link>` zu .io
3. Stelle sicher, dass Bilder via `next/image` optimiert werden
4. Teste, dass keine Supabase-Abhängigkeiten existieren
```

#### Schritt 2.2: Integration Workflow
1. **Komponente von Anti Gravity kopieren** → `components/ui-gravity/HeroSection.tsx`
2. **Opus füttern mit:**
   - Der neuen Komponente
   - Der bestehenden `app/page.tsx` (Landing)
   - Der `middleware.ts` (für Kontext)
3. **Opus-Aufgabe:** "Integriere HeroSection in app/page.tsx und stelle sicher, dass alle Links korrekt auf .io zeigen."

#### Schritt 2.3: Validierung
Nach jeder Integration prüfen:
```bash
npm run build
npm run lint
```

---

### Phase 3: Testing & Deployment
**Ziel:** Verifiziere das Multi-Domain-Verhalten

#### Schritt 3.1: Lokales Testing
Simuliere beide Domains lokal:

**Option A: Hosts-Datei (macOS/Linux)**
```bash
sudo nano /etc/hosts
```
Füge hinzu:
```
127.0.0.1 local.callfolio.de
127.0.0.1 local.callfolio.io
```

Dann teste:
```bash
npm run dev
# Öffne: http://local.callfolio.de:3000 (Landing)
# Öffne: http://local.callfolio.io:3000 (App)
```

**Option B: Vercel Preview**
Pushe auf einen Feature-Branch und nutze Vercel Preview Deployments mit Custom Domains.

#### Schritt 3.2: Checkliste vor Production
- [ ] Landing auf .de zeigt keine Auth-Cookies in DevTools
- [ ] App auf .io funktioniert mit Login/Logout
- [ ] Middleware redirects funktionieren (z.B. .de/dashboard → .io/dashboard)
- [ ] Lighthouse Score für Landing > 90 (Performance)
- [ ] Alle Bilder nutzen `next/image`
- [ ] Dark Mode funktioniert auf .io, nicht auf .de

---

## 🔧 Troubleshooting

### Problem: "Hydration Mismatch"
**Ursache:** Anti Gravity generiert Client-Code, aber Next.js rendert Server-seitig.
**Lösung:** Füge `'use client'` am Anfang der Komponente hinzu.

### Problem: "Cookie not set on .de"
**Ursache:** Middleware versucht Supabase-Session auf Landing zu setzen.
**Lösung:** Prüfe `middleware.ts` → `isLandingDomain()` muss `return NextResponse.next()` OHNE Supabase-Call machen.

### Problem: Tailwind-Klassen funktionieren nicht
**Ursache:** Anti Gravity nutzt andere CSS-Variablen.
**Lösung:** Mappe die Variablen in `globals.css` oder passe `tailwind.config.ts` an.

---

## 📊 Erwartete Ergebnisse

### Vorher (v5.4)
- Landingpage: Minimaler Platzhalter
- Entwicklungszeit für neue Features: 2-3 Tage

### Nachher (v5.5 + Anti Gravity)
- Landingpage: Professionelles Marketing-Design
- Entwicklungszeit für UI-Iterationen: 2-3 Stunden
- Code-Qualität: Gleichbleibend (durch Opus-Integration)

---

## 🚀 Nächste Schritte

1. **Jetzt:** Erstelle ersten Prototyp der Hero Section in Anti Gravity
2. **Dann:** Nutze Opus zur Integration in `app/page.tsx`
3. **Deploy:** Pushe auf Feature-Branch und teste mit Vercel Preview
4. **Production:** Merge nach `release/v5.5-landing-redesign`

---

## 📚 Referenzen

- [Next.js 14 Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Middleware Multi-Domain Setup](./V5.3_MIGRATION_SUMMARY.md)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind + Shadcn](https://ui.shadcn.com/docs)

---

**Version:** 1.0  
**Erstellt:** 2026-02-15  
**Autor:** Lead Architect (Cursor AI)  
**Status:** Ready for Implementation
