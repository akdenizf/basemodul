#!/usr/bin/env python3
"""Send BaseModul SHK/Kälte/Klima Mini-Batch after explicit Fatih-Go.

Safety:
- BaseModul only (`department=base-modul-outreach`)
- Gmail sync + live Guard per recipient immediately before send
- blocks on Guard errors/blockers
- local outbound dedupe before send
- updates BaseModul lead store + inbox outbound records + reports after real sends
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
REPORT_JSON_PATH = BASE / 'outreach/reports/wave-shk-kkl-minibatch-send-2026-07-13.json'
SEND_LOG_PATH = BASE / 'outreach/reports/WAVE_SHK_KKL_MINIBATCH_SEND_LOG_2026-07-13.md'

DEPARTMENT = 'base-modul-outreach'
CAMPAIGN_ID = 'bm-wave-shk-kkl-minibatch-2026-07-13'
CAMPAIGN_NAME = 'BaseModul SHK/Kälte/Klima Mini-Batch 2026-07-13'
APPROVED_PHRASE = 'Okay let\'s go / Ja mach das bitte'
GUARD_BASE = 'http://localhost:4550/api/outreach-status'
GMAIL_SYNC_URL = 'http://localhost:4550/api/gmail/sync'

TARGETS = [
    {
        'lead_id': 'bm-w1-002',
        'company_name': 'MH Münchner Heizungsbau GmbH / Heizungsbau Hirt',
        'email': 'info@muenchner-heizungsbau.de',
        'subject': 'Notdienst-Anfragen sauberer aufnehmen?',
        'body': '''Hallo zusammen,

ich habe gesehen, dass Sie Kundendienst, Wartung und Notdienst anbieten.

Bei Heizungsstörungen sind am Anfang oft Adresse, Anlage, Problem und Dringlichkeit entscheidend.

Wäre es für Sie interessant, einmal 20 Minuten zu prüfen, ob man genau diese Infos vor dem Rückruf automatisch sauber abfragen kann?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-011',
        'company_name': 'Anton Ostler GmbH & Co. KG',
        'email': 'info@anton-ostler.de',
        'subject': 'Kundendienst und Notdienst vorsortieren?',
        'body': '''Hallo zusammen,

bei Ihnen sind Kundendienst, Notdienst und Gewerbekunden-Wartung klar sichtbar.

Das sind unterschiedliche Anfragen, die am Telefon trotzdem oft erst einmal gleich reinkommen.

Wäre ein kurzer Check spannend, ob ein Telefon-Modul Dringlichkeit und Pflichtinfos vor dem Rückruf sauber erfassen könnte?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-014',
        'company_name': 'Lengauer GmbH Heizung + Sanitär',
        'email': 'info@lengauer.de',
        'subject': 'WhatsApp und Telefon sauber zusammenführen?',
        'body': '''Hallo zusammen,

ich habe gesehen, dass Sie neben Telefon und Formular auch WhatsApp als Kontaktweg anbieten.

Bei mehreren Kanälen wird die Übergabe ans Team schnell uneinheitlich.

Wäre es relevant, wenn daraus automatisch vollständige Rückruf- oder Terminnotizen entstehen?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-009',
        'company_name': 'Karl Greiner GmbH',
        'email': 'info@karl-greiner-gmbh.de',
        'subject': 'Anfragen direkt richtig einsortieren?',
        'body': '''Hallo zusammen,

Ihr Kontaktformular trennt bereits Angebot, Reparatur, Wartung und Rückfragen zu bestehenden Vorgängen.

Das zeigt gut, dass die Sortierung am Anfang wichtig ist.

Wäre es interessant, wenn ein Assistent diese Struktur auch am Telefon oder im Chat abfragt?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
    },
    {
        'lead_id': 'bm-w1-007',
        'company_name': 'Memminger Heizungsbau GmbH',
        'email': 'info@memminger-gmbh.de',
        'subject': 'Heizungsausfall oder Wartung direkt trennen?',
        'body': '''Hallo zusammen,

auf Ihrer Website sind sowohl Heizungsausfall als auch jährliche Wartung Thema.

Beides kommt oft über dieselben Kontaktwege rein, hat aber eine andere Dringlichkeit.

Wäre ein kurzer Check interessant, ob ein Telefon-Modul solche Anfragen vor dem Rückruf sauber trennen kann?

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


def gmail_sync():
    res = http_json('POST', GMAIL_SYNC_URL, timeout=120)
    if not res.get('ok') or not isinstance(res.get('json'), dict) or res['json'].get('ok') is not True:
        raise RuntimeError('gmail_sync_failed:' + str(res)[:500])
    return res['json']


def check_guard(email: str):
    url = GUARD_BASE + '?department=' + urllib.parse.quote(DEPARTMENT) + '&email=' + urllib.parse.quote(email)
    res = http_json('GET', url, timeout=20)
    if not res.get('ok') or not isinstance(res.get('json'), dict) or res['json'].get('ok') is not True:
        raise RuntimeError(f'guard_unavailable_or_not_ok:{email}:{res.get("status")}:{str(res.get("text"))[:300]}')
    statuses = [s for s in (res['json'].get('statuses') or []) if s.get('department') == DEPARTMENT]
    blockers = []
    for s in statuses:
        if s.get('blockFollowup') is True:
            blockers.append({'reason': 'blockFollowup', 'status': s})
        if s.get('replyStatus') in ('replied', 'bounce', 'out_of_office', 'uncertain'):
            blockers.append({'reason': 'replyStatus:' + str(s.get('replyStatus')), 'status': s})
    if blockers:
        raise RuntimeError(f'guard_blocked:{email}:{json.dumps(blockers, ensure_ascii=False)[:1000]}')
    return {'ok': True, 'count': len(statuses), 'syncedAt': res['json'].get('syncedAt'), 'statuses': statuses}


def verify_domain(key: str):
    res = resend_request('GET', '/domains', key)
    domains = []
    if res.get('ok') and isinstance(res.get('json'), dict):
        for d in res['json'].get('data', []) or []:
            domains.append({'name': d.get('name'), 'status': d.get('status')})
    verified = any(d.get('name') == 'agenteq.de' and str(d.get('status')).lower() in ('verified', 'success') for d in domains)
    return {'ok': res.get('ok'), 'agenteq_de_verified': verified, 'domains': domains}


def load_inbox_doc():
    if INBOX_OUTBOUND_PATH.exists():
        data = json.loads(INBOX_OUTBOUND_PATH.read_text())
    else:
        data = {'exportedAt': None, 'records': []}
    data.setdefault('records', [])
    return data


def dedupe_before_send(targets):
    data = load_inbox_doc()
    hits = []
    emails = {t['email'].lower() for t in targets}
    lead_ids = {t['lead_id'] for t in targets}
    for r in data.get('records', []):
        blob = json.dumps(r, ensure_ascii=False).lower()
        if r.get('department') == DEPARTMENT and (str(r.get('leadId')) in lead_ids or any(e in blob for e in emails)):
            hits.append({'id': r.get('id'), 'leadId': r.get('leadId'), 'leadEmail': r.get('leadEmail'), 'subject': r.get('subject')})
    if hits:
        raise RuntimeError('outbound_dedupe_hits:' + json.dumps(hits, ensure_ascii=False)[:1500])
    return {'checked': True, 'hits': 0}


def append_inbox_records(records):
    data = load_inbox_doc()
    existing_ids = {r.get('id') for r in data['records']}
    existing_pairs = {(r.get('department'), r.get('leadId'), r.get('campaignId')) for r in data['records']}
    for r in records:
        if r['id'] in existing_ids or (r['department'], r['leadId'], r['campaignId']) in existing_pairs:
            raise RuntimeError(f'inbox_outbound_duplicate:{r["leadId"]}')
    data['records'].extend(records)
    data['exportedAt'] = dt.datetime.now(dt.timezone.utc).isoformat()
    INBOX_OUTBOUND_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def get_last_event(key: str, message_id: str):
    detail = resend_request('GET', f'/emails/{message_id}', key)
    if detail.get('ok') and isinstance(detail.get('json'), dict):
        d = detail['json']
        return {k: d.get(k) for k in ['id', 'from', 'to', 'subject', 'created_at', 'last_event'] if k in d}
    return {'id': message_id, 'last_event': 'unknown', 'detail_error': detail}


def wait_for_delivery(key: str, message_ids):
    final = {}
    for _ in range(6):
        all_done = True
        for mid in message_ids:
            detail = get_last_event(key, mid)
            final[mid] = detail
            if detail.get('last_event') in (None, 'queued'):
                all_done = False
        if all_done:
            break
        time.sleep(5)
    return final


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

    sync_before = gmail_sync()

    leads_doc = json.loads(LEADS_PATH.read_text())
    leads = leads_doc.get('leads', []) if isinstance(leads_doc, dict) else leads_doc
    by_id = {l.get('id'): l for l in leads}

    dedupe = dedupe_before_send(TARGETS)

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
                'tags': ['basemodul', DEPARTMENT, 'shk-kkl', 'mini-batch'],
                'metadata': {
                    'eventKind': 'first_outreach',
                    'campaign': 'basemodul-shk-kkl-minibatch',
                    'run': CAMPAIGN_ID,
                    'approvedBy': 'Fatih',
                    'approvedPhrase': APPROVED_PHRASE,
                    'guard': guard_results.get(target['email']),
                    'legalNamingCheck': 'No GmbH/legal-entity wording for AGENTEQ/BaseModul/Callfolio; neutral brand names only.',
                },
            })

            item.update({
                'sent': True,
                'provider': 'resend',
                'provider_message_id': message_id,
                'sent_at_utc': sent_now.isoformat(),
                'next_followup_at': next_followup.isoformat(),
            })
        except Exception as e:
            item['error'] = str(e)
        results.append(item)

    if any(not r.get('sent') for r in results):
        raise SystemExit(json.dumps({'error': 'partial_or_failed_send', 'results': results}, ensure_ascii=False, indent=2))

    delivery_details = wait_for_delivery(key, [r['provider_message_id'] for r in results])
    for r in results:
        r['resend_detail'] = delivery_details.get(r['provider_message_id'])

    if isinstance(leads_doc, dict):
        leads_doc.setdefault('_meta', {})['last_updated'] = dt.datetime.now(dt.timezone.utc).date().isoformat()
        LEADS_PATH.write_text(json.dumps(leads_doc, ensure_ascii=False, indent=2) + '\n')
    else:
        LEADS_PATH.write_text(json.dumps(leads, ensure_ascii=False, indent=2) + '\n')
    append_inbox_records(inbox_records)

    sync_after = gmail_sync()
    post_guard = {t['email']: check_guard(t['email']) for t in TARGETS}

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
        'sync_before': sync_before,
        'sync_after': sync_after,
        'sender': from_addr,
        'reply_to': reply_to,
        'sender_domain_check': domain_check,
        'dedupe': dedupe,
        'guard_results': guard_results,
        'post_send_guard': post_guard,
        'results': results,
        'inbox_outbound_records_written': len(inbox_records),
    }
    REPORT_JSON_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')

    lines = [
        '# BaseModul SHK/Kälte/Klima Mini-Batch — Send Log 2026-07-13',
        '',
        'Scope: 5 freigegebene BaseModul First-Touch-Mails. Kein Auto-Follow-up.',
        '',
        '## Send Timing Check',
        '',
        f'- heutiger Tag: {weekday}',
        '- Policy: allowed',
        '- Guard geprüft: yes',
        f'- Fatih-Go vorhanden: yes — „{APPROVED_PHRASE}“',
        '- Ergebnis: send_allowed',
        '',
        '## Guardrails',
        '',
        f'- Department: `{DEPARTMENT}`',
        '- Gmail Sync + Live-Guard pro Empfänger direkt vor Versand geprüft.',
        '- Keine Guard-Blocker / Dedupe-Treffer für diese fünf Empfänger.',
        '- Legal Naming: keine GmbH-/Kapitalgesellschafts-Formulierung für AGENTEQ/BaseModul/Callfolio.',
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
        '- Keine Mission-Control-Pflicht / kein TODAY.md geschrieben.',
        '',
        '## Follow-up Rule',
        '',
        'Frühestens nach menschlichem Review der Inbox und nur mit neuer Live-Guard-Prüfung. Kein Auto-Follow-up.',
        '',
    ]
    SEND_LOG_PATH.write_text('\n'.join(lines))

    summary = {
        'report': str(REPORT_JSON_PATH),
        'log': str(SEND_LOG_PATH),
        'attempted': sum(1 for r in results if r.get('attempted')),
        'sent_success': sum(1 for r in results if r.get('sent')),
        'errors': [{'company': r.get('company_name'), 'error': r.get('error')} for r in results if r.get('error')],
        'sent': [{'company': r.get('company_name'), 'email': r.get('recipient_email'), 'id': r.get('provider_message_id'), 'last_event': (r.get('resend_detail') or {}).get('last_event')} for r in results if r.get('sent')],
        'inbox_outbound_records_written': len(inbox_records),
        'post_send_guard_counts': {email: val.get('count') for email, val in post_guard.items()},
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
