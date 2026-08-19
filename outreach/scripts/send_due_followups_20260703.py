#!/usr/bin/env python3
"""Send five due BaseModul follow-ups after explicit Fatih-Go."""
import datetime as dt
import html
import json
import os
import pathlib
import urllib.error
import urllib.parse
import urllib.request

BASE = pathlib.Path('/Users/user/Desktop/Projects/basemodul')
AGENTEQ = pathlib.Path('/Users/user/Desktop/Projects/AgenteqHQ')
OUTREACH_AGENT = pathlib.Path('/Users/user/Desktop/Projects/Outreach-Agent')
LEADS_PATH = AGENTEQ / 'data/agenteq-outreach/leads.json'
INBOX_OUTBOUND_PATH = OUTREACH_AGENT / 'data/inbox-outbound.json'
REPORT_JSON_PATH = BASE / 'outreach/reports/basemodul-due-followups-send-2026-07-03.json'
SEND_LOG_PATH = BASE / 'outreach/reports/BASEMODUL_DUE_FOLLOWUPS_SEND_LOG_2026-07-03.md'
DEPARTMENT = 'base-modul-outreach'
CAMPAIGN_ID = 'basemodul-due-followups-2026-07-03'
CAMPAIGN_NAME = 'BaseModul Due Follow-ups — 2026-07-03'
APPROVED_PHRASE = 'ja sende er bitte.'
GUARD_BASE = 'http://localhost:4550/api/outreach-status'

