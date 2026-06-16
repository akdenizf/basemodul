# Callfolio Video Content Automation Plan

Dieses Dokument beschreibt die Architektur, Datenstruktur und Implementierung für die automatisierte Generierung von 50 Callfolio Marketing-Videos via Remotion. Ziel ist es, für Social Media (Instagram Reels, LinkedIn) dynamische Use-Cases im "German Engineering" Design (Dark Mode) zu visualisieren.

## 1. System-Architektur

Die Video-Pipeline basiert auf einem datengetriebenen Ansatz:
1. **Datenquelle (JSON):** Eine Master-JSON-Datei (`scenes.json`) hält die Parameter für alle 50 Videos.
2. **Remotion Parameter-Injection:** Beim Rendern wird jedes JSON-Objekt als `inputProps` an die Remotion-Root-Komponente übergeben.
3. **Komponenten-Baum:** Die Hauptkomponente `CallfolioVideo.tsx` verarbeitet die Props und steuert die Timeline der Animationen.
4. **CI/CD Render Loop:** Ein Bash-Skript liest die JSON-Datei, iteriert über alle Objekte und triggert den `npx remotion render`-Prozess für jede ID, wobei die Ausgabedatei entsprechend benannt wird (z.B. `video-01-emergency.mp4`).

## 2. Themen-Cluster

Die 50 Videos decken folgende Kern-Use-Cases einer Hausverwaltung ab (jeweils 10 Videos):

1. **Notfälle (EMERGENCY):** Wasserrohrbrüche, Heizungsausfall im Winter, Stromausfall, Sturmschäden. Hohe Dringlichkeit (Rot/Pulsierend).
2. **Kaufmännisches (BILLING):** Fragen zu Nebenkosten, Mietzahlungen, SEPA-Mandaten, Kaution. Mittlere Dringlichkeit.
3. **Mieterwechsel (TENANT_CHANGE):** Wohnungsübergabe, Namensschilder, Schlüsselverlust, Nachmieter. Niedrige bis mittlere Dringlichkeit.
4. **Lärm/Hausfrieden (COMMUNITY):** Ruhestörung, Mülltrennung, Fluchtwege blockiert, Haustiere. Mittlere Dringlichkeit (Fokus auf Dokumentation).
5. **Instandhaltung (MAINTENANCE):** Tropfender Hahn, Fenster klemmt, Aufzug defekt, Licht im Flur. Mittlere Dringlichkeit.

## 3. Master-JSON Struktur (`scenes.json`)

Hier ist die Definition der 50 Use-Cases, die direkt in den Remotion-Build gepiped werden.

