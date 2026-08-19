#!/usr/bin/env python3
"""Send BaseModul Wave 1 SHK Top 5 follow-ups after explicit Fatih-Go.

Safety:
- department=base-modul-outreach only
- Gmail sync + live Guard immediately before send
- only sends if replyStatus=no_reply, blockFollowup=false, nextAction=follow_up_due
- updates BaseModul lead store + InboxOutboundRecords + reports
- no Mission Control writes
"""
import datetime as dt
import html
import json
import os
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

BASE = pathlib.Path('/Users/user/Desktop/Projects/basemodul')
AGENTEQ = pathlib.Path('/Users/user/Desktop/Projects/AgenteqHQ')
OUTREACH_AGENT = pathlib.Path('/Users/user/Desktop/Projects/Outreach-Agent')

LEADS_PATH = BASE / 'outreach/data/leads.json'
INBOX_OUTBOUND_PATH = OUTREACH_AGENT / 'data/inbox-outbound.json'
REPORT_JSON_PATH = BASE / 'outreach/reports/wave-1-shk-followups-send-2026-07-07.json'
SEND_LOG_PATH = BASE / 'outreach/reports/WAVE_1_SHK_FOLLOWUPS_SEND_LOG_2026-07-07.md'

DEPARTMENT = 'base-modul-outreach'
CAMPAIGN_ID = 'bm-wave-1-shk-followups-2026-07-07'
CAMPAIGN_NAME = 'BaseModul Wave 1 — SHK Follow-ups 2026-07-07'
APPROVED_PHRASE = 'ja los, GO!'
GUARD_BASE = 'http://localhost:4550/api/outreach-status'
GMAIL_SYNC_URL = 'http://localhost:4550/api/gmail/sync'

