# Audio-Demo Skripte & Produktions-Guide — basemodul.de

Dieses Dokument enthält die finalen deutschen Skripte, Voice-Mapping und Produktionsanweisungen
für die 4 Landing-Page-Demos. Der Generator liegt unter:
`AI-Creator-Tool/scripts/generate_audio_demos.py`

Die Timestamps in den Skripten sind Schätzwerte. Der Generator ermittelt nach der
Generierung die echten Sprechpausen per Silence-Detection und synchronisiert die
`LiveDemoSection.tsx` automatisch.

---

## Stimmen-Profil

| Rolle | Stimme | ElevenLabs Voice-ID | Charakter |
|---|---|---|---|
| KI-Assistentin | **Monika** | `2zRM7PkgwBPiau2jvVXc` | Ruhig, klar, serviceorientiert |
| Anruferin (w) | **Anika** | `Sm1seazb4gs7RSlUVw7c` | Lebendig, freundlich |
| Anrufer (m) | **Lutz** | `9yzdeviXkFddZ4Oz8Mok` | Entspannt, direkt |

Modell: `elevenlabs/text-to-dialogue-v3` via Kie.ai  
Parameter: `stability: 0.5`, `language_code: "de"`, `speed: 1.0`

---

## Szenario 1 — Standard Rückruf (`demo.mp3`)

**Modul:** Telefon  
**Kategorie:** CHAT · Dringlichkeit: MEDIUM  
**Ziel:** Verpasster Anruf wird zu einer strukturierten Rückrufnotiz — kein Voicemail-Chaos.  
**Anrufer:** Lutz (männlich)  
**Geschätzte Dauer:** ~42 s

### Transkript

| Runde | Sprecher | Text | Gesch. Start |
|---|---|---|---|
| 1 | **Monika** | Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen? | 0.0 s |
| 2 | Lutz | Hallo, hier ist Müller. Ich habe eine Anfrage geschickt und hätte gern einen Rückruf. | 7.1 s |
| 3 | **Monika** | Guten Tag Herr Müller. Ich notiere Ihren Rückrufwunsch. Worum geht es grob, damit das Team die Anfrage richtig einordnen kann? | 13.4 s |
| 4 | Lutz | Es geht um einen neuen Auftrag. Ich kann auch gleich ein Foto oder Dokument mitschicken. | 20.5 s |
| 5 | **Monika** | Alles klar. Ich erstelle eine Rückrufnotiz und sende Ihnen einen Upload-Link für den Anhang. Das Team bekommt alles strukturiert übergeben. | 23.9 s |
| 6 | Lutz | Super, mache ich. Danke! | 36.1 s |
| 7 | **Monika** | Gern geschehen. Das Team bekommt Ihre Meldung strukturiert übergeben und meldet sich zur Terminabstimmung. Auf Wiederhören! | 36.9 s |

### Ergebnis-Karte (LiveDemoSection)

```
Ticket: #BM-8421
Zusammenfassung: Rückrufwunsch mit Kontakt, Anliegen und optionalem Anhang.
Aktion: Rückrufnotiz erstellt • Team informiert • Upload-Link versandt
```

---

## Szenario 2 — Dringende Meldung (`demo-strom.mp3`)

**Modul:** Priorität / Notfall  
**Kategorie:** PRIORITY · Dringlichkeit: HIGH  
**Ziel:** Dringende Meldung außerhalb der Bürozeit wird erkannt, aufgenommen und eskaliert.  
**Anruferin:** Anika (weiblich)  
**Geschätzte Dauer:** ~38 s

### Transkript

| Runde | Sprecher | Text | Gesch. Start |
|---|---|---|---|
| 1 | **Monika** | Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen? | 0.0 s |
| 2 | Anika | Ja, hallo. Es ist dringend, ich erreiche gerade niemanden im Büro. | 7.8 s |
| 3 | **Monika** | Verstanden. Ich nehme die wichtigsten Angaben auf. Wen soll das Team zurückrufen und worum geht es kurz? | 12.4 s |
| 4 | Anika | Bitte unter dieser Nummer. Es betrifft einen laufenden Auftrag und muss heute geklärt werden. | 19.5 s |
| 5 | **Monika** | In Ordnung. Ich setze die Priorität auf Hoch und informiere den festgelegten Übergabekanal. | 23.1 s |
| 6 | Anika | Vielen Dank, das ist super. | 32.0 s |
| 7 | **Monika** | Gerne. Das Team wird sich in Kürze bei Ihnen melden. Auf Wiederhören! | 35.1 s |

