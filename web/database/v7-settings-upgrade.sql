-- ============================================================
-- V7: SETTINGS UPGRADE – Communication Templates & Contractors
-- ============================================================

-- 1. Communication Templates (replaces JSONB column approach)
CREATE TABLE IF NOT EXISTS communication_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,            -- e.g. 'tenant_confirmation', 'contractor_assignment', 'sms_photo_request'
    label TEXT NOT NULL,           -- UI display name
    subject TEXT DEFAULT '',       -- Email subject line (empty for SMS templates)
    content TEXT NOT NULL,         -- Template body with {{variable}} placeholders
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

-- 2. Contractors (Handwerker) – add phone if table is new, or ALTER if exists
CREATE TABLE IF NOT EXISTS contractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    trade TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add phone column if contractors table already existed without it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contractors' AND column_name = 'phone'
    ) THEN
        ALTER TABLE contractors ADD COLUMN phone TEXT DEFAULT '';
    END IF;
END $$;

-- 3. Organization Settings (signature only – templates moved to own table)
CREATE TABLE IF NOT EXISTS organization_settings (
    organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
    sender_signature TEXT NOT NULL DEFAULT 'Mit freundlichen Grüßen
Ihre Hausverwaltung',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;

-- communication_templates policies
CREATE POLICY "Users can view own org templates" ON communication_templates
    FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own org templates" ON communication_templates
    FOR INSERT WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own org templates" ON communication_templates
    FOR UPDATE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own org templates" ON communication_templates
    FOR DELETE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

-- contractors policies
CREATE POLICY "Users can view organization contractors" ON contractors
    FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create organization contractors" ON contractors
    FOR INSERT WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update organization contractors" ON contractors
    FOR UPDATE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete organization contractors" ON contractors
    FOR DELETE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

-- organization_settings policies
CREATE POLICY "Users can view own organization settings" ON organization_settings
    FOR SELECT USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own organization settings" ON organization_settings
    FOR UPDATE USING (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own organization settings" ON organization_settings
    FOR INSERT WITH CHECK (organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid()));

-- ============================================================
-- SEED DEFAULT TEMPLATES FOR EXISTING ORGANIZATIONS
-- ============================================================

INSERT INTO communication_templates (organization_id, slug, label, subject, content)
SELECT id, 'tenant_confirmation', 'Mieter-Bestätigung',
       'Ihre Meldung wurde erfasst – Ticket #{{ticket_code}}',
       'Hallo {{tenant_name}},

vielen Dank für Ihre Meldung. Wir haben Ihr Anliegen erfasst und kümmern uns schnellstmöglich darum.

📋 IHRE MELDUNG:
Ticket-Code: {{ticket_code}}
Problem: {{issue}}
Dringlichkeit: {{urgency}}

📍 ADRESSE:
{{address}}

⏱️ VORAUSSICHTLICHE BEARBEITUNGSZEIT:
{{estimated_time}}

Bei Rückfragen können Sie uns jederzeit unter der Ticket-Nummer {{ticket_code}} kontaktieren.

{{signature}}'
FROM organizations
ON CONFLICT (organization_id, slug) DO NOTHING;

INSERT INTO communication_templates (organization_id, slug, label, subject, content)
SELECT id, 'contractor_assignment', 'Handwerker-Beauftragung',
       'Auftrag: {{category}} – Ticket #{{ticket_code}}',
       'Guten Tag,

hiermit beauftragen wir Sie mit folgendem Auftrag:

📋 AUFTRAGSDATEN:
Ticket: {{ticket_code}}
Kategorie: {{category}}
Dringlichkeit: {{urgency}}

📍 EINSATZORT:
{{address}}

👤 ANSPRECHPARTNER VOR ORT:
{{tenant_name}}
Telefon: {{phone}}

🔧 PROBLEMBESCHREIBUNG:
{{issue}}
{{issue_details}}

Bitte bestätigen Sie den Erhalt dieses Auftrags und teilen Sie uns den voraussichtlichen Ausführungstermin mit.

{{signature}}'
FROM organizations
ON CONFLICT (organization_id, slug) DO NOTHING;

INSERT INTO communication_templates (organization_id, slug, label, subject, content)
SELECT id, 'sms_photo_request', 'SMS Foto-Anfrage',
       '',
       'Guten Tag {{tenant_name}}, für Ihr Anliegen (Ticket {{ticket_code}}) benötigen wir ein Foto des Schadens. Bitte laden Sie es hier hoch: {{upload_url}}'
FROM organizations
ON CONFLICT (organization_id, slug) DO NOTHING;

-- Initialize organization_settings for existing orgs
INSERT INTO organization_settings (organization_id)
SELECT id FROM organizations
ON CONFLICT (organization_id) DO NOTHING;