```json
[
  // --- 1. NOTFÄLLE (EMERGENCY) ---
  { "id": "01", "category": "EMERGENCY", "callerName": "Thomas Müller", "address": "Goethestraße 12, München", "urgency": "HIGH", "transcriptSnippet": "Hallo, im Keller steht das Wasser! Das Hauptrohr ist geplatzt, es läuft unaufhörlich!" },
  { "id": "02", "category": "EMERGENCY", "callerName": "Bernd Schneider", "address": "Schillerplatz 4, Berlin", "urgency": "HIGH", "transcriptSnippet": "Die Heizung ist komplett ausgefallen und wir haben draußen minus 5 Grad. Bitte schnell reparieren." },
  { "id": "03", "category": "EMERGENCY", "callerName": "Sabine Weber", "address": "Lindenweg 8, Hamburg", "urgency": "HIGH", "transcriptSnippet": "Im Treppenhaus riecht es massiv nach Gas! Ich habe schon die Feuerwehr gerufen, aber Sie müssen Bescheid wissen." },
  { "id": "04", "category": "EMERGENCY", "callerName": "Ali Yilmaz", "address": "Hauptstraße 45, Köln", "urgency": "HIGH", "transcriptSnippet": "Der Sturm hat das halbe Dach abgedeckt, die Ziegel fallen auf den Gehweg." },
  { "id": "05", "category": "EMERGENCY", "callerName": "Julia Schmidt", "address": "Ringstraße 10, Frankfurt", "urgency": "HIGH", "transcriptSnippet": "Wir haben im gesamten Block keinen Strom mehr und im Aufzug stecken Leute fest!" },
  { "id": "06", "category": "EMERGENCY", "callerName": "Klaus Fischer", "address": "Bahnhofstraße 2, Stuttgart", "urgency": "HIGH", "transcriptSnippet": "Es brennt in der Mülltonne im Innenhof, das Feuer droht auf die Fassade überzugreifen." },
  { "id": "07", "category": "EMERGENCY", "callerName": "Anna Wagner", "address": "Marktplatz 1, Leipzig", "urgency": "HIGH", "transcriptSnippet": "Ein Baum ist auf den Parkplatz gestürzt und blockiert komplett die Ausfahrt." },
  { "id": "08", "category": "EMERGENCY", "callerName": "Miriam Becker", "address": "Königsallee 55, Düsseldorf", "urgency": "HIGH", "transcriptSnippet": "Die Eingangstür lässt sich nicht mehr verriegeln, sie steht sperrangelweit offen." },
  { "id": "09", "category": "EMERGENCY", "callerName": "Peter Hoffmann", "address": "Neustadt 22, Bremen", "urgency": "HIGH", "transcriptSnippet": "Das Abwasser drückt aus der Toilette zurück ins Bad, alles ist überschwemmt!" },
  { "id": "10", "category": "EMERGENCY", "callerName": "Lisa Bauer", "address": "Waldweg 7, Hannover", "urgency": "HIGH", "transcriptSnippet": "Der Schornstein droht abzustürzen, die Ziegel lösen sich schon." },

  // --- 2. KAUFMÄNNISCHES (BILLING) ---
  { "id": "11", "category": "BILLING", "callerName": "Michael Koch", "address": "Amselweg 3, Dresden", "urgency": "LOW", "transcriptSnippet": "Ich habe eine Frage zu meiner Nebenkostenabrechnung. Die Position für Hausmeisterkosten ist zu hoch." },
  { "id": "12", "category": "BILLING", "callerName": "Sarah Richter", "address": "Meisenstraße 14, Nürnberg", "urgency": "LOW", "transcriptSnippet": "Bitte schicken Sie mir ein Formular zur Erteilung eines SEPA-Lastschriftmandats zu." },
  { "id": "13", "category": "BILLING", "callerName": "Lukas Braun", "address": "Drosselweg 9, Duisburg", "urgency": "LOW", "transcriptSnippet": "Wann wird meine Mietkaution ausbezahlt? Ich bin letzten Monat ausgezogen." },
  { "id": "14", "category": "BILLING", "callerName": "Emma Wolf", "address": "Turmstraße 21, Bochum", "urgency": "LOW", "transcriptSnippet": "Ich möchte eine Mietminderung wegen des anhaltenden Baulärms anmelden." },
  { "id": "15", "category": "BILLING", "callerName": "Felix Schröder", "address": "Bergstraße 11, Wuppertal", "urgency": "MEDIUM", "transcriptSnippet": "Mein Arbeitgeber braucht eine Bescheinigung über die Miethöhe für den Zuschuss." },
  { "id": "16", "category": "BILLING", "callerName": "Laura Neumann", "address": "Talblick 5, Bielefeld", "urgency": "LOW", "transcriptSnippet": "Die Miete für diesen Monat kann ich leider erst drei Tage später überweisen." },
  { "id": "17", "category": "BILLING", "callerName": "Maximilian Schwarz", "address": "Seestraße 33, Bonn", "urgency": "LOW", "transcriptSnippet": "Ist die Erhöhung der Vorauszahlung für die Heizkosten ab sofort gültig?" },
  { "id": "18", "category": "BILLING", "callerName": "Sophie Zimmermann", "address": "Gartenweg 2, Münster", "urgency": "LOW", "transcriptSnippet": "Ich brauche eine Kopie des aktuellen Mietvertrags für das Einwohnermeldeamt." },
  { "id": "19", "category": "BILLING", "callerName": "Leon Krüger", "address": "Parkstraße 8, Karlsruhe", "urgency": "MEDIUM", "transcriptSnippet": "Mir wurden Mahngebühren berechnet, obwohl ich pünktlich überwiesen habe." },
  { "id": "20", "category": "BILLING", "callerName": "Mia Hofmann", "address": "Sonnenallee 17, Mannheim", "urgency": "LOW", "transcriptSnippet": "Wo finde ich meine Kundennummer für die Überweisung?" },

  // --- 3. MIETERWECHSEL (TENANT_CHANGE) ---
  { "id": "21", "category": "TENANT_CHANGE", "callerName": "David Lange", "address": "Wiesenweg 6, Augsburg", "urgency": "MEDIUM", "transcriptSnippet": "Ich brauche einen Termin für die Schlüsselübergabe nächste Woche Freitag." },
  { "id": "22", "category": "TENANT_CHANGE", "callerName": "Johanna Schmitt", "address": "Brunnenstraße 18, Wiesbaden", "urgency": "LOW", "transcriptSnippet": "Mein Name am Briefkasten muss noch auf 'Schmitt-Fischer' geändert werden." },
  { "id": "23", "category": "TENANT_CHANGE", "callerName": "Simon Werner", "address": "Feldgasse 4, Gelsenkirchen", "urgency": "MEDIUM", "transcriptSnippet": "Ich habe meinen Haustürschlüssel verloren und brauche dringend Ersatz." },
  { "id": "24", "category": "TENANT_CHANGE", "callerName": "Clara Krause", "address": "Ostwall 12, Mönchengladbach", "urgency": "LOW", "transcriptSnippet": "Kann ich dem Nachmieter die Einbauküche überlassen? Wie ist da der Ablauf?" },
  { "id": "25", "category": "TENANT_CHANGE", "callerName": "Paul Meier", "address": "Nordring 9, Braunschweig", "urgency": "LOW", "transcriptSnippet": "Bitte stellen Sie mir eine Wohnungsgeberbestätigung aus." },
  { "id": "26", "category": "TENANT_CHANGE", "callerName": "Lea Lehmann", "address": "Südstraße 3, Chemnitz", "urgency": "MEDIUM", "transcriptSnippet": "Der Vorbesitzer hat den Keller nicht besenrein hinterlassen, da steht noch Sperrmüll." },
  { "id": "27", "category": "TENANT_CHANGE", "callerName": "Jonas Huber", "address": "Westallee 7, Kiel", "urgency": "LOW", "transcriptSnippet": "Wie läuft das mit der Zählerstandsmeldung bei Auszug?" },
  { "id": "28", "category": "TENANT_CHANGE", "callerName": "Marie Schmid", "address": "Hafenstraße 22, Aachen", "urgency": "MEDIUM", "transcriptSnippet": "Ich möchte einen potenziellen Nachmieter vorschlagen, schicke Ihnen gleich die Papiere." },
  { "id": "29", "category": "TENANT_CHANGE", "callerName": "Niklas Fuchs", "address": "Burgweg 1, Halle", "urgency": "LOW", "transcriptSnippet": "Sind im Haus Haustiere erlaubt? Mein Nachmieter hat einen kleinen Hund." },
  { "id": "30", "category": "TENANT_CHANGE", "callerName": "Amelie Jäger", "address": "Schlossplatz 5, Magdeburg", "urgency": "LOW", "transcriptSnippet": "Wann bekomme ich das Übergabeprotokoll zugeschickt?" },

  // --- 4. LÄRM / HAUSFRIEDEN (COMMUNITY) ---
  { "id": "31", "category": "COMMUNITY", "callerName": "Tim Weiß", "address": "Eichenkamp 11, Freiburg", "urgency": "MEDIUM", "transcriptSnippet": "Die Nachbarn über mir feiern schon wieder lautstark unter der Woche." },
  { "id": "32", "category": "COMMUNITY", "callerName": "Hanna Stein", "address": "Kastanienallee 2, Krefeld", "urgency": "LOW", "transcriptSnippet": "Jemand stellt ständig seinen Restmüll in die Papiertonne. Das müssen Sie klären." },
  { "id": "33", "category": "COMMUNITY", "callerName": "Jan Möller", "address": "Tannenweg 8, Lübeck", "urgency": "MEDIUM", "transcriptSnippet": "Im Treppenhaus stehen Kinderwagen und Fahrräder im Weg, das ist ein Fluchtweg!" },
  { "id": "34", "category": "COMMUNITY", "callerName": "Lina Haas", "address": "Birkenstraße 15, Oberhausen", "urgency": "LOW", "transcriptSnippet": "Der Hund von Herrn Petersen bellt den ganzen Tag, wenn er auf Arbeit ist." },
  { "id": "35", "category": "COMMUNITY", "callerName": "Moritz Seidel", "address": "Buchenring 4, Erfurt", "urgency": "LOW", "transcriptSnippet": "Die Hofeinfahrt wird immer wieder von fremden Autos zugeparkt." },
  { "id": "36", "category": "COMMUNITY", "callerName": "Pia Heinrich", "address": "Pappelweg 7, Rostock", "urgency": "MEDIUM", "transcriptSnippet": "Es riecht ständig nach kaltem Rauch im Flur, zieht von unten hoch." },
  { "id": "37", "category": "COMMUNITY", "callerName": "Tobias Graf", "address": "Ulmenhof 1, Mainz", "urgency": "LOW", "transcriptSnippet": "Der Putzplan für das Treppenhaus wird von der EG-Wohnung konsequent ignoriert." },
  { "id": "38", "category": "COMMUNITY", "callerName": "Elena Dietz", "address": "Weidenweg 19, Kassel", "urgency": "MEDIUM", "transcriptSnippet": "Da füttert immer jemand Tauben auf dem Balkon, das zieht Schmutz und Ungeziefer an." },
  { "id": "39", "category": "COMMUNITY", "callerName": "Oskar Busch", "address": "Fichtenstraße 6, Hagen", "urgency": "LOW", "transcriptSnippet": "Im Waschkeller belegt jemand dauerhaft beide Maschinen." },
  { "id": "40", "category": "COMMUNITY", "callerName": "Nele Kuhn", "address": "Ahornplatz 3, Saarbrücken", "urgency": "MEDIUM", "transcriptSnippet": "Es wird im Innenhof gegrillt und der ganze Qualm zieht in mein Schlafzimmer." },

  // --- 5. INSTANDHALTUNG (MAINTENANCE) ---
  { "id": "41", "category": "MAINTENANCE", "callerName": "Julian Pohl", "address": "Rosenweg 12, Hamm", "urgency": "MEDIUM", "transcriptSnippet": "Der Wasserhahn in der Küche tropft ununterbrochen, die Dichtung ist hin." },
  { "id": "42", "category": "MAINTENANCE", "callerName": "Ida Arnold", "address": "Tulpenstraße 5, Mülheim", "urgency": "MEDIUM", "transcriptSnippet": "Das Fenster im Wohnzimmer schließt nicht mehr richtig, da zieht es furchtbar." },
  { "id": "43", "category": "MAINTENANCE", "callerName": "Marlon Engel", "address": "Nelkenweg 8, Potsdam", "urgency": "MEDIUM", "transcriptSnippet": "Der Aufzug ist schon wieder stecken geblieben, er fährt nicht mehr." },
  { "id": "44", "category": "MAINTENANCE", "callerName": "Frieda Günther", "address": "Veilchenstraße 2, Ludwigshafen", "urgency": "LOW", "transcriptSnippet": "Das Licht im Flur im 2. Stock ist defekt, man sieht abends nichts mehr." },
  { "id": "45", "category": "MAINTENANCE", "callerName": "Anton Frank", "address": "Krokusweg 4, Oldenburg", "urgency": "MEDIUM", "transcriptSnippet": "Der Rollladen im Schlafzimmer klemmt, er lässt sich weder hoch noch runter lassen." },
  { "id": "46", "category": "MAINTENANCE", "callerName": "Mila Schubert", "address": "Dahlienplatz 7, Osnabrück", "urgency": "MEDIUM", "transcriptSnippet": "Am Balkon ist eine Fliese gesprungen, da muss man aufpassen." },
  { "id": "47", "category": "MAINTENANCE", "callerName": "Emil Wulf", "address": "Lilienhof 1, Leverkusen", "urgency": "LOW", "transcriptSnippet": "Die Türklingel unten am Haupteingang für meine Wohnung funktioniert nicht." },
  { "id": "48", "category": "MAINTENANCE", "callerName": "Greta Roth", "address": "Sonnenblumenweg 3, Heidelberg", "urgency": "MEDIUM", "transcriptSnippet": "Im Kellerabteil 4 ist Schimmel an der Außenwand entstanden." },
  { "id": "49", "category": "MAINTENANCE", "callerName": "Carl Vogt", "address": "Distelweg 9, Darmstadt", "urgency": "LOW", "transcriptSnippet": "Das Garagentor schließt sehr laut und quietscht unangenehm." },
  { "id": "50", "category": "MAINTENANCE", "callerName": "Mathilda Janke", "address": "Farnstraße 11, Paderborn", "urgency": "MEDIUM", "transcriptSnippet": "Die Gegensprechanlage rauscht nur noch, man versteht kein Wort." }
]
```

