# BaseModule — Unterauftragsverarbeiterliste

> **Arbeitsentwurf vor Technik-, Vertrags- und Rechtsprüfung.** Diese Vorlage wird für jeden produktiven BaseModule-Pilot erst nach Abgleich mit der tatsächlichen Kanal-, Daten- und Integrationsarchitektur vervollständigt. Sie ist keine Zusage, dass ein bestimmter Dienst oder Standort in jedem Pilot eingesetzt wird.

| Scope-ID | `{{BM-PILOT-JJJJ-NNN}}` |
|---|---|
| Kanal | `{{Telefon / WhatsApp / Web / Foto-Datei}}` |
| Version / Stand | `{{Version, Datum}}` |
| Freigegeben durch Kunde | `{{Name, Datum}}` |
| Freigegeben durch BaseModule | `{{Name, Datum}}` |

## 1. Freigaberegel

Ein Dienst wird nur dann für den konkreten Pilot freigegeben, wenn die folgenden Punkte belegt und dokumentiert sind:

- tatsächlicher Einsatz im produktiven Pilot;
- vertragliche Rolle und geeignete Vertragsgrundlage;
- verarbeitete Datenkategorien und Zweck;
- tatsächlicher Verarbeitungs-/Speicherort und internationale Datenflüsse;
- relevante Unterauftragnehmer sowie technische/organisatorische Maßnahmen;
- notwendige Kundeninformation, Zustimmung oder Widerspruchsfrist gemäß dem gewählten AVV-Modell.

## 2. Freigegebene Dienste für diesen Pilot

| Dienst / Rolle | Vorgesehener Zweck | Datenkategorien | Produktionsnutzung bestätigt? | Vertrags-/Standortprüfung | Freigabe |
|---|---|---|---|---|---|
| `{{Dienst 1}}` | `{{z. B. Telefonie, Workflow, Datenbank, Messaging}}` | `{{}}` | `{{Ja / Nein}}` | `{{Vertrag, Region, Datenfluss, Subunternehmer}}` | `{{Freigabe / offen}}` |
| `{{Dienst 2}}` | `{{}}` | `{{}}` | `{{Ja / Nein}}` | `{{}}` | `{{Freigabe / offen}}` |
| `{{Dienst 3}}` | `{{}}` | `{{}}` | `{{Ja / Nein}}` | `{{}}` | `{{Freigabe / offen}}` |
| `{{Dienst 4}}` | `{{}}` | `{{}}` | `{{Ja / Nein}}` | `{{}}` | `{{Freigabe / offen}}` |

## 3. Kanalbezogene Prüfpunkte

| Kategorie | Regel |
|---|---|
| Telefonie-/Carrier-/Voice-Dienst | Vor Aktivierung Rolle, Datenfluss, Aufzeichnung/Transkript-Konfiguration, Speicherort und Vertrag prüfen. |
| Messaging-/SMS-/WhatsApp-Dienst | Vor Aktivierung Nutzungsgrundlage, Empfänger-/Opt-in-Regel, Datenfluss, Vertrag und Template-/Versandlogik prüfen. |
| Formular-/Website-Dienst | Vor Aktivierung Hosting, Speicherung, Zugriff, Spam-/Missbrauchsschutz und Übergabekanal prüfen. |
| Datei-/Foto-Upload | Vor Aktivierung Speicherort, Zugriff, Dateiregel, Zuordnung, Löschung und Empfänger prüfen. |
| CRM, Kalender, DMS oder Ticketsystem | Nur nach eigenem Integrationsscope, Zugriffskonzept und Datenschutz-/Vertragsprüfung freigeben. |
| Analytics, Monitoring oder Fehlertracking | Nur bei tatsächlicher Produktivnutzung mit Datenkategorie, Zugriff, Retention und Vertrag aufnehmen. |
| KI-Modell-/Inferenzdienst | Tatsächlichen Unterauftragnehmer und Datenfluss technisch ermitteln; nicht aus Marketingannahmen ableiten. |

## 4. Änderung und Information

| Frage | Vereinbarung für diesen Pilot |
|---|---|
| AVV-Modell | `{{spezifische Genehmigung / allgemeine Genehmigung mit Information und Widerspruchsrecht}}` |
| Informationsweg bei geplanter Änderung | `{{E-Mail / Kundenportal / Vertragsnachtrag}}` |
| Informationsfrist | `{{}}` |
| Kundenseitiger Ansprechpartner | `{{}}` |
| BaseModule-Verantwortung | `{{}}` |

Jede Änderung wird vor Produktivnutzung dokumentiert. Wenn ein erforderlicher Dienst nicht freigegeben ist, wird der betroffene Funktionsumfang nicht aktiviert.

## References

[1]: https://eur-lex.europa.eu/eli/reg/2016/679/oj "Verordnung (EU) 2016/679 / DSGVO, EUR-Lex"
[2]: https://commission.europa.eu/publications/standard-contractual-clauses-controllers-and-processors-eueea_en "Europäische Kommission — Standard Contractual Clauses for controllers and processors in the EU/EEA"
