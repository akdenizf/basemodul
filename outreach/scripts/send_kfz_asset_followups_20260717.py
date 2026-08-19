#!/usr/bin/env python3
"""Send BaseModul Kfz/Gutachter asset-style follow-ups after explicit Fatih-Go.

Safety:
- BaseModul only (`department=base-modul-outreach`)
- Gmail sync + live Guard per recipient immediately before send
- requires `nextAction=follow_up_due`, blocks replies/bounces/OOO/uncertain/blockFollowup
- campaign-level outbound dedupe before send
- updates BaseModul lead store (upsert if historical wave lead is missing) + inbox outbound records + reports after real sends
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
REPORT_JSON_PATH = BASE / 'outreach/reports/kfz-asset-followups-send-2026-07-17.json'
SEND_LOG_PATH = BASE / 'outreach/reports/KFZ_ASSET_FOLLOWUPS_SEND_LOG_2026-07-17.md'

DEPARTMENT = 'base-modul-outreach'
CAMPAIGN_ID = 'bm-kfz-asset-followups-2026-07-17'
CAMPAIGN_NAME = 'BaseModul Kfz Asset Follow-ups 2026-07-17'
APPROVED_PHRASE = 'ja bitte machen'
GUARD_BASE = 'http://localhost:4550/api/outreach-status'
GMAIL_SYNC_URL = 'http://localhost:4550/api/gmail/sync'

TARGETS = [
    {
        'lead_id': 'bm-w2-002',
        'company_name': 'Heidari Ingenieur-Sachverständigenbüro',
        'email': 'info@heidari-gutachten.de',
        'website': 'https://heidari-gutachten.de',
        'industry': 'Kfz-Sachverständige / Gutachten',
        'lead_score': 88,
        'subject': 'Re: Frage zu Schadenbildern und Gutachtenanfragen',
        'body': '''Hallo zusammen,

kurzer Nachtrag zu meiner Frage zu Gutachtenanfragen.

Mir ging es um den ersten Schritt vor Rückruf oder Termin: Schadenbilder, Fahrzeugdaten, Hergang, Kontaktdaten und Versicherungsinfos direkt vollständig einsammeln.

Soll ich Ihnen einmal ein kurzes Beispiel schicken, wie so ein strukturierter Gutachten-Fall aussehen würde?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
        'asset_offer': 'Beispiel-Fallübergabe für Schaden-/Gutachtenanfrage',
    },
    {
        'lead_id': 'bm-w2-003',
        'company_name': 'ETH Kfz-Werkstatt GmbH',
        'email': 'info@ethwerkstatt.de',
        'website': 'https://www.eth-werkstatt.de',
        'industry': 'Kfz-Werkstatt / Karosserie / Lack',
        'lead_score': 83,
        'subject': 'Re: Frage zu Unfall- und Reparaturanfragen',
        'body': '''Hallo zusammen,

ich wollte meine Frage kurz nach vorne holen.

Bei Unfall-, Lack- oder Reparaturanfragen fehlen vor dem Rückruf oft Bilder, Fahrzeugdaten oder eine kurze Schadensbeschreibung.

Soll ich Ihnen einmal ein Beispiel schicken, wie BaseModul daraus eine strukturierte Reparatur-/Rückrufnotiz machen würde?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
        'asset_offer': 'Beispiel-Fallübergabe für Schaden-/Reparaturanfrage',
    },
    {
        'lead_id': 'bm-w2-004',
        'company_name': 'Auto Münch',
        'email': 'service@automuench.de',
        'website': 'https://automuench.de',
        'industry': 'Kfz-Werkstatt / Karosserie / Lack',
        'lead_score': 83,
        'subject': 'Re: Kurze Frage zu Unfallschaden-Anfragen',
        'body': '''Hallo zusammen,

kurzer Nachtrag zu meiner Frage zu Unfallschaden-Anfragen.

Mir ging es um eine einfache Voraufnahme vor dem Rückruf: Fotos, Fahrzeugdaten, Schadenskontext, Kontaktdaten und Dringlichkeit sauber zusammenführen.

Soll ich Ihnen einmal ein kurzes Beispiel schicken, wie so eine Fallübergabe aussehen könnte?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
        'asset_offer': 'Beispiel-Fallübergabe für Schaden-/Reparaturanfrage',
    },
    {
        'lead_id': 'bm-w2-005',
        'company_name': 'B&G Fahrzeugtechnik',
        'email': 'info@bg-automotive.de',
        'website': 'https://www.bg-automotive.de',
        'industry': 'Kfz-Werkstatt / Fahrzeugtechnik',
        'lead_score': 83,
        'subject': 'Re: Frage zu Reparatur- und Unfallanfragen',
        'body': '''Hallo zusammen,

ich wollte meine Frage kurz nach vorne holen.

Bei Reparatur- oder Unfallanfragen ist oft schon vor dem Rückruf wichtig: Fahrzeug, Schaden, Fotos, Terminwunsch und Dringlichkeit.

Soll ich Ihnen einmal ein Beispiel schicken, wie BaseModul diese Infos als klare Übergabe fürs Team vorbereiten würde?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
        'asset_offer': 'Beispiel-Fallübergabe für Schaden-/Reparaturanfrage',
    },
    {
        'lead_id': 'bm-w2-008',
        'company_name': 'Aigner Kfz-Service GmbH & Co. KG',
        'email': 'info@aigner-kfz-service.de',
        'website': 'https://aigner-kfz-service.de',
        'industry': 'Kfz-Werkstatt',
        'lead_score': 83,
        'subject': 'Re: Frage zu Karosserie- und Reparaturanfragen',
        'body': '''Hallo zusammen,

kurzer Nachtrag zu meiner Frage zu Karosserie- und Reparaturanfragen.

Gerade bei solchen Anfragen fehlen vorab oft noch Fotos, Fahrzeugdaten oder eine kurze Einordnung des Problems.

Soll ich Ihnen einmal ein kurzes Beispiel schicken, wie daraus eine strukturierte Rückruf- oder Reparaturnotiz entstehen könnte?

Viele Grüße
Fatih Akdeniz
AGENTEQ · basemodul.de''',
        'asset_offer': 'Beispiel-Fallübergabe für Schaden-/Reparaturanfrage',
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


def read_guard_status(email: str):
    url = GUARD_BASE + '?department=' + urllib.parse.quote(DEPARTMENT) + '&email=' + urllib.parse.quote(email)
    res = http_json('GET', url, timeout=20)
    if not res.get('ok') or not isinstance(res.get('json'), dict) or res['json'].get('ok') is not True:
        raise RuntimeError(f'guard_unavailable_or_not_ok:{email}:{res.get("status")}:{str(res.get("text"))[:300]}')
    statuses = [s for s in (res['json'].get('statuses') or []) if s.get('department') == DEPARTMENT]
    return {'ok': True, 'count': len(statuses), 'syncedAt': res['json'].get('syncedAt'), 'statuses': statuses}


def check_guard_due(email: str):
    guard = read_guard_status(email)
    statuses = guard['statuses']
    if not statuses:
        raise RuntimeError(f'guard_no_status_for_followup:{email}')
    blockers = []
    for s in statuses:
        if s.get('blockFollowup') is True:
            blockers.append({'reason': 'blockFollowup', 'status': s})
        if s.get('replyStatus') in ('replied', 'bounce', 'out_of_office', 'uncertain'):
            blockers.append({'reason': 'replyStatus:' + str(s.get('replyStatus')), 'status': s})
        if s.get('nextAction') != 'follow_up_due':
            blockers.append({'reason': 'not_due:' + str(s.get('nextAction')), 'status': s})
    if blockers:
        raise RuntimeError(f'guard_blocked:{email}:{json.dumps(blockers, ensure_ascii=False)[:1000]}')
    return guard


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


def dedupe_campaign_before_send(targets):
    data = load_inbox_doc()
    hits = []
    lead_ids = {t['lead_id'] for t in targets}
    for r in data.get('records', []):
        if r.get('department') == DEPARTMENT and r.get('campaignId') == CAMPAIGN_ID and str(r.get('leadId')) in lead_ids:
            hits.append({'id': r.get('id'), 'leadId': r.get('leadId'), 'leadEmail': r.get('leadEmail'), 'subject': r.get('subject')})
    if hits:
        raise RuntimeError('campaign_outbound_dedupe_hits:' + json.dumps(hits, ensure_ascii=False)[:1500])
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


def load_lead_doc():
    if not LEADS_PATH.exists():
        return {'_meta': {'description': 'BaseModul Outreach Lead Store'}, 'leads': []}
    data = json.loads(LEADS_PATH.read_text())
    if isinstance(data, list):
        return {'_meta': {}, 'leads': data}
    data.setdefault('leads', [])
    data.setdefault('_meta', {})
    return data


def upsert_lead_for_followup(leads_doc, target, message_id, sent_now):
    leads = leads_doc['leads']
    by_id = {l.get('id'): l for l in leads}
    lead = by_id.get(target['lead_id'])
    if lead is None:
        lead = {
            'id': target['lead_id'],
            'company_name': target['company_name'],
            'website': target['website'],
            'city': 'München',
            'region': 'München',
            'industry': target['industry'],
            'contact_email': target['email'],
            'contact_name': 'nicht gefunden',
            'public_signal': 'Historischer Wave-2 Kfz/Gutachter Lead; Erstkontakt wurde am 2026-07-06 gesendet und Follow-up ist laut Guard fällig.',
            'suspected_problem': 'Fotos, Fahrzeugdaten, Schadenkontext und Rückrufinfos kommen vor Termin/Rückruf nicht immer vollständig rein.',
            'offer_angle': 'Foto-&-Datei-/Schaden-Modul',
            'hook_type': 'Kfz-Schadenaufnahme',
            'lead_score': target['lead_score'],
            'campaign_id': 'bm-wave-2-kfz-munich-top5-2026-07-06',
            'campaign_name': 'BaseModul Wave 2 — Kfz München Top 5',
            'created_at': '2026-07-04',
            'upserted_from_followup_run': CAMPAIGN_ID,
        }
        leads.append(lead)
    if lead.get('contact_email') != target['email']:
        raise RuntimeError(f'lead_email_mismatch:{target["lead_id"]}:{lead.get("contact_email")}')
    lead.update({
        'current_department': DEPARTMENT,
        'target_department': DEPARTMENT,
        'department': DEPARTMENT,
        'status': 'sent',
        'send_status': 'sent',
        'last_contacted_at': sent_now.isoformat(),
        'last_followup_at': sent_now.isoformat(),
        'followup_count': int(lead.get('followup_count') or 0) + 1,
        'next_followup_at': None,
        'kfz_asset_followup_subject_sent': target['subject'],
        'kfz_asset_followup_pitch_sent': target['body'],
        'kfz_asset_followup_resend_message_id': message_id,
        'kfz_asset_followup_campaign_id': CAMPAIGN_ID,
        'kfz_asset_followup_campaign_name': CAMPAIGN_NAME,
        'kfz_asset_followup_at': sent_now.isoformat(),
        'asset_offer': target['asset_offer'],
        'approved_by': 'Fatih',
        'approved_phrase': APPROVED_PHRASE,
        'error_message': None,
        'updated_at': sent_now.isoformat(),
        'last_updated_at': sent_now.isoformat(),
    })


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
    dedupe = dedupe_campaign_before_send(TARGETS)

    guard_results = {}
    for target in TARGETS:
        guard_results[target['email']] = check_guard_due(target['email'])

    domain_check = verify_domain(key)
    if not domain_check.get('agenteq_de_verified'):
        raise SystemExit('agenteq_domain_not_verified')

    leads_doc = load_lead_doc()
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
            upsert_lead_for_followup(leads_doc, target, message_id, sent_now)

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
                'nextFollowupAt': None,
                'status': 'sent',
                'tags': ['basemodul', DEPARTMENT, 'kfz', 'asset-followup', 'schadenaufnahme'],
                'metadata': {
                    'eventKind': 'asset_followup',
                    'campaign': 'basemodul-kfz-asset-followups',
                    'run': CAMPAIGN_ID,
                    'approvedBy': 'Fatih',
                    'approvedPhrase': APPROVED_PHRASE,
                    'assetDelivery': 'offer_to_send_example_no_attachment',
                    'assetOffer': target['asset_offer'],
                    'guard': guard_results.get(target['email']),
                    'legalNamingCheck': 'No GmbH/legal-entity wording for AGENTEQ/BaseModul/Callfolio; neutral brand names only.',
                },
            })

            item.update({
                'sent': True,
                'provider': 'resend',
                'provider_message_id': message_id,
                'sent_at_utc': sent_now.isoformat(),
                'body': target['body'],
            })
        except Exception as e:
            item['error'] = str(e)
        results.append(item)

    if any(not r.get('sent') for r in results):
        raise SystemExit(json.dumps({'error': 'partial_or_failed_send', 'results': results}, ensure_ascii=False, indent=2))

    delivery_details = wait_for_delivery(key, [r['provider_message_id'] for r in results])
    for r in results:
        r['resend_detail'] = delivery_details.get(r['provider_message_id'])

    leads_doc['_meta']['last_updated'] = dt.datetime.now(dt.timezone.utc).date().isoformat()
    LEADS_PATH.write_text(json.dumps(leads_doc, ensure_ascii=False, indent=2) + '\n')
    append_inbox_records(inbox_records)

    sync_after = gmail_sync()
    post_guard = {t['email']: read_guard_status(t['email']) for t in TARGETS}

    send_timing = {
        'weekday': weekday,
        'policy': 'allowed_friday_conscious',
        'guard_checked': True,
        'fatih_go_present': True,
        'result': 'send_allowed',
    }
    report = {
        'run': CAMPAIGN_ID,
        'department': DEPARTMENT,
        'approved_phrase': APPROVED_PHRASE,
        'sent_at_utc': dt.datetime.now(dt.timezone.utc).isoformat(),
        'send_timing_check': send_timing,
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
        '# BaseModul Kfz Asset Follow-ups — Send Log 2026-07-17',
        '',
        'Scope: 5 freigegebene Kfz/Gutachter-Follow-ups mit Beispiel-schicken CTA. Kein Auto-Follow-up.',
        '',
        '## Send Timing Check',
        '',
        f'- heutiger Tag: {weekday}',
        '- Policy: allowed_friday_conscious',
        '- Guard geprüft: yes',
        f'- Fatih-Go vorhanden: yes — „{APPROVED_PHRASE}“',
        '- Ergebnis: send_allowed',
        '',
        '## Guardrails',
        '',
        f'- Department: `{DEPARTMENT}`',
        '- Gmail Sync + Live-Guard pro Empfänger direkt vor Versand geprüft.',
        '- Alle 5 Ziel-Leads waren `nextAction=follow_up_due`, ohne Reply/Bounce/OOO/uncertain/blockFollowup.',
        '- Campaign-Dedupe geprüft: keine Treffer.',
        '- Kein Callfolio, keine SHK-Batch, keine Mission-Control-Writes.',
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
            f"| {i} | {r['company_name']} | `{r['recipient_email']}` | `{r['subject']}` | {send_result} | `{r.get('provider_message_id', '—')}` | `{detail.get('last_event', 'unknown')}` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |"
        )
    lines += [
        '',
        '## Operational Notes',
        '',
        f'- Sender: `{from_addr}`',
        f'- Reply-To: `{reply_to}`',
        f'- Report JSON: `{REPORT_JSON_PATH.relative_to(BASE)}`',
        f'- InboxOutboundRecords: `{INBOX_OUTBOUND_PATH}`',
        '- Local BaseModul lead store updated/upserted for successful sends: followup_count/last_followup_at/kfz_asset_followup_resend_message_id/next_followup_at.',
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