> **Hinweis:** Runde 7 wurde leicht angepasst — die vorherige Version versprach
> "in den nächsten 15 Minuten", was das Produkt nicht garantieren kann.
> Neue Formulierung bleibt verbindlich ohne konkrete Zeitangabe.

### Ergebnis-Karte

```
Ticket: #BM-9102
Zusammenfassung: Dringende Kundenmeldung außerhalb der Bürozeit.
Aktion: Priorität hoch • Übergabekanal informiert • Rückruf vorbereitet
```

---

## Szenario 3 — Terminstatus abfragen (`demo-status.mp3`)

**Modul:** Termin  
**Kategorie:** APPOINTMENT · Dringlichkeit: LOW  
**Ziel:** Terminanfrage wird vorbereitet — kein Telefonpingpong mit dem Team.  
**Anrufer:** Lutz (männlich)  
**Geschätzte Dauer:** ~30 s

### Transkript

| Runde | Sprecher | Text | Gesch. Start |
|---|---|---|---|
| 1 | **Monika** | Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen? | 0.0 s |
| 2 | Lutz | Ja, hallo, hier ist Müller. Ich wollte nachfragen, wann mein Termin stattfindet. | 7.1 s |
| 3 | **Monika** | Guten Tag Herr Müller. Ich sehe die Anfrage vom Dienstag. Der Termin ist für morgen, Freitag den 6. Juni um 10:30 Uhr vorbereitet. | 13.3 s |
| 4 | Lutz | Super, das passt. Danke! | 25.8 s |
| 5 | **Monika** | Sehr gerne. Das Team meldet sich bei Bedarf vorher noch einmal. Auf Wiederhören! | 26.5 s |

### Ergebnis-Karte

```
Ticket: #BM-8421
Zusammenfassung: Terminstatus abgerufen. Fr. 06. Jun. 10:30 Uhr bestätigt.
Aktion: Status erkannt • Termin bestätigt • Team nicht unterbrochen
```

---

## Szenario 4 — Foto / Datei-Eingang (`demo-eskalation.mp3`)

**Modul:** Foto & Datei / optional WhatsApp  
**Kategorie:** GENERAL · Dringlichkeit: MEDIUM  
**Ziel:** Vage Beschreibung wird per Upload-Link zu einem nutzbaren Fall.  
**Anruferin:** Anika (weiblich)  
**Geschätzte Dauer:** ~30 s

> ✅ **TSX-Update erledigt:** Das Szenario `id: "eskalation"` in
> `LiveDemoSection.tsx` ist auf das Foto-/Datei-Modul umgestellt.
> Struktur, Styling und ID bleiben gleich.

### Transkript (revidiert — Foto-Modul)

| Runde | Sprecher | Text | Gesch. Start |
|---|---|---|---|
| 1 | **Monika** | Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen? | 0.0 s |
| 2 | Anika | Hallo, ich habe ein Problem bei mir im Betrieb — das ist schwer zu beschreiben, ich weiß nicht genau, woran es liegt. | 7.0 s |
| 3 | **Monika** | Kein Problem. Am einfachsten geht das mit einem kurzen Foto oder Video. Ich schicke Ihnen gleich einen Upload-Link per SMS. Darf ich Ihre Handynummer kurz aufnehmen? | 14.5 s |
| 4 | Anika | Ja, gerne. Sie können die 0151er nehmen. | 24.0 s |
| 5 | **Monika** | Perfekt. Der Link ist unterwegs. Schicken Sie das Foto, sobald Sie können — das Team bekommt Ihre Meldung mit dem Bild direkt übergeben. | 27.5 s |
| 6 | Anika | Super, vielen Dank. | 38.0 s |
| 7 | **Monika** | Sehr gerne. Auf Wiederhören! | 39.5 s |

### Ergebnis-Karte (nach TSX-Update)

```
Ticket: #BM-7033
Zusammenfassung: Unklares Anliegen per Foto-Upload strukturiert übergeben.
Aktion: Upload-Link versandt • Foto-Eingang erwartet • Team vorbereitet
```

### TSX-Änderung (Scenario 4 — `id: "eskalation"`)

Folgende Felder in `LiveDemoSection.tsx` vor der Generierung anpassen:

