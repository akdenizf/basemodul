# Callfolio MVP v7.0 - AI Automation for Property Management

Callfolio is a professional voice-intake system for German property managers. It uses AI to handle tenant calls, create structured tickets, and automate follow-up documentation via intelligent templates and contractor management.

## Core Features

- **B2B Landing Page (v8.1):** High-converting, cinematic frontend tailored specifically for traditional property management companies.
- **AI Voice Assistant (Vapi):** Handles incoming calls 24/7 with professional German greetings.
- **3-Tier Matching Engine:** Automatically identifies tenants by phone number or fuzzy address matching.
- **Contractor CRM (v6.0):** Manage trade partners and assign tickets directly from the dashboard.
- **Communication Templates (v7.0):** Automated confirmation & assignment emails with dynamic placeholders.
- **Tenant Management:** Real-time CRUD operations for tenant data directly in the command center.
- **Visual Context (v5.4):** Automatically requests photo evidence via SMS for specific damage categories.
- **Audit Log:** Complete activity history for every ticket, ensuring compliance and transparency.


## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Lucide Icons
- **Backend:** Next.js API Routes, Supabase (PostgreSQL + pg_trgm)
- **AI/Voice:** Vapi Assistant, Twilio
- **Email:** Resend API
- **SMS:** Twilio Messaging Service

## Getting Started

### 1. Environment Variables

Copy `env.example` to `.env.local` and fill in the following:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Vapi & Twilio
VAPI_WEBHOOK_SECRET=your_secret
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_MESSAGING_SERVICE_SID=your_service_sid

# Email
RESEND_API_KEY=your_key
RESEND_FROM=noreply@yourdomain.com
```

### 2. Database Setup

1. Create a Supabase project.
2. Run the SQL migrations in `database/` in chronological order.
3. **Important (v5.4):** Create a storage bucket named `ticket-evidence` in your Supabase project and set it to "Public".

### 3. Development

```bash
npm install
npm run dev
```

## Documentation

- **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)** - Technical specification and data flow.
- **[docs/API_REFERENCE.md](docs/API_REFERENCE.md)** - Detailed endpoint documentation.
- **[docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** - Step-by-step production setup.
- **[docs/USER_GUIDE_ADMIN.md](docs/USER_GUIDE_ADMIN.md)** - Manual for property managers (German).
- **[docs/PROJECT_JOURNAL.md](docs/PROJECT_JOURNAL.md)** - Project history and milestones.
- **[docs/testing/2026-05-17_e2e_identity_onboarding_report.md](docs/testing/2026-05-17_e2e_identity_onboarding_report.md)** - E2E test report: Identity & SMS pipeline (PASS, 20/20 tests). Critical architecture invariants documented here.
