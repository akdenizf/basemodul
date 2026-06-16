# Data Privacy & Compliance (v5.4)

Callfolio is designed with a "Privacy by Design" approach, specifically tailored for the requirements of German property managers and compliance with European regulations (GDPR/DSGVO and the EU AI Act).

## 1. GDPR / DSGVO Compliance

### Data Minimization
- **No Audio Recordings**: Callfolio explicitly disables recording in the Vapi configuration. No audio files are ever stored or processed.
- **No Full Transcripts**: While the AI processes the conversation in real-time, Callfolio does not store the full text transcript. Only structured data (issue summary, caller details, urgency) is persisted in the database.
- **Purpose Limitation**: Data is collected solely for the purpose of processing maintenance requests and tenant communication.

### Technical Security
- **Data Residency**: All database operations are handled by Supabase (PostgreSQL). Ensure your Supabase project is hosted in an EU region (e.g., Frankfurt).
- **Encryption**: Data is encrypted at rest and in transit (SSL/TLS).
- **Access Control**: Row Level Security (RLS) is enforced in Supabase, ensuring that users can only access data belonging to their own organization.
- **Audit Logging**: Every administrative action (ticket status change, manual matching, email sending) is logged in the `ticket_activities` table, providing a complete audit trail.

---

## 2. EU AI Act Compliance

### Transparency Obligations
- **AI Disclosure**: The system is configured to explicitly state its nature as an AI assistant at the beginning of every call.
- **Standard Greeting**: "Guten Tag, Sie sprechen mit dem digitalen KI-Assistenten der Hausverwaltung [Name]..."
- **System Prompt**: The `docs/vapi-system-prompt-v5.md` ensures the AI identifies itself as a "digitaler Assistent" and maintains a professional, non-human persona.

---

## 3. Data Processing Agreement (AVV)

Property managers using Callfolio should ensure they have Data Processing Agreements in place with:
1. **Callfolio** (as the service provider).
2. **Supabase** (Database/Auth).
3. **Vapi** (AI Voice Processing).
4. **Resend** (Email Dispatch).

---

## 4. Rights of Data Subjects

Callfolio provides tools for property managers to fulfill their obligations:
- **Right to Access**: Admins can view all data associated with a tenant or ticket in the dashboard.
- **Right to Erasure**: Tickets and tenant records can be deleted via the administrative interface or API.
- **Right to Rectification**: Tenant data can be updated at any time via the "Mieterstamm" section or manual ticket assignment.