```ts
{
  id: "eskalation",
  title: "Foto & Datei einreichen",
  category: "GENERAL",
  urgency: "MEDIUM",
  audioSrc: "/demo-eskalation.mp3",
  transcript: [
    { time: 0.0,  speaker: "assistant", text: "Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen?" },
    { time: 7.0,  speaker: "caller",    text: "Hallo, ich habe ein Problem bei mir im Betrieb — das ist schwer zu beschreiben, ich weiß nicht genau, woran es liegt." },
    { time: 14.5, speaker: "assistant", text: "Kein Problem. Am einfachsten geht das mit einem kurzen Foto oder Video. Ich schicke Ihnen gleich einen Upload-Link per SMS. Darf ich Ihre Handynummer kurz aufnehmen?" },
    { time: 24.0, speaker: "caller",    text: "Ja, gerne. Sie können die 0151er nehmen." },
    { time: 27.5, speaker: "assistant", text: "Perfekt. Der Link ist unterwegs. Schicken Sie das Foto, sobald Sie können — das Team bekommt Ihre Meldung mit dem Bild direkt übergeben." },
    { time: 38.0, speaker: "caller",    text: "Super, vielen Dank." },
    { time: 39.5, speaker: "assistant", text: "Sehr gerne. Auf Wiederhören!" }
  ],
  finalResult: {
    ticketId: "#BM-7033",
    summary: "Unklares Anliegen per Foto-Upload strukturiert übergeben.",
    action: "Upload-Link versandt • Foto-Eingang erwartet • Team vorbereitet"
  }
}
```

---

## Generierungs-Checkliste (vor dem Start)

- [x] TSX Szenario 4 (`eskalation`) aktualisiert (Transcript + finalResult)
- [x] `scripts/generate_audio_demos.py` auf Agenteq-KMU-Assistants-Pfade umgestellt (siehe Generator-Änderungen unten)
- [ ] KIE_API_KEY in `local_ai_factory/.env` gesetzt
- [ ] `scratch/audio_cache_basemodul/` ggf. geleert (bei Re-Generierung)
- [ ] Freigabe durch User erteilt

---

## Generator-Änderungen (umgesetzt vor Generierung)

Datei: `AI-Creator-Tool/scripts/generate_audio_demos.py`

**1. Pfade (Zeilen 47–48)**
```python
# Alt:
OUTPUT_DIR    = PROJECT_ROOT.parent / "CALLFOLIO_MVP" / "public"
FRONTEND_FILE = PROJECT_ROOT.parent / "CALLFOLIO_MVP" / "components" / "landing" / "LiveDemoSection.tsx"

# Neu:
OUTPUT_DIR    = PROJECT_ROOT.parent / "Agenteq-KMU-Assistants" / "web" / "public"
FRONTEND_FILE = PROJECT_ROOT.parent / "Agenteq-KMU-Assistants" / "web" / "components" / "landing" / "LiveDemoSection.tsx"
```

**2. VOICE_CALLER-Mapping (Zeilen 81–86)**
```python
# Alt: Callfolio-IDs (siphon, stromausfall, status, eskalation)
# Neu: gleiche IDs, angepasste Zuweisung
VOICE_CALLER = {
    "siphon":      VOICE_CATALOG["Lutz"],   # männlicher Anrufer
    "stromausfall": VOICE_CATALOG["Anika"], # weibliche Anruferin
    "status":      VOICE_CATALOG["Lutz"],   # männlicher Anrufer
    "eskalation":  VOICE_CATALOG["Anika"],  # weibliche Anruferin
}
```
*(Stromausfall war bisher Anika — unverändert. Eskalation war Anika — unverändert. Keine Änderung nötig, nur zur Klarheit dokumentiert.)*

**3. SCENARIOS-Block ersetzen (Zeilen 89–146)**  
Die 4 Szenarien durch die finalen basemodul.de-Skripte aus diesem Dokument ersetzen.
Exakte `dialogue`-Arrays mit den Transkript-Texten oben befüllen.
`planned_times` aus der Spalte "Gesch. Start" übernehmen.

**4. Kosmetik**
- `"Callfolio Landing Page Audio-Demos"` → `"basemodul.de Audio-Demos"`
- Audition-Begrüßungstext entfernt Hausverwaltungs-Referenz
- Cache getrennt über `scratch/audio_cache_basemodul/`, damit keine alten Callfolio-Rohdateien wiederverwendet werden
