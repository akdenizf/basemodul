# Callfolio Admin User Guide (v5.4)

Willkommen bei Callfolio! Dieses Handbuch führt Sie durch die wichtigsten Funktionen Ihres neuen KI-gestützten Voice-Intake-Systems.

## 1. Das Ticket-Dashboard

Das Dashboard ist Ihre zentrale Anlaufstelle für alle eingehenden Anrufe und Anliegen.

### Ticket-Liste
- **Status-Filter**: Filtern Sie nach "Offen", "In Bearbeitung" oder "Erledigt".
- **Review-Modus**: Tickets, bei denen die KI sich unsicher war (z.B. unbekannter Mieter), werden speziell markiert.
- **Suche**: Suchen Sie nach Mieternamen, Adressen oder Stichworten im Anliegen.

### Ticket-Details
Klicken Sie auf ein Ticket, um die Details zu sehen:
- **KI-Zusammenfassung**: Eine kurze, prägnante Zusammenfassung des Anrufs.
- **Kategorisierung**: Automatische Einordnung (z.B. Heizung, Sanitär, Notfall).
- **Sentiment**: Einschätzung der Stimmung des Anrufers (z.B. "Besorgt", "Verärgert").
- **Mieter-Zuordnung**: Hier sehen Sie, ob der Anrufer automatisch erkannt wurde. Bei Unsicherheit können Sie den Mieter hier manuell bestätigen oder korrigieren.

---

## 2. Die Action Bridge (Email-Versand)

Die Action Bridge ermöglicht es Ihnen, mit nur zwei Klicks auf ein Ticket zu reagieren.

1. **Vorlage wählen**: Klicken Sie auf "Bestätigen & Senden" oder "Beauftragen".
2. **Vorschau & Editieren**: Ein Fenster öffnet sich mit einer vorformulierten Email (z.B. an den Mieter oder einen Handwerker). Sie können den Text bei Bedarf anpassen.
3. **Senden**: Mit einem Klick wird die Email über das System versendet.
4. **Status-Update**: Das System fragt Sie optional, ob der Ticket-Status automatisch auf "In Bearbeitung" gesetzt werden soll.

---

## 3. Mieterstamm & CSV-Import

Damit Callfolio Ihre Mieter erkennt, müssen diese im System hinterlegt sein.

### Manueller Import (Wizard)
1. Gehen Sie zum Bereich **Mieterstamm**.
2. Klicken Sie auf **Importieren**.
3. Laden Sie eine CSV-Datei hoch. Die Datei sollte folgende Spalten enthalten: `name`, `address`, `unit`, `phone`, `email`.
4. **Vorschau**: Das System zeigt Ihnen an, welche Mieter neu angelegt werden und wo es eventuell Konflikte gibt.
5. **Bestätigen**: Erst nach Ihrer Bestätigung werden die Daten final gespeichert.

---

## 4. Einstellungen

Im Bereich **Einstellungen** können Sie:
- Die **Benachrichtigungs-Email** ändern, an die neue Tickets standardmäßig gesendet werden.
- Den Namen Ihrer Hausverwaltung anpassen.
- Ihr Passwort ändern.

---

## 5. Best Practices für die Arbeit mit Callfolio

- **Regelmäßiger Check**: Prüfen Sie das Dashboard mehrmals täglich, besonders auf Tickets mit dem Status "Review erforderlich".
- **Datenqualität**: Je sauberer Ihre Mieterdaten (besonders Telefonnummern im Format +49...) sind, desto besser funktioniert die automatische Erkennung.
- **Action Bridge nutzen**: Verwenden Sie die Email-Vorlagen, um Zeit bei der Kommunikation mit Mietern und Dienstleistern zu sparen.

---

## 6. Visual Context – Fotos von Mietern

Bei bestimmten Schadensarten (z.B. Sanitär, Wasserschaden, Heizung) sendet Callfolio automatisch eine SMS an den Anrufer mit einem Link zum Foto-Upload.

### So funktioniert es
1. **Automatischer Versand:** Nach dem Anruf erhält der Mieter eine SMS mit einem Link.
2. **Einfacher Upload:** Der Mieter öffnet den Link auf seinem Smartphone und lädt ein oder mehrere Fotos hoch.
3. **Anzeige im Dashboard:** Die Fotos erscheinen in der Ticket-Detailansicht unter "Fotos" und können in einer Lightbox vergrößert werden.

### Hinweise
- Der Upload-Link ist ticket-spezifisch und erfordert keine Anmeldung.
- Fotos helfen bei der schnelleren Bearbeitung und Dokumentation von Schäden.