## 4. Remotion Script-Grundgerüst (`CallfolioVideo.tsx`)

Um das Konzept des "German Engineering" umzusetzen, nutzen wir einen Dark Mode mit klaren Struktur-Linien und präzisen Animationen (ähnlich Framer Motion). Besondere Aufmerksamkeit gilt dem pulsierenden Vapi-Interface und der 3-Tier Matching Engine.

```tsx
import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence
} from 'remotion';

// Interfaces passend zur JSON Struktur
export interface CallfolioVideoProps {
  id: string;
  category: string;
  callerName: string;
  address: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  transcriptSnippet: string;
}

const THEME = {
  bg: '#0F172A', // Deep Anthracite
  bgAccent: '#1E293B',
  primary: '#2563EB', // Cobalt Blue / V8.1 Accent
  textWhite: '#FAFBFC',
  textSlate: '#94A3B8',
  danger: '#EF4444',
  success: '#10B981',
};

export const CallfolioVideo: React.FC<CallfolioVideoProps> = ({
  category,
  callerName,
  address,
  urgency,
  transcriptSnippet,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation Werte berechnen
  const fadeUpMain = spring({ frame, fps, config: { damping: 15 } });
  const translateY = interpolate(fadeUpMain, [0, 1], [50, 0]);
  const opacity = interpolate(fadeUpMain, [0, 1], [0, 1]);

  // Vapi Pulse Animation (Loop)
  const pulseScale = interpolate(
    Math.sin((frame / fps) * Math.PI * 2), // 1 Pulse pro Sekunde
    [-1, 1],
    [1, 1.15]
  );
  const pulseGlow = interpolate(
    Math.sin((frame / fps) * Math.PI * 2),
    [-1, 1],
    [0.2, 0.6]
  );

  const urgencyColor = urgency === 'HIGH' ? THEME.danger : (urgency === 'MEDIUM' ? THEME.primary : THEME.success);

  // 3-Tier Matching Engine Sequenz
  const showTier1 = frame > fps * 2; // Analyse nach 2s
  const showTier2 = frame > fps * 3.5; // Zuweisung nach 3.5s
  const showTier3 = frame > fps * 5; // Ticket erstellt nach 5s

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg, color: THEME.textWhite, fontFamily: 'Inter, sans-serif' }}>
      
      {/* Background Noise / Grid Overlay (Subtle) */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Main Container */}
      <AbsoluteFill style={{ padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        <div style={{ transform: `translateY(${translateY}px)`, opacity, display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Header & Vapi Visualizer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', borderBottom: `1px solid ${THEME.bgAccent}`, paddingBottom: '30px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', backgroundColor: THEME.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `scale(${pulseScale})`,
              boxShadow: `0 0 40px rgba(37, 99, 235, ${pulseGlow})`
            }}>
              <span style={{ fontSize: '30px' }}>🤖</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '24px', color: THEME.textSlate, fontWeight: 500 }}>Eingehender Anruf via Callfolio AI</p>
              <h1 style={{ margin: '8px 0 0', fontSize: '48px', fontWeight: 600 }}>{callerName}</h1>
            </div>
            <div style={{ marginLeft: 'auto', padding: '12px 24px', backgroundColor: urgencyColor, borderRadius: '100px', fontWeight: 600, fontSize: '20px' }}>
              {category}
            </div>
          </div>

          {/* Transcript Visualization */}
          <div style={{ backgroundColor: THEME.bgAccent, padding: '40px', borderRadius: '24px', border: `1px solid rgba(255,255,255,0.1)` }}>
            <p style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '22px', color: THEME.textSlate }}>Live Transkription:</p>
            <p style={{ fontSize: '36px', lineHeight: 1.4, fontWeight: 400, marginTop: '20px' }}>"{transcriptSnippet}"</p>
          </div>

          {/* 3-Tier Matching Engine Visualization */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            
            {/* Tier 1: Intent Recognition */}
            <div style={{ flex: 1, backgroundColor: showTier1 ? THEME.bgAccent : 'transparent', border: `2px solid ${showTier1 ? THEME.primary : THEME.bgAccent}`, padding: '30px', borderRadius: '16px', transition: 'all 0.4s ease', opacity: showTier1 ? 1 : 0.3 }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: THEME.textSlate }}>Schritt 1: Analyse</h3>
              {showTier1 && <p style={{ fontSize: '24px', fontWeight: 600, marginTop: '10px', color: THEME.primary }}>Intent: {category} erkannt</p>}
            </div>

            {/* Tier 2: Entity Extraction & Matching */}
            <div style={{ flex: 1, backgroundColor: showTier2 ? THEME.bgAccent : 'transparent', border: `2px solid ${showTier2 ? THEME.primary : THEME.bgAccent}`, padding: '30px', borderRadius: '16px', transition: 'all 0.4s ease', opacity: showTier2 ? 1 : 0.3 }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: THEME.textSlate }}>Schritt 2: Extraktion</h3>
              {showTier2 && <p style={{ fontSize: '24px', fontWeight: 600, marginTop: '10px', color: THEME.primary }}>Match: {address}</p>}
            </div>

            {/* Tier 3: Action Execution */}
            <div style={{ flex: 1, backgroundColor: showTier3 ? THEME.primary : 'transparent', border: `2px solid ${showTier3 ? THEME.primary : THEME.bgAccent}`, padding: '30px', borderRadius: '16px', transition: 'all 0.4s ease', opacity: showTier3 ? 1 : 0.3 }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: showTier3 ? '#fff' : THEME.textSlate }}>Schritt 3: Ausführung</h3>
              {showTier3 && <p style={{ fontSize: '24px', fontWeight: 600, marginTop: '10px', color: '#fff' }}>Ticket erstellt & zugewiesen</p>}
            </div>

          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

## 5. CI/CD Render-Befehl (Bash Skript)

Dieses Skript liest die `scenes.json` mithilfe von `jq` aus und führt den Remotion CLI Command iterativ aus, um jedes Video vollautomatisiert mit den individuellen Props zu rendern.

```bash
#!/bin/bash
# render_all_videos.sh
# Voraussetzung: jq muss installiert sein (brew install jq / apt-get install jq)

