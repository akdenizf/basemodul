# Beispiel-Rückrufnotiz: Heizungsstörung

**Asset:** BaseModul Beispiel für SHK-/Notdienst-Follow-ups  
**Datum:** 2026-07-14  
**Status:** Outreach-Asset / Preview-Baustein — kein Kundendokument, kein Versandprotokoll

## Kurz gesagt

BaseModul nimmt eine Service- oder Notdienstanfrage entgegen, fragt die wichtigsten Pflichtinfos ab und übergibt dem Team eine klare Rückrufnotiz.

## Beispiel: eingehender Anruf

> „Hallo, bei uns ist die Heizung ausgefallen. Warmwasser geht auch nicht richtig. Können Sie jemanden schicken?“

## Rückfragen, die BaseModul stellen würde

1. **Name und Rückrufnummer**
2. **Adresse / Einsatzort**
3. **Was genau funktioniert nicht?**
4. **Welche Anlage ist betroffen?** — z. B. Gastherme, Wärmepumpe, Heizkörper, Warmwasser
5. **Seit wann besteht das Problem?**
6. **Dringlichkeit** — kompletter Ausfall, kein Warmwasser, nur ein Raum, Geräusche, Leckage
7. **Fotos oder Zusatzinfos** — falls sinnvoll
8. **Wann ist ein Rückruf möglich?**

## Beispiel-Ausgabe fürs Team

```txt
RÜCKRUFNOTIZ — Heizungsstörung

Kunde: Max Mustermann
Telefon: 0176 12345678
Adresse: Beispielstraße 12, 81243 München

Anliegen:
- Heizung seit heute Morgen ausgefallen
- Warmwasser nur lauwarm
- Gastherme im Keller betroffen
- Keine sichtbare Leckage, keine Fehlermeldung genannt

Dringlichkeit:
- Hoch: kompletter Heizungsausfall + Warmwasserproblem
- Rückruf gewünscht: heute vor 14:00 Uhr

Fehlende Infos / Rückfrage:
- Hersteller/Modell der Anlage noch offen
- Foto vom Display wäre hilfreich

Empfohlene Übergabe:
- Kundendienst / Notdienst prüfen
- Rückruf mit Abfrage Hersteller + Fehlermeldung
```

## Warum das für Servicebetriebe relevant ist

- weniger unvollständige Rückrufzettel
- weniger Nachtelefonieren wegen Adresse, Anlage, Problem oder Dringlichkeit
- Notdienstfälle werden schneller erkennbar
- Team bekommt direkt eine strukturierte Übergabe statt einer losen Nachricht

## Kurzer Outreach-Baustein

```txt
Mir ging es nicht um ein großes System, sondern um den ersten Schritt:
Aus einem Anruf wie „Heizung ausgefallen“ automatisch eine vollständige Rückrufnotiz fürs Team machen.

Soll ich Ihnen einmal ein kurzes Beispiel schicken, wie so eine Notiz aussehen würde?
```

## Variante für Follow-up, wenn Beispiel direkt mitgeschickt wird

```txt
Hallo zusammen,

ich hänge Ihnen einmal ein kurzes Beispiel an, was ich mit strukturierter Rückrufnotiz meinte.

Aus einem Anruf wie „Heizung ausgefallen, Warmwasser geht nicht richtig“ würde BaseModul erst Name, Adresse, Anlage, Problem, Dringlichkeit und Rückrufzeit abfragen — und daraus eine klare Notiz fürs Team machen.

Wäre so eine Erstaufnahme für Ihre Service-/Notdienstanfragen grundsätzlich relevant?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de
```