TARGETS = [
    {
        'lead_id': 'gtm-09-sam-klimatechnik',
        'company_name': 'SAM Klimatechnik',
        'email': 'kundendienst@sam-klimatechnik.de',
        'subject': 'Re: Frage zu Klimaanfragen',
        'body': '''Hallo zusammen,

kurzer Nachtrag zu meiner Frage von letzter Woche.

Mir ging es konkret um neue Klimaanfragen, bei denen vor einem sinnvollen Rückruf noch Infos wie Anlagentyp, Einsatzort oder Dringlichkeit fehlen.

Genau dafür bauen wir mit BaseModul kleine Intake-Flows: fehlende Angaben abfragen, Anfrage vorsortieren und sauber ans Team übergeben.

Wäre ein kurzer 20-Minuten-Blick auf Ihren aktuellen Anfrageweg grundsätzlich interessant?

Viele Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
    {
        'lead_id': 'gtm-11-arktika-gmbh',
        'company_name': 'Arktika GmbH',
        'email': 'info@arktika-gmbh.de',
        'subject': 'Re: Frage zu Notdienstanfragen',
        'body': '''Hallo zusammen,

kurzer Nachtrag zu meiner Mail.

Bei 24/7-Notdienst und Wartung geht es aus meiner Sicht nicht um ein großes neues System, sondern um den Schritt vor der internen Weitergabe: Standort, Anlage, Problem und Dringlichkeit sauber erfassen.

BaseModul kann genau daraus eine klare Rückruf- oder Einsatznotiz für Ihr Team machen.

Wäre ein kurzer Blick auf Ihren aktuellen Notdienst-/Wartungs-Anfrageweg interessant?

Viele Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
    {
        'lead_id': 'gtm-10-atu-logistik-gmbh',
        'company_name': 'ATU Logistik GmbH',
        'email': 'firmenkunden@atu-logistik.de',
        'subject': 'Re: Frage zu Besichtigungsanfragen',
        'body': '''Hallo zusammen,

kurzer Nachtrag zu meiner Frage zu Besichtigungs- und Angebotsanfragen.

Vor einem Rückruf oder Vor-Ort-Termin fehlen oft noch Angaben zu Umfang, Zugang, Fotos oder besonderen Anforderungen.

Wir bauen kleine Vorqualifizierungs-Flows, die genau diese Infos einsammeln und als vollständige Übergabe für Rückruf oder Besichtigung vorbereiten.

Wäre ein kurzer Blick darauf interessant, ob sich dadurch manuelle Rückfragen reduzieren lassen?

Viele Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
    {
        'lead_id': 'gtm-14-loogo-umzuge',
        'company_name': 'LOOGO Umzüge',
        'email': 'office@loogo.at',
        'subject': 'Re: Frage zur Anfrageverteilung',
        'body': '''Hallo zusammen,

kurzer Nachtrag zu meiner Frage zur Anfrageverteilung.

Bei mehreren Standorten ist oft schon die erste Sortierung entscheidend: welcher Standort, welche Leistung, welche Dringlichkeit und welche Infos fehlen noch?

BaseModul kann neue Anfragen vorsortieren und als saubere Übergabe an das passende Team weitergeben.

Ist das Thema Anfrageverteilung bei LOOGO aktuell relevant genug für einen kurzen Austausch?

Viele Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
    {
        'lead_id': 'gtm-16-umzugsritter',
        'company_name': 'Umzugsritter',
        'email': 'office@umzugsritter.at',
        'subject': 'Re: Frage zum Inventartool',
        'body': '''Hallo zusammen,

kurzer Nachtrag zu meiner Frage zum Inventartool.

Der spannende Punkt ist aus meiner Sicht der Übergang nach der Erfassung: Werden die Daten direkt für Angebot oder Disposition nutzbar, oder bleibt dort noch manuelle Arbeit hängen?

Falls ja, könnte ein kleiner Workflow helfen, Inventardaten sauberer zu prüfen, zu ergänzen und zu übergeben.

Wäre ein kurzer Austausch dazu interessant?

Viele Grüße
Fatih Akdeniz
AGENTEQ / basemodul.de''',
    },
]


def load_dotenv_file(path):
    if not path.exists():
        return
    for line in path.read_text(errors='ignore').splitlines():
        if not line.strip() or line.lstrip().startswith('#') or '=' not in line:
            continue
        k, v = line.split('=', 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def load_env():
    for p in [BASE/'.env', BASE/'.env.local', AGENTEQ/'.env', AGENTEQ/'.env.local']:
        load_dotenv_file(p)


def html_body(text):
    return '<!doctype html><html lang="de"><body><div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#111827">' + html.escape(text).replace('\n', '<br>') + '</div></body></html>'


def http_json(method, url, headers=None, payload=None, timeout=30):
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


def resend_request(method, path, key, payload=None):
    return http_json(method, 'https://api.resend.com' + path, headers={
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json',
        'User-Agent': 'Hermes-BaseModul/1.0',
    }, payload=payload, timeout=75)


def gmail_sync():
    res = http_json('POST', 'http://localhost:4550/api/gmail/sync', timeout=75)
    if not res.get('ok') or not isinstance(res.get('json'), dict) or res['json'].get('ok') is not True:
        raise RuntimeError('gmail_sync_failed:' + str(res)[:500])
    return res['json']


def check_guard(email):
    url = GUARD_BASE + '?department=' + urllib.parse.quote(DEPARTMENT) + '&email=' + urllib.parse.quote(email)
    res = http_json('GET', url, timeout=20)
    if not res.get('ok') or not isinstance(res.get('json'), dict) or res['json'].get('ok') is not True:
        raise RuntimeError('guard_not_ok:' + email + ':' + str(res)[:500])
    statuses = [s for s in (res['json'].get('statuses') or []) if s.get('department') == DEPARTMENT]
    if len(statuses) != 1:
        raise RuntimeError(f'guard_expected_one_status:{email}:count={len(statuses)}')
    s = statuses[0]
    if s.get('blockFollowup') is True:
        raise RuntimeError('guard_blockFollowup:' + email + ':' + json.dumps(s, ensure_ascii=False)[:500])
    if s.get('replyStatus') != 'no_reply' or s.get('nextAction') != 'follow_up_due':
        raise RuntimeError('guard_not_due:' + email + ':' + json.dumps(s, ensure_ascii=False)[:500])
    return {'syncedAt': res['json'].get('syncedAt'), 'status': s}


def verify_domain(key):
    res = resend_request('GET', '/domains', key)
    domains=[]
    if res.get('ok') and isinstance(res.get('json'), dict):
        for d in res['json'].get('data', []) or []:
            domains.append({'name': d.get('name'), 'status': d.get('status')})
    return {'ok': res.get('ok'), 'agenteq_de_verified': any(d['name']=='agenteq.de' and str(d['status']).lower() in ('verified','success') for d in domains), 'domains': domains}


def append_inbox(records):
    data = json.loads(INBOX_OUTBOUND_PATH.read_text()) if INBOX_OUTBOUND_PATH.exists() else {'exportedAt': None, 'records': []}
    data.setdefault('records', [])
    existing = {r.get('id') for r in data['records']}
    for r in records:
        if r['id'] in existing:
            raise RuntimeError('duplicate_inbox_record:' + r['id'])
    data['records'].extend(records)
    data['exportedAt'] = dt.datetime.now(dt.timezone.utc).isoformat()
    INBOX_OUTBOUND_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def main():
    load_env()
    key = (os.getenv('AGENTEQ_RESEND_API_KEY') or '').strip()
    from_addr = (os.getenv('AGENTEQ_RESEND_FROM') or '').strip()
    reply_to = (os.getenv('AGENTEQ_REPLY_TO') or '').strip()
    if not key or not from_addr or not reply_to:
        raise SystemExit('missing AGENTEQ_RESEND_API_KEY / AGENTEQ_RESEND_FROM / AGENTEQ_REPLY_TO')
    now_local = dt.datetime.now().astimezone()
    weekday = now_local.strftime('%A')
    if weekday == 'Sunday':
        raise SystemExit('blocked_sunday')
    if weekday == 'Saturday':
        raise SystemExit('blocked_saturday')
    sync = gmail_sync()
    guard_results = {t['email']: check_guard(t['email']) for t in TARGETS}
    domain_check = verify_domain(key)
    if not domain_check.get('agenteq_de_verified'):
        raise SystemExit('agenteq_domain_not_verified')
    leads = json.loads(LEADS_PATH.read_text())
    by_id = {l.get('id'): l for l in leads}
    results=[]; inbox=[]
    for t in TARGETS:
        lead = by_id.get(t['lead_id'])
        item={'lead_id':t['lead_id'],'company_name':t['company_name'],'recipient_email':t['email'],'subject':t['subject'],'attempted':False,'sent':False}
        try:
            if not lead:
                raise RuntimeError('lead_not_found')
            if lead.get('followup_count', 0) >= 1:
                raise RuntimeError('followup_already_sent_evidence')
            payload={'from':from_addr,'to':[t['email']],'subject':t['subject'],'html':html_body(t['body']),'text':t['body'],'reply_to':reply_to}
            item['attempted']=True
            send=resend_request('POST','/emails',key,payload)
            if not (send.get('ok') and isinstance(send.get('json'), dict) and send['json'].get('id')):
                item['send_response']=send; raise RuntimeError('resend_failed')
            mid=send['json']['id']; sent_now=dt.datetime.now(dt.timezone.utc)
            lead.update({
                'status':'sent', 'send_status':'sent', 'last_followup_at':sent_now.isoformat(), 'last_contacted_at':sent_now.isoformat(),
                'followup_count': int(lead.get('followup_count') or 0) + 1, 'next_followup_at': None,
                'followup_subject_sent': t['subject'], 'followup_pitch_sent': t['body'],
                'followup_resend_message_id': mid, 'updated_at': sent_now.isoformat(), 'error_message': None,
            })
            detail=resend_request('GET', f'/emails/{mid}', key)
            detail_public=None
            if detail.get('ok') and isinstance(detail.get('json'), dict):
                d=detail['json']; detail_public={k:d.get(k) for k in ['id','from','to','subject','created_at','last_event'] if k in d}
            inbox.append({
                'id': f'outbound_{DEPARTMENT}_{t["lead_id"]}_{mid}', 'source':'hermes-agent', 'department':DEPARTMENT,
                'campaignId': CAMPAIGN_ID, 'campaignName': CAMPAIGN_NAME, 'leadId':t['lead_id'], 'leadEmail':t['email'],
                'companyName':t['company_name'], 'fromEmail':from_addr, 'replyToEmail':reply_to, 'subject':t['subject'],
                'provider':'resend', 'providerMessageId':mid, 'resendMessageId':mid, 'sentAt':sent_now.isoformat(),
                'nextFollowupAt': None, 'status':'sent', 'tags':['basemodul', DEPARTMENT, 'follow-up'],
                'metadata': {'eventKind':'follow_up', 'campaign':'basemodul', 'run':CAMPAIGN_ID, 'approvedBy':'Fatih', 'approvedPhrase':APPROVED_PHRASE, 'guard':guard_results[t['email']]},
            })
            item.update({'sent':True,'provider':'resend','provider_message_id':mid,'sent_at_utc':sent_now.isoformat(),'resend_detail':detail_public})
        except Exception as e:
            item['error']=str(e)
        results.append(item)
    LEADS_PATH.write_text(json.dumps(leads, ensure_ascii=False, indent=2) + '\n')
    append_inbox(inbox)
    report={'run':CAMPAIGN_ID,'department':DEPARTMENT,'approved_phrase':APPROVED_PHRASE,'sent_at_utc':dt.datetime.now(dt.timezone.utc).isoformat(),'send_timing_check':{'weekday':weekday,'policy':'allowed_friday_morning_conscious' if weekday=='Friday' else 'allowed','guard_checked':True,'fatih_go_present':True,'result':'send_allowed'},'sync':sync,'sender':from_addr,'reply_to':reply_to,'sender_domain_check':domain_check,'guard_results':guard_results,'results':results,'inbox_outbound_records_written':len(inbox)}
    REPORT_JSON_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    lines=['# BaseModul Due Follow-ups — Send Log 2026-07-03','','Scope: 5 freigegebene BaseModul Follow-ups. Kein Auto-Follow-up.','','## Send Timing Check','',f'- heutiger Tag: {weekday}','- Policy: allowed, aber bewusst/vormittags' if weekday=='Friday' else '- Policy: allowed','- Guard geprüft: yes',f'- Fatih-Go vorhanden: yes — „{APPROVED_PHRASE}“','- Ergebnis: send_allowed','','## Real Send','','| # | Lead | Recipient | Subject | Send Result | Resend ID | Last Event |','|---:|---|---|---|---|---|---|']
    for i,r in enumerate(results,1):
        d=r.get('resend_detail') or {}; lines.append(f"| {i} | {r['company_name']} | `{r['recipient_email']}` | `{r['subject']}` | {'sent via Resend' if r.get('sent') else 'failed: '+str(r.get('error'))} | `{r.get('provider_message_id','—')}` | `{d.get('last_event','unknown')}` |")
    lines += ['','## Operational Notes','',f'- Sender: `{from_addr}`',f'- Reply-To: `{reply_to}`',f'- JSON Report: `{REPORT_JSON_PATH.relative_to(BASE)}`','- Lead Store updated in AgenteqHQ data/agenteq-outreach/leads.json.','- InboxOutboundRecords exported with `department=base-modul-outreach`.','- Keine Mission-Control-Pflicht.','']
    SEND_LOG_PATH.write_text('\n'.join(lines))
    print(json.dumps({'report':str(REPORT_JSON_PATH),'log':str(SEND_LOG_PATH),'attempted':sum(1 for r in results if r.get('attempted')),'sent_success':sum(1 for r in results if r.get('sent')),'errors':[{'company':r.get('company_name'),'error':r.get('error')} for r in results if r.get('error')],'sent':[{'company':r.get('company_name'),'email':r.get('recipient_email'),'id':r.get('provider_message_id'),'last_event':(r.get('resend_detail') or {}).get('last_event')} for r in results if r.get('sent')],'inbox_outbound_records_written':len(inbox)}, ensure_ascii=False, indent=2))
    if any(not r.get('sent') for r in results):
        raise SystemExit(1)

if __name__ == '__main__':
    main()
