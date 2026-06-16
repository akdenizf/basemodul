# Audio-Demo Skripte & Produktions-Guide

Dieses Dokument enthält die exakten Skripte, Sprechzeiten und Produktionsanweisungen zur Erstellung der Audio-Dateien für die Landingpage-Demos von Callfolio. 

Die Audio-Dateien müssen exakt auf die Timestamps in der React-Komponente [LiveDemoSection.tsx](file:///Users/user/Desktop/Projects/CALLFOLIO_MVP/components/landing/LiveDemoSection.tsx) abgestimmt sein, damit Text, Visualizer und Ton perfekt synchron laufen.

---

## 1. Stimmen-Profile

Um ein realistisches Telefongespräch zu simulieren, werden zwei unterschiedliche Stimmen verwendet. Stimme A entspricht exakt eurer Vapi-Konfiguration.

### Stimme A: Die KI-Assistentin (Callfolio - Vapi Live-Setup)
* **ElevenLabs Custom Voice ID:** `Nf7t9cuyo0u3kuvi9q4b` (aus eurer Voice Library)
* **Voice Model:** `Eleven_turbo_v2_5`
* **Vapi / ElevenLabs Settings:**
  * *Stability:* `0.5` (More Stable)
  * *Clarity + Similarity:* `0.7` (High)
  * *Speed:* `1.0` (Normal)
  * *Style Exaggeration:* `0.0` (None / Fastest)
  * *Use Speaker Boost:* Aktiviert (`true`)
  * *Optimize Streaming Latency:* `1`
  * *Auto Mode:* Deaktiviert (`false`)

### Stimme B: Der Mieter / Anrufer
* **Charakter:** Alltäglich, leicht besorgt/gestresst, spricht in normalem Tempo.
* **ElevenLabs Empfehlung:**
  * Name: `Marcus` (natürlicher deutscher Mann) oder ein ähnlicher deutscher Sprecher aus der Library.
  * **Settings:**
    * *Stability:* `0.3` – `0.4` (niedrigere Stabilität lässt die Stimme lebendiger und menschlicher wirken).
    * *Clarity + Similarity:* `0.7`.
    * *Style Exaggeration:* `0.1` – `0.15` (für eine natürlichere, leicht besorgte Betonung).

---

## 2. Szenario 1: Tropfender Siphon (`demo.mp3`)
**Gesamtlänge Ziel:** ca. **33 Sekunden**

Dieses Szenario zeigt einen Standard-Schadensfall mittlerer Priorität im Sanitär-Bereich.

### Produktions-Timeline (Stitching)

| Start (Sekunde) | Sprecher | Text für ElevenLabs | Ziel-Dauer | Hinweis für Schnitt |
| :--- | :--- | :--- | :--- | :--- |
| **0.0s** | **KI** | "Grüß Gott bei Ihrer Hausverwaltung. Ich bin der KI-Assistent der Zentrale. Wie kann ich Ihnen behilflich sein?" | 6.0s | Direkt am Start einblenden. |
| *6.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **6.0s** | **Mieter** | "Hallo, hier ist Müller aus der Hauptstraße 12. Bei mir tropft der Siphon im Bad." | 4.5s | Muss exakt ab 6.0s starten. |
| *10.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **10.5s** | **KI** | "Guten Tag Herr Müller. Ich habe Ihr Profil gefunden. Hauptstraße 12, Erdgeschoss. Steht schon ein Eimer darunter?" | 5.5s | Startet bei 10.5s. |
| *16.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **16.0s** | **Mieter** | "Ja, Eimer steht drunter, aber es ist schon ziemlich nass." | 3.0s | Startet bei 16.0s. |
| *19.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **19.0s** | **KI** | "Alles klar. Ich lege sofort ein Ticket für Sie an und informiere unseren Sanitär-Partner. Sie erhalten gleich eine SMS mit einem Link, um ein kurzes Foto hochzuladen." | 8.5s | Startet bei 19.0s. |
| *27.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **27.5s** | **Mieter** | "Super, mache ich. Danke!" | 2.0s | Startet bei 27.5s. |
| *29.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **29.5s** | **KI** | "Gern geschehen. Ein Handwerker wird sich in Kürze bei Ihnen zur Terminvereinbarung melden. Auf Wiederhören!" | 3.5s | Startet bei 29.5s. |

* **Export:** Die fertige Datei als `demo.mp3` im Ordner [public/](file:///Users/user/Desktop/Projects/CALLFOLIO_MVP/public/) speichern.

---

## 3. Szenario 2: Kompletter Stromausfall (`demo-strom.mp3`)
**Gesamtlänge Ziel:** ca. **32 Sekunden**

Dieses Szenario zeigt einen hoch-priorisierten Notfall (Elektro) außerhalb der Arbeitszeit.

### Produktions-Timeline (Stitching)

| Start (Sekunde) | Sprecher | Text für ElevenLabs | Ziel-Dauer | Hinweis für Schnitt |
| :--- | :--- | :--- | :--- | :--- |
| **0.0s** | **KI** | "Grüß Gott bei Ihrer Hausverwaltung. Ich bin der KI-Assistent der Zentrale. Wie kann ich Ihnen behilflich sein?" | 6.0s | Direkt am Start einblenden. |
| *6.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **6.0s** | **Mieter** | "Ja, hallo. Bei uns im gesamten Erdgeschoss ist der Strom weg." | 4.0s | Startet bei 6.0s. |
| *10.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **10.0s** | **KI** | "Das verstehe ich. Haben Sie bereits den Sicherungskasten überprüft, ob der FI-Schalter herausgesprungen ist?" | 5.5s | Startet bei 10.0s. |
| *15.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **15.5s** | **Mieter** | "Ja, habe ich probiert, aber er springt immer wieder sofort raus." | 4.5s | Startet bei 15.5s. |
| *20.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **20.0s** | **KI** | "In Ordnung. Da der Kühlschrank betroffen ist, setze ich die Dringlichkeit auf Hoch. Ein Notfall-Elektriker wird umgehend benachrichtigt." | 6.5s | Startet bei 20.0s. |
| *26.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **26.5s** | **Mieter** | "Vielen Dank, das ist super." | 1.5s | Startet bei 26.5s. |
| *28.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **28.0s** | **KI** | "Gerne. Er wird sich in den nächsten 15 Minuten bei Ihnen melden. Auf Wiederhören!" | 4.0s | Startet bei 28.0s. |

* **Export:** Die fertige Datei als `demo-strom.mp3` im Ordner [public/](file:///Users/user/Desktop/Projects/CALLFOLIO_MVP/public/) speichern.

---

## 4. Szenario 3: Status-Abfrage — „Wann kommt der Handwerker?" (`demo-status.mp3`)
**Gesamtlänge Ziel:** ca. **30 Sekunden**

Dieses Szenario zeigt Callfolios **Datenbankintegration**: Die KI liest das bestehende Ticket des Mieters, nennt den konkreten Handwerker-Termin. Ca. 30% aller Anrufe bei Hausverwaltungen sind reine Statusnachfragen — hier komplett ohne Mitarbeiter abgewickelt.

### Produktions-Timeline (Stitching)

| Start (Sekunde) | Sprecher | Text für ElevenLabs | Ziel-Dauer | Hinweis für Schnitt |
| :--- | :--- | :--- | :--- | :--- |
| **0.0s** | **KI** | "Grüß Gott bei Ihrer Hausverwaltung. Ich bin der KI-Assistent der Zentrale. Wie kann ich Ihnen behilflich sein?" | 6.0s | Direkt am Start einblenden. |
| *6.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **6.0s** | **Mieter** | "Ja, hallo, hier ist Müller, Hauptstraße 12. Ich wollte mal nachfragen, wann der Handwerker wegen meines Siphons kommt." | 5.5s | Startet bei 6.0s. |
| *11.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **11.5s** | **KI** | "Guten Tag Herr Müller. Ich sehe hier Ihr Ticket vom Dienstag. Der Sanitärbetrieb Schulze ist bereits beauftragt und hat den Termin für morgen, Freitag den 6. Juni um 10:30 Uhr, eingetragen." | 9.0s | Startet bei 11.5s. |
| *20.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **20.5s** | **Mieter** | "Super, das passt. Danke!" | 2.0s | Startet bei 20.5s. |
| *22.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **22.5s** | **KI** | "Sehr gerne. Der Handwerker wird sich vorher noch kurz bei Ihnen melden. Auf Wiederhören!" | 5.0s | Startet bei 22.5s. |

* **Export:** Die fertige Datei als `demo-status.mp3` im Ordner [public/](file:///Users/user/Desktop/Projects/CALLFOLIO_MVP/public/) speichern.

---

## 5. Szenario 4: Eskalation — „Es ist schlimmer geworden!" (`demo-eskalation.mp3`)
**Gesamtlänge Ziel:** ca. **33 Sekunden**

Dieses Szenario zeigt Callfolios **Kontext-Bewusstsein**: Die KI erkennt den Anrufer und das bestehende Ticket, erstellt **kein doppeltes Ticket**, stuft die Dringlichkeit auf Kritisch hoch, gibt eine Sofort-Verhaltensanweisung und aktiviert den Notdienst-Workflow.

### Produktions-Timeline (Stitching)

| Start (Sekunde) | Sprecher | Text für ElevenLabs | Ziel-Dauer | Hinweis für Schnitt |
| :--- | :--- | :--- | :--- | :--- |
| **0.0s** | **KI** | "Grüß Gott bei Ihrer Hausverwaltung. Ich bin der KI-Assistent der Zentrale. Wie kann ich Ihnen behilflich sein?" | 6.0s | Direkt am Start einblenden. |
| *6.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **6.0s** | **Mieter** | "Hallo, hier ist Müller, Hauptstraße 12. Wegen dem Siphon im Bad — das Wasser spritzt jetzt richtig raus, der Flur steht schon unter Wasser!" | 6.5s | Leicht gestresste Stimme. |
| *12.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **12.5s** | **KI** | "Herr Müller, ich sehe Ihr bestehendes Ticket. Ich stufe den Vorfall sofort als kritischen Notfall ein. Drehen Sie bitte sofort den Hauptwasserhahn ab, falls möglich. Ich alarmiere jetzt unseren Notdienst-Installateur." | 10.0s | Ruhige, klare, handlungsorientierte Stimme. |
| *22.5s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **22.5s** | **Mieter** | "Okay, ich drehe ihn ab. Danke!" | 2.5s | Startet bei 22.5s. |
| *25.0s* | | *(Kurze Pause / Stille)* | *0.0s* | *Nahtloser Übergang* |
| **25.0s** | **KI** | "Er wird Sie in den nächsten fünf Minuten zurückrufen. Ihr Ticket ist auf Dringlichkeit Kritisch hochgestuft. Auf Wiederhören!" | 6.0s | Startet bei 25.0s. |

* **Export:** Die fertige Datei als `demo-eskalation.mp3` im Ordner [public/](file:///Users/user/Desktop/Projects/CALLFOLIO_MVP/public/) speichern.

---

## 6. Anleitung für den Videoschnitt (z. B. CapCut, Audacity, Premiere Pro)

Falls du die Spuren manuell übereinanderlegst:
1. Generiere die einzelnen Textfragmente (insgesamt 14 MP3s) bei ElevenLabs.
2. Benenne sie sauber (z. B. `siphon_ki_1.mp3`, `siphon_mieter_1.mp3` usw.).
3. Ziehe sie in eine Audiospur in deiner Schnittsoftware.
4. Richte die Clips exakt nach der obigen Spalte **"Start (Sekunde)"** aus.
5. Exportiere den gesamten Timeline-Abschnitt als **MP3** mit **128kbps** oder **192kbps** (nicht zu groß für schnelle Web-Ladezeiten).

---

## Bonus: Automatisches Stitching per Python-Skript
Falls du viele dieser Demos bauen willst oder Python bevorzugst, kannst du dieses Skript nutzen, um die generierten Clips automatisch passend zusammenzufügen. 

*Voraussetzung:* `pip install pydub` (benötigt ffmpeg auf dem Rechner).

```python
import os
from pydub import AudioSegment

def stitch_scenario(parts, output_path, total_duration_ms):
    # Starte mit einer leeren (leisen) Spur der gesamten Länge
    combined = AudioSegment.silent(duration=total_duration_ms)
    
    for start_ms, file_path in parts:
        if os.path.exists(file_path):
            sound = AudioSegment.from_file(file_path)
            # Clip an der exakten Startzeit einfügen (overlay)
            combined = combined.overlay(sound, position=start_ms)
            print(f"Overlayed {file_path} at {start_ms/1000.0}s")
        else:
            print(f"Warning: File {file_path} not found!")
            
    # Export als MP3
    combined.export(output_path, format="mp3", bitrate="128k")
    print(f"Exported combined audio to {output_path}\n")

# Beispiel-Konfiguration für Siphon (Zeiten in Millisekunden)
siphon_parts = [
    (0, "siphon_ki_1.mp3"),
    (6000, "siphon_mieter_1.mp3"),
    (10500, "siphon_ki_2.mp3"),
    (16000, "siphon_mieter_2.mp3"),
    (19000, "siphon_ki_3.mp3"),
    (27500, "siphon_mieter_3.mp3"),
    (29500, "siphon_ki_4.mp3")
]

# stitch_scenario(siphon_parts, "public/demo.mp3", 33000)
```