SCENES_FILE="scenes.json"
COMP_NAME="CallfolioVideo"
OUT_DIR="out/marketing_videos"

mkdir -p "$OUT_DIR"

# Zähle die Anzahl der Videos
COUNT=$(jq '. | length' $SCENES_FILE)

echo "Starte Render-Prozess für $COUNT Videos..."

for i in $(seq 0 $((COUNT - 1))); do
  # Extrahiere Objekt als JSON String
  PROPS=$(jq -c ".[$i]" $SCENES_FILE)
  
  # Extrahiere ID und Category für den Dateinamen
  ID=$(jq -r ".[$i].id" $SCENES_FILE)
  CATEGORY=$(jq -r ".[$i].category" $SCENES_FILE)
  
  FILENAME="${OUT_DIR}/video-${ID}-${CATEGORY}.mp4"
  
  echo "Rendere Video $ID ($CATEGORY)..."
  
  # Führe Remotion CLI aus und übergebe Props
  npx remotion render src/index.ts $COMP_NAME $FILENAME --props="$PROPS"
  
  echo "Fertig: $FILENAME"
done

echo "Alle $COUNT Videos erfolgreich gerendert!"
```

## 6. Design-Vorgaben ("German Engineering")

Damit die Videos den Vorgaben aus dem `GEMINI.md` entsprechen, sind folgende Richtlinien zwingend bei der Ausarbeitung der Remotion-Komponente zu beachten:

1. **Farbpalette:** Cobalt Blue `#2563EB` für primäre Akzente und Fortschrittsanzeigen. Deep Anthracite `#0F172A` für den Hintergrund. Slate-Grey für sekundäre Texte (`#94A3B8`).  
2. **Typografie:** "Inter" für Überschriften und Fließtext. "JetBrains Mono" für Datenströme, Logs oder die Transkription, um den Software-Charakter zu betonen.
3. **Pulsierender Vapi-Kreis:** Die Visualisierung der KI-Aktivität soll nicht durch eine langweilige Audio-Waveform erfolgen, sondern durch einen atmenden/pulsierenden Kreis (Spring-Physik), der sich an den Rhythmus eines virtuellen Gesprächs anpasst.
4. **3-Tier Matching Engine:** Diese Architektur-Leistung muss optisch hervorstechen. In der Remotion-Komponente ist das ein Dreischritt-Prozess (Analyse -> Extraktion -> Ausführung), der nach und nach aufleuchtet (`#2563EB`), sobald die KI das Transkript "verstanden" hat.
5. **Animation Setup:** Keine harten Schnitte. Alle Werte (Opacity, Scale, Y-Translate) müssen über `spring()` in Remotion animiert werden, analog zu `cubic-bezier(0.25, 0.46, 0.45, 0.94)` im Web-Design.

---
_Dieser Plan dient als direkte Arbeitsgrundlage für den Video-Render-Server (TikTok/Reels/LinkedIn Pipeline)._
