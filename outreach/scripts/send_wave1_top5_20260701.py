#!/usr/bin/env python3
"""Send BaseModul Wave 1 Top 5 via Resend after explicit Fatih-Go.

Safety:
- BaseModul only (`department=base-modul-outreach`)
- live Guard check per recipient immediately before send
- blocks if Guard has block/reply/bounce/uncertain
- updates local lead store + inbox outbound records + send logs after real sends
"""

import datetime as dt
import html
import json
import os
import pathlib
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = pathlib.Path('/Users/user/Desktop/Projects/basemodul')
AGENTEQ = pathlib.Path('/Users/user/Desktop/Projects/AgenteqHQ')
OUTREACH_AGENT = pathlib.Path('/Users/user/Desktop/Projects/Outreach-Agent')

LEADS_PATH = BASE / 'outreach/data/leads.json'
INBOX_OUTBOUND_PATH = OUTREACH_AGENT / 'data/inbox-outbound.json'
REPORT_JSON_PATH = BASE / 'outreach/reports/wave-1-top5-send-2026-07-01.json'
SEND_LOG_PATH = BASE / 'outreach/reports/WAVE_1_TOP5_SEND_LOG_2026-07-01.md'
MISSION_TODAY_PATH = BASE / 'mission-control/TODAY.md'

DEPARTMENT = 'base-modul-outreach'
CAMPAIGN_ID = 'bm-wave-1-shk-munich-top5-2026-07-01'
CAMPAIGN_NAME = 'BaseModul Wave 1 — SHK München Top 5'
APPROVED_PHRASE = 'alles klar leg einfach los Bro.'
GUARD_BASE = 'http://localhost:4550/api/outreach-status'