TARGETS = [
    {
        'lead_id': 'bm-w1-004',
        'company_name': 'Hühnchen Heiztechnik GmbH',
        'email': 'info@heiztechnik-gmbh.de',
        'subject': 'Re: Kurze Frage zu Ihrem 365-Tage-Notdienst',
        'body': '''Guten Tag,

ich wollte meine Frage kurz nach vorne holen.

Mir ging es konkret um die Erstaufnahme bei Störungen: Adresse, Anlage, Problem, Rückrufnummer und Dringlichkeit sauber erfassen, bevor jemand aus dem Team zurückruft.

Gerade bei einem 365-Tage-Notdienst könnte so eine strukturierte Rückrufnotiz helfen, unnötige Rückfragen zu vermeiden.

Wäre ein kurzer 20-Minuten-Blick auf diesen Ablauf grundsätzlich interessant?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-006',
        'company_name': 'allwartung GmbH',
        'email': 'info@allwartung.de',
        'subject': 'Re: Kurze Frage zu Kundendienst und Notdienst',
        'body': '''Guten Tag,

kurzer Nachtrag zu meiner Mail.

Bei Kundendienst- und Notdienstanfragen über mehrere Gewerke ist aus meiner Sicht oft der erste Schritt entscheidend: Problem, Anlage, Standort und Dringlichkeit vollständig aufnehmen und sauber ans Team geben.

BaseModul kann genau diesen Schritt als schlanken Intake abbilden — ohne großes Systemprojekt.

Wäre ein kurzer Prozess-Check dazu interessant?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-012',
        'company_name': 'J. Baumgartner GmbH',
        'email': 'info@j-baumgartner.de',
        'subject': 'Re: Telefon, Formular und WhatsApp — kurze Frage',
        'body': '''Guten Tag,

ich wollte hierzu kurz nachfassen.

Bei Telefon, Formular und WhatsApp geht es mir nicht um einen weiteren Kanal, sondern um eine einheitliche Übergabe: Anliegen, Kontaktdaten, Fotos/Details und Dringlichkeit direkt so erfassen, dass das Team damit arbeiten kann.

Wäre es sinnvoll, sich einmal kurz anzuschauen, ob dadurch Rückfragen oder doppelte Nachrichten reduziert werden können?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-003',
        'company_name': 'Achatz Wärmetechnik GmbH',
        'email': 'info@achatz-heizung.de',
        'subject': 'Re: Kurze Frage zu Notdienst-Anfragen',
        'body': '''Guten Tag,

ich wollte meine Frage kurz nach vorne holen.

Bei Notdienst, normalen Heizungsanfragen und technischen Fragen ist wahrscheinlich schon vor dem Rückruf wichtig: Was ist dringend, welche Anlage ist betroffen, welche Adresse und Rückrufnummer gehören dazu?

BaseModul kann solche Pflichtinfos strukturiert einsammeln und als klare Rückrufnotiz ans Team übergeben.

Wäre das für Ihren Ablauf grundsätzlich relevant?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-005',
        'company_name': 'Herrlinger Dienstleistungen',
        'email': 'info@herrlinger.eu',
        'subject': 'Re: SOS-Notdienst — kurze Frage zur Erstaufnahme',
        'body': '''Guten Tag,

kurzer Nachtrag zu meiner Frage zum SOS-Notdienst.

Wenn spontan ein Sanitärproblem reinkommt, fehlen vor dem Rückruf oft genau die Basics: Ort, Problem, Rückrufnummer und Dringlichkeit.

Ein kleiner Intake-Flow könnte diese Infos vorab sammeln und als saubere Notiz ans Team übergeben.

Wäre ein kurzer Blick darauf interessant?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
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
    return '<!doctype html><html lang="de"><body><div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#111827">' + html.escape(text).replace('\n', '<br>') + '</div></body></html>'


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
    return http_json(method, f'https://api.resend.com{path}', headers={
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'User-Agent': 'Hermes-BaseModul/1.0',
    }, payload=payload, timeout=75)


def gmail_sync():
    res = http_json('POST', GMAIL_SYNC_URL, timeout=120)
    if not res.get('ok') or not isinstance(res.get('json'), dict) or res['json'].get('ok') is not True:
        raise RuntimeError('gmail_sync_failed:' + str(res)[:500])
    return res['json']


def check_guard_due(email: str):
    url = GUARD_BASE + '?department=' + urllib.parse.quote(DEPARTMENT) + '&email=' + urllib.parse.quote(email)
    res = http_json('GET', url, timeout=20)
    if not res.get('ok') or not isinstance(res.get('json'), dict) or res['json'].get('ok') is not True:
        raise RuntimeError('guard_not_ok:' + email + ':' + str(res)[:500])
    statuses = [s for s in (res['json'].get('statuses') or []) if s.get('department') == DEPARTMENT]
    if len(statuses) != 1:
        raise RuntimeError(f'guard_expected_one_status:{email}:count={len(statuses)}')
    s = statuses[0]
    if s.get('blockFollowup') is True:
        raise RuntimeError('guard_blockFollowup:' + email + ':' + json.dumps(s, ensure_ascii=False)[:800])
    if s.get('replyStatus') != 'no_reply' or s.get('nextAction') != 'follow_up_due':
        raise RuntimeError('guard_not_due:' + email + ':' + json.dumps(s, ensure_ascii=False)[:800])
    return {'syncedAt': res['json'].get('syncedAt'), 'status': s}


def check_guard_any(email: str):
    url = GUARD_BASE + '?department=' + urllib.parse.quote(DEPARTMENT) + '&email=' + urllib.parse.quote(email)
    res = http_json('GET', url, timeout=20)
    if not res.get('ok') or not isinstance(res.get('json'), dict):
        return {'ok': False, 'error': str(res)[:500]}
    return res['json']


def verify_domain(key: str):
    res = resend_request('GET', '/domains', key)
    domains = []
    if res.get('ok') and isinstance(res.get('json'), dict):
        for d in res['json'].get('data', []) or []:
            domains.append({'name': d.get('name'), 'status': d.get('status')})
    return {'ok': res.get('ok'), 'agenteq_de_verified': any(d.get('name') == 'agenteq.de' and str(d.get('status')).lower() in ('verified', 'success') for d in domains), 'domains': domains}


def load_inbox_doc():
    if INBOX_OUTBOUND_PATH.exists():
        data = json.loads(INBOX_OUTBOUND_PATH.read_text())
    else:
        data = {'exportedAt': None, 'records': []}
    data.setdefault('records', [])
    return data


def append_inbox(records):
    data = load_inbox_doc()
    existing = {r.get('id') for r in data['records']}
    for r in records:
        if r['id'] in existing:
            raise RuntimeError('duplicate_inbox_record:' + r['id'])
    data['records'].extend(records)
    data['exportedAt'] = dt.datetime.now(dt.timezone.utc).isoformat()
    INBOX_OUTBOUND_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def get_resend_detail(key: str, mid: str):
    d = resend_request('GET', f'/emails/{mid}', key)
    if d.get('ok') and isinstance(d.get('json'), dict):
        j = d['json']
        return {k: j.get(k) for k in ['id', 'from', 'to', 'subject', 'created_at', 'last_event'] if k in j}
    return {'id': mid, 'last_event': 'unknown', 'detail_error': d}


def main():
    load_env()
    now_local = dt.datetime.now().astimezone()
    weekday = now_local.strftime('%A')
    if weekday == 'Sunday':
        raise SystemExit('blocked_sunday')
    if weekday == 'Saturday':
        raise SystemExit('blocked_saturday')

    key = (os.getenv('AGENTEQ_RESEND_API_KEY') or '').strip()
    from_addr = (os.getenv('AGENTEQ_RESEND_FROM') or '').strip()
    reply_to = (os.getenv('AGENTEQ_REPLY_TO') or '').strip()
    if not key or not from_addr or not reply_to:
        raise SystemExit('missing AGENTEQ_RESEND_API_KEY / AGENTEQ_RESEND_FROM / AGENTEQ_REPLY_TO')

    sync_before = gmail_sync()
    guard_results = {t['email']: check_guard_due(t['email']) for t in TARGETS}
    domain_check = verify_domain(key)
    if not domain_check.get('agenteq_de_verified'):
        raise SystemExit('agenteq_domain_not_verified')

    leads_doc = json.loads(LEADS_PATH.read_text())
    leads = leads_doc.get('leads', [])
    by_id = {l.get('id'): l for l in leads}

    results = []
    inbox_records = []
    for t in TARGETS:
        lead = by_id.get(t['lead_id'])
        item = {'lead_id': t['lead_id'], 'company_name': t['company_name'], 'recipient_email': t['email'], 'subject': t['subject'], 'attempted': False, 'sent': False}
        try:
            if not lead:
                raise RuntimeError('lead_not_found')
            if lead.get('current_department') != DEPARTMENT or lead.get('target_department') != DEPARTMENT:
                raise RuntimeError('wrong_department')
            if lead.get('contact_email') != t['email']:
                raise RuntimeError('email_changed:' + str(lead.get('contact_email')))
            if int(lead.get('followup_count') or 0) >= 1 or lead.get('followup_resend_message_id'):
                raise RuntimeError('followup_already_sent_evidence')

            payload = {'from': from_addr, 'to': [t['email']], 'subject': t['subject'], 'html': html_body(t['body']), 'text': t['body'], 'reply_to': reply_to}
            item['attempted'] = True
            send = resend_request('POST', '/emails', key, payload)
            if not (send.get('ok') and isinstance(send.get('json'), dict) and send['json'].get('id')):
                item['send_response'] = send
                raise RuntimeError('resend_failed')
            mid = send['json']['id']
            sent_now = dt.datetime.now(dt.timezone.utc)

            lead.update({
                'status': 'sent',
                'send_status': 'sent',
                'last_followup_at': sent_now.isoformat(),
                'last_contacted_at': sent_now.isoformat(),
                'followup_count': int(lead.get('followup_count') or 0) + 1,
                'next_followup_at': None,
                'followup_subject_sent': t['subject'],
                'followup_pitch_sent': t['body'],
                'followup_resend_message_id': mid,
                'followup_campaign_id': CAMPAIGN_ID,
                'followup_campaign_name': CAMPAIGN_NAME,
                'updated_at': sent_now.isoformat(),
                'error_message': None,
            })

            inbox_records.append({
                'id': f'outbound_{DEPARTMENT}_{t["lead_id"]}_{mid}',
                'source': 'hermes-agent',
                'department': DEPARTMENT,
                'campaignId': CAMPAIGN_ID,
                'campaignName': CAMPAIGN_NAME,
                'leadId': t['lead_id'],
                'leadEmail': t['email'],
                'companyName': t['company_name'],
                'fromEmail': from_addr,
                'replyToEmail': reply_to,
                'subject': t['subject'],
                'provider': 'resend',
                'providerMessageId': mid,
                'resendMessageId': mid,
                'sentAt': sent_now.isoformat(),
                'nextFollowupAt': None,
                'status': 'sent',
                'tags': ['basemodul', DEPARTMENT, 'wave-1', 'shk-follow-up'],
                'metadata': {'eventKind': 'follow_up', 'campaign': 'basemodul-wave-1-shk', 'run': CAMPAIGN_ID, 'approvedBy': 'Fatih', 'approvedPhrase': APPROVED_PHRASE, 'guard': guard_results[t['email']], 'legalNamingCheck': 'No GmbH/legal-entity wording for AGENTEQ/BaseModul/Callfolio; neutral brand names only.'},
            })
            item.update({'sent': True, 'provider': 'resend', 'provider_message_id': mid, 'sent_at_utc': sent_now.isoformat()})
        except Exception as e:
            item['error'] = str(e)
        results.append(item)

    if any(not r.get('sent') for r in results):
        raise SystemExit(json.dumps({'error': 'partial_or_failed_send', 'results': results}, ensure_ascii=False, indent=2))

    time.sleep(3)
    for r in results:
        r['resend_detail'] = get_resend_detail(key, r['provider_message_id'])

    LEADS_PATH.write_text(json.dumps(leads_doc, ensure_ascii=False, indent=2) + '\n')
    append_inbox(inbox_records)

    sync_after = gmail_sync()
    post_guard = {t['email']: check_guard_any(t['email']) for t in TARGETS}

    report = {
        'run': CAMPAIGN_ID,
        'department': DEPARTMENT,
        'approved_phrase': APPROVED_PHRASE,
        'sent_at_utc': dt.datetime.now(dt.timezone.utc).isoformat(),
        'send_timing_check': {'weekday': weekday, 'policy': 'allowed', 'guard_checked': True, 'fatih_go_present': True, 'result': 'send_allowed'},
        'sync_before': sync_before,
        'sync_after': sync_after,
        'sender': from_addr,
        'reply_to': reply_to,
        'sender_domain_check': domain_check,
        'guard_results': guard_results,
        'post_send_guard': post_guard,
        'results': results,
        'inbox_outbound_records_written': len(inbox_records),
    }
    REPORT_JSON_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')

    lines = [
        '# BaseModul Wave 1 SHK Follow-ups — Send Log 2026-07-07', '',
        'Scope: 5 freigegebene BaseModul Follow-ups. Kein Auto-Follow-up.', '',
        '## Send Timing Check', '',
        f'- heutiger Tag: {weekday}', '- Policy: allowed', '- Guard geprüft: yes', f'- Fatih-Go vorhanden: yes — „{APPROVED_PHRASE}“', '- Ergebnis: send_allowed', '',
        '## Guardrails', '', f'- Department: `{DEPARTMENT}`', '- Gmail Sync + Live-Guard pro Empfänger direkt vor Versand geprüft.', '- Nur `nextAction=follow_up_due` gesendet.', '- Legal Naming: keine GmbH-/Kapitalgesellschafts-Formulierung für AGENTEQ/BaseModul/Callfolio.', '- Replies manuell prüfen; kein weiterer Follow-up ohne neue Live-Guard-Prüfung und Freigabe.', '',
        '## Real Send', '', '| # | Lead | Recipient | Subject | Send Result | Resend ID | Last Event |', '|---:|---|---|---|---|---|---|'
    ]
    for i, r in enumerate(results, 1):
        d = r.get('resend_detail') or {}
        lines.append(f"| {i} | {r['company_name']} | `{r['recipient_email']}` | `{r['subject']}` | sent via Resend | `{r['provider_message_id']}` | `{d.get('last_event','unknown')}` |")
    lines += ['', '## Operational Notes', '', f'- Sender: `{from_addr}`', f'- Reply-To: `{reply_to}`', f'- JSON Report: `outreach/reports/{REPORT_JSON_PATH.name}`', '- Lead Store updated in `outreach/data/leads.json`.', '- InboxOutboundRecords exported with `department=base-modul-outreach`.', '- Keine Mission-Control-Pflicht / kein TODAY.md geschrieben.', '', '## Follow-up Rule', '', 'Kein weiterer Follow-up ohne menschlichen Inbox-Review, neue Live-Guard-Prüfung und Fatih-Go.', '']
    SEND_LOG_PATH.write_text('\n'.join(lines))

    print(json.dumps({
        'report': str(REPORT_JSON_PATH),
        'log': str(SEND_LOG_PATH),
        'attempted': sum(1 for r in results if r.get('attempted')),
        'sent_success': sum(1 for r in results if r.get('sent')),
        'errors': [{'company': r.get('company_name'), 'error': r.get('error')} for r in results if r.get('error')],
        'sent': [{'company': r.get('company_name'), 'email': r.get('recipient_email'), 'id': r.get('provider_message_id'), 'last_event': (r.get('resend_detail') or {}).get('last_event')} for r in results],
        'inbox_outbound_records_written': len(inbox_records),
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