TARGETS = [
    {
        'lead_id': 'bm-w1-004',
        'company_name': 'Hühnchen Heiztechnik GmbH',
        'email': 'info@heiztechnik-gmbh.de',
        'subject': 'Kurze Frage zu Ihrem 365-Tage-Notdienst',
        'body': '''Guten Tag,

ich habe auf Ihrer Website gesehen, dass Hühnchen Heiztechnik Heizungswartung und Notdienst in München anbietet — inklusive 365-Tage-Notdienst.

Kurze Frage dazu: Wenn außerhalb der Bürozeiten jemand mit einer Heizungsstörung anruft, werden Adresse, Problem, Anlage und Rückrufnummer schon strukturiert erfasst — oder hängt das stark davon ab, wer gerade erreichbar ist?

Wir bauen mit BaseModul kleine digitale Assistenten für Servicebetriebe, die genau solche Anfragen annehmen und als saubere Rückrufnotiz ans Team übergeben.

Wäre ein 20-minütiger Blick darauf grundsätzlich interessant für Sie?

Beste Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-006',
        'company_name': 'allwartung GmbH',
        'email': 'info@allwartung.de',
        'subject': 'Kurze Frage zu Kundendienst und Notdienst',
        'body': '''Guten Tag,

ich habe gesehen, dass allwartung Kundendienst, Wartung und Notdienst rund um Haustechnik in München anbietet — mit mehreren Gewerken von Heizung bis Klima/Lüftung.

Mich würde interessieren: Kommen Service- und Notdienstanfragen bei Ihnen schon mit allen Pflichtinfos rein, oder muss das Team oft nach Problem, Anlage, Standort und Dringlichkeit nachfassen?

Mit BaseModul bauen wir kleine digitale Intake-Module für genau diesen Erstkontakt: Anfrage entgegennehmen, Pflichtinfos abfragen, Priorität klären und sauber ans Team übergeben.

Wäre das als kurzer Prozess-Check interessant?

Beste Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-012',
        'company_name': 'J. Baumgartner GmbH',
        'email': 'info@j-baumgartner.de',
        'subject': 'Telefon, Formular und WhatsApp — kurze Frage',
        'body': '''Guten Tag,

ich habe auf Ihrer Website gesehen, dass Kunden J. Baumgartner über Telefon, E-Mail, Kontaktformular und WhatsApp erreichen können — zusätzlich mit Service & Notdienst.

Kurze Frage: Landen Anfragen aus diesen Kanälen intern schon einheitlich und vollständig beim Team, oder gibt es manchmal fehlende Infos, doppelte Nachrichten oder Rückfragen?

Mit BaseModul bauen wir kleine digitale Assistenten, die Kundenanfragen kanalübergreifend strukturieren: Anliegen, Kontaktdaten, Fotos/Details und Dringlichkeit — sauber als Übergabe fürs Team.

Wäre ein kurzer Blick auf so einen Ablauf interessant?

Beste Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-003',
        'company_name': 'Achatz Wärmetechnik GmbH',
        'email': 'info@achatz-heizung.de',
        'subject': 'Kurze Frage zu Notdienst-Anfragen',
        'body': '''Guten Tag,

auf Ihrer Website habe ich gesehen, dass Achatz Wärmetechnik auch Notdienst an Wochenenden und Feiertagen anbietet. Gleichzeitig gibt es verschiedene Anfragearten wie Heizung, Solar oder technische Fragen.

Meine Frage: Werden dringende Störungen und normale Anfragen bei Ihnen schon sauber getrennt, bevor jemand zurückruft?

Mit BaseModul bauen wir kleine Intake-Module für SHK-Betriebe: Der Assistent nimmt Anfragen entgegen, fragt Adresse, Problem, Anlage und Dringlichkeit ab und übergibt eine klare Rückrufnotiz ans Team.

Wäre das für Ihren Ablauf grundsätzlich relevant?

Beste Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-005',
        'company_name': 'Herrlinger Dienstleistungen',
        'email': 'info@herrlinger.eu',
        'subject': 'SOS-Notdienst — kurze Frage zur Erstaufnahme',
        'body': '''Guten Tag,

ich habe gesehen, dass Herrlinger Dienstleistungen einen SOS-Notdienst anbietet und zusätzlich Anfragen über das Kontaktformular annimmt.

Kurze Frage dazu: Wenn spontan jemand mit einem dringenden Sanitärproblem anruft, kommen Ort, Problem, Rückrufnummer und Dringlichkeit direkt vollständig an — oder muss man diese Infos oft erst im Rückruf sammeln?

Mit BaseModul bauen wir kleine digitale Assistenten für solche Servicefälle: Anruf oder Anfrage annehmen, Pflichtinfos abfragen und dem Team eine strukturierte Notiz übergeben.

Wäre das ein Thema, das Sie sich einmal kurz anschauen würden?

Beste Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
]


def load_dotenv_file(path: pathlib.Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(errors='ignore').splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        k, v = line.split('=', 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def load_env() -> None:
    for path in [BASE / '.env', BASE / '.env.local', AGENTEQ / '.env', AGENTEQ / '.env.local']:
        load_dotenv_file(path)


def html_body(text: str) -> str:
    return (
        '<!doctype html><html lang="de"><body>'
        '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#111827">'
        + html.escape(text).replace('\n', '<br>')
        + '</div></body></html>'
    )


def http_json(method: str, url: str, headers=None, payload=None, timeout=30):
    data = json.dumps(payload).encode('utf-8') if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read().decode('utf-8', errors='replace')
            return {'ok': True, 'status': r.status, 'json': json.loads(raw) if raw else None, 'text': raw}
    except urllib.error.HTTPError as e:
        return {'ok': False, 'status': e.code, 'text': e.read().decode(errors='ignore')}
    except Exception as e:
        return {'ok': False, 'status': None, 'text': repr(e)}


def resend_request(method: str, path: str, key: str, payload=None):
    return http_json(
        method,
        f'https://api.resend.com{path}',
        headers={
            'Authorization': 'Bearer ' + key,
            'Content-Type': 'application/json',
            'User-Agent': 'Hermes-BaseModul/1.0',
        },
        payload=payload,
        timeout=75,
    )


def check_guard(email: str):
    url = GUARD_BASE + '?department=' + urllib.parse.quote(DEPARTMENT) + '&email=' + urllib.parse.quote(email)
    res = http_json('GET', url, timeout=10)
    if not res.get('ok') or not isinstance(res.get('json'), dict) or res['json'].get('ok') is not True:
        err_text = str(res.get('text') or '')[:300]
        raise RuntimeError(f'guard_unavailable_or_not_ok:{email}:{res.get("status")}:{err_text}')
    statuses = [s for s in (res['json'].get('statuses') or []) if s.get('department') == DEPARTMENT]
    blockers = []
    for s in statuses:
        if s.get('blockFollowup') is True:
            blockers.append({'reason': 'blockFollowup', 'status': s})
        if s.get('replyStatus') in ('replied', 'bounce', 'out_of_office', 'uncertain'):
            blockers.append({'reason': 'replyStatus:' + str(s.get('replyStatus')), 'status': s})
    if blockers:
        raise RuntimeError(f'guard_blocked:{email}:{json.dumps(blockers, ensure_ascii=False)[:1000]}')
    return {'ok': True, 'count': len(statuses), 'syncedAt': res['json'].get('syncedAt')}


def verify_domain(key: str):
    res = resend_request('GET', '/domains', key)
    domains = []
    if res.get('ok') and isinstance(res.get('json'), dict):
        for d in res['json'].get('data', []) or []:
            domains.append({'name': d.get('name'), 'status': d.get('status')})
    verified = any(d.get('name') == 'agenteq.de' and str(d.get('status')).lower() in ('verified', 'success') for d in domains)
    return {'ok': res.get('ok'), 'agenteq_de_verified': verified, 'domains': domains}


def load_records():
    if INBOX_OUTBOUND_PATH.exists():
        data = json.loads(INBOX_OUTBOUND_PATH.read_text())
    else:
        data = {'exportedAt': None, 'records': []}
    data.setdefault('records', [])
    return data


def append_inbox_records(records):
    data = load_records()
    existing_ids = {r.get('id') for r in data['records']}
    existing_pairs = {(r.get('department'), r.get('leadId'), r.get('campaignId')) for r in data['records']}
    for r in records:
        if r['id'] in existing_ids or (r['department'], r['leadId'], r['campaignId']) in existing_pairs:
            raise RuntimeError(f'inbox_outbound_duplicate:{r["leadId"]}')
    data['records'].extend(records)
    data['exportedAt'] = dt.datetime.now(dt.timezone.utc).isoformat()
    INBOX_OUTBOUND_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def main():
    load_env()
    now_local = dt.datetime.now().astimezone()
    weekday = now_local.strftime('%A')
    if weekday == 'Sunday':
        raise SystemExit('send_blocked_sunday')
    if weekday == 'Saturday':
        raise SystemExit('send_blocked_saturday_requires_specific_exception')

    key = (os.getenv('AGENTEQ_RESEND_API_KEY') or '').strip()
    from_addr = (os.getenv('AGENTEQ_RESEND_FROM') or '').strip()
    reply_to = (os.getenv('AGENTEQ_REPLY_TO') or '').strip()
    if not key or not from_addr or not reply_to:
        raise SystemExit('missing AGENTEQ_RESEND_API_KEY / AGENTEQ_RESEND_FROM / AGENTEQ_REPLY_TO')

    leads_doc = json.loads(LEADS_PATH.read_text())
    leads = leads_doc.get('leads', [])
    by_id = {l.get('id'): l for l in leads}

    # Guard and duplicate precheck immediately before any send.
    guard_results = {}
    for target in TARGETS:
        lead = by_id.get(target['lead_id'])
        if not lead:
            raise SystemExit(f'lead_not_found:{target["lead_id"]}')
        if lead.get('current_department') != DEPARTMENT or lead.get('target_department') != DEPARTMENT:
            raise SystemExit(f'wrong_department:{target["lead_id"]}')
        if lead.get('send_status') == 'sent' or lead.get('sent_at') or lead.get('resend_message_id'):
            raise SystemExit(f'already_sent_evidence:{target["lead_id"]}')
        if lead.get('contact_email') != target['email']:
            raise SystemExit(f'email_changed:{target["lead_id"]}:{lead.get("contact_email")}')
        guard_results[target['email']] = check_guard(target['email'])

    domain_check = verify_domain(key)
    if not domain_check.get('agenteq_de_verified'):
        raise SystemExit('agenteq_domain_not_verified')

    results = []
    inbox_records = []
    for target in TARGETS:
        item = {
            'lead_id': target['lead_id'],
            'company_name': target['company_name'],
            'recipient_email': target['email'],
            'subject': target['subject'],
            'attempted': False,
            'sent': False,
        }
        try:
            payload = {
                'from': from_addr,
                'to': [target['email']],
                'subject': target['subject'],
                'html': html_body(target['body']),
                'text': target['body'],
                'reply_to': reply_to,
            }
            item['attempted'] = True
            send = resend_request('POST', '/emails', key, payload)
            if not (send.get('ok') and isinstance(send.get('json'), dict) and send['json'].get('id')):
                item['send_response'] = send
                raise RuntimeError('resend_failed')

            message_id = send['json']['id']
            sent_now = dt.datetime.now(dt.timezone.utc)
            next_followup = sent_now + dt.timedelta(days=5)

            lead = by_id[target['lead_id']]
            lead.update({
                'status': 'sent',
                'send_status': 'sent',
                'sent_at': sent_now.isoformat(),
                'last_contacted_at': sent_now.isoformat(),
                'followup_count': 0,
                'next_followup_at': next_followup.isoformat(),
                'subject_sent': target['subject'],
                'pitch_sent': target['body'],
                'resend_message_id': message_id,
                'campaign_id': CAMPAIGN_ID,
                'campaign_name': CAMPAIGN_NAME,
                'approved_by': 'Fatih',
                'approved_phrase': APPROVED_PHRASE,
                'error_message': None,
                'updated_at': sent_now.isoformat(),
            })

            detail = resend_request('GET', f'/emails/{message_id}', key)
            detail_public = None
            if detail.get('ok') and isinstance(detail.get('json'), dict):
                d = detail['json']
                detail_public = {k: d.get(k) for k in ['id', 'from', 'to', 'subject', 'created_at', 'last_event'] if k in d}

            inbox_records.append({
                'id': f'outbound_{DEPARTMENT}_{target["lead_id"]}_{message_id}',
                'source': 'hermes-agent',
                'department': DEPARTMENT,
                'campaignId': CAMPAIGN_ID,
                'campaignName': CAMPAIGN_NAME,
                'leadId': target['lead_id'],
                'leadEmail': target['email'],
                'companyName': target['company_name'],
                'fromEmail': from_addr,
                'replyToEmail': reply_to,
                'subject': target['subject'],
                'provider': 'resend',
                'providerMessageId': message_id,
                'resendMessageId': message_id,
                'sentAt': sent_now.isoformat(),
                'nextFollowupAt': next_followup.isoformat(),
                'status': 'sent',
                'tags': ['basemodul', DEPARTMENT, 'wave-1', 'shk-munich'],
                'metadata': {
                    'eventKind': 'first_outreach',
                    'campaign': 'basemodul-wave-1-shk-munich',
                    'run': CAMPAIGN_ID,
                    'approvedBy': 'Fatih',
                    'approvedPhrase': APPROVED_PHRASE,
                    'guard': guard_results.get(target['email']),
                },
            })

            item.update({
                'sent': True,
                'provider': 'resend',
                'provider_message_id': message_id,
                'sent_at_utc': sent_now.isoformat(),
                'next_followup_at': next_followup.isoformat(),
                'resend_detail': detail_public,
            })
        except Exception as e:
            item['error'] = str(e)
        results.append(item)

    # Persist successful side effects.
    LEADS_PATH.write_text(json.dumps(leads_doc, ensure_ascii=False, indent=2) + '\n')
    append_inbox_records(inbox_records)

    report = {
        'run': CAMPAIGN_ID,
        'department': DEPARTMENT,
        'approved_phrase': APPROVED_PHRASE,
        'sent_at_utc': dt.datetime.now(dt.timezone.utc).isoformat(),
        'send_timing_check': {
            'weekday': weekday,
            'policy': 'allowed',
            'guard_checked': True,
            'fatih_go_present': True,
            'result': 'send_allowed',
        },
        'sender': from_addr,
        'reply_to': reply_to,
        'sender_domain_check': domain_check,
        'guard_results': guard_results,
        'results': results,
        'inbox_outbound_records_written': len(inbox_records),
    }
    REPORT_JSON_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')

    lines = [
        '# BaseModul Wave 1 Top 5 — Send Log 2026-07-01',
        '',
        'Scope: 5 freigegebene BaseModul First-Touch-Mails. Kein Auto-Follow-up.',
        '',
        '## Send Timing Check',
        '',
        f'- heutiger Tag: {weekday}',
        '- Policy: allowed',
        '- Guard geprüft: yes',
        '- Fatih-Go vorhanden: yes — „alles klar leg einfach los Bro.“',
        '- Ergebnis: send_allowed',
        '',
        '## Guardrails',
        '',
        f'- Department: `{DEPARTMENT}`',
        '- Live-Guard pro Empfänger direkt vor Versand geprüft.',
        '- Keine Guard-Blocker für diese fünf Empfänger.',
        '- Replies manuell prüfen; kein Follow-up ohne neue Live-Guard-Prüfung und Freigabe.',
        '',
        '## Real Send',
        '',
        '| # | Lead | Recipient | Subject | Send Result | Resend ID | Resend Last Event | Next Action |',
        '| ---: | --- | --- | --- | --- | --- | --- | --- |',
    ]
    for i, r in enumerate(results, 1):
        detail = r.get('resend_detail') or {}
        send_result = 'sent via Resend' if r.get('sent') else f"failed: {r.get('error')}"
        lines.append(
            f"| {i} | {r['company_name']} | `{r['recipient_email']}` | `{r['subject']}` | {send_result} | `{r.get('provider_message_id', '—')}` | `{detail.get('last_event', 'unknown')}` | Inbox manuell prüfen; kein Follow-up ohne neue Freigabe. |"
        )
    lines += [
        '',
        '## Operational Notes',
        '',
        f'- Sender: `{from_addr}`',
        f'- Reply-To: `{reply_to}`',
        f'- Report JSON: `{REPORT_JSON_PATH.relative_to(BASE)}`',
        f'- InboxOutboundRecords: `{INBOX_OUTBOUND_PATH}`',
        '- Local BaseModul lead store updated for successful sends: status/send_status/sent_at/resend_message_id/next_followup_at.',
        '',
        '## Follow-up Rule',
        '',
        'Frühestens nach menschlichem Review der Inbox und nur mit neuer Live-Guard-Prüfung. Kein Auto-Follow-up.',
        '',
    ]
    SEND_LOG_PATH.write_text('\n'.join(lines))

    MISSION_TODAY_PATH.parent.mkdir(parents=True, exist_ok=True)
    mission = [
        '# BaseModul Mission Control — TODAY',
        '',
        f'Updated: {dt.datetime.now().astimezone().isoformat()}',
        '',
        '## 2026-07-01',
        '',
        '- Wave 1 Top 5 First-Touch-Mails gesendet via Resend.',
        f'- Department: `{DEPARTMENT}`',
        f'- Campaign: `{CAMPAIGN_ID}`',
        f'- Send Log: `{SEND_LOG_PATH.relative_to(BASE)}`',
        '- Nächster Schritt: Inbox manuell prüfen; kein Follow-up ohne neue Live-Guard-Prüfung und Fatih-Go.',
        '',
    ]
    MISSION_TODAY_PATH.write_text('\n'.join(mission))

    summary = {
        'report': str(REPORT_JSON_PATH),
        'log': str(SEND_LOG_PATH),
        'mission': str(MISSION_TODAY_PATH),
        'attempted': sum(1 for r in results if r.get('attempted')),
        'sent_success': sum(1 for r in results if r.get('sent')),
        'errors': [{'company': r.get('company_name'), 'error': r.get('error')} for r in results if r.get('error')],
        'sent': [{'company': r.get('company_name'), 'email': r.get('recipient_email'), 'id': r.get('provider_message_id'), 'last_event': (r.get('resend_detail') or {}).get('last_event')} for r in results if r.get('sent')],
        'inbox_outbound_records_written': len(inbox_records),
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))

    if any(not r.get('sent') for r in results):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
