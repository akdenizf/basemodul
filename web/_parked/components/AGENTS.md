# UI Semantics & Component Index

## Dashboard Structure (`components/TicketDashboard.tsx`)
- **KPI Metrics**: Total Open, Emergencies, Last Update.
- **Filters**: Status, Urgency, List/Table toggles.
- **Action Bridge Integration**: Connects tickets to email/contractor actions.

## Ticket Card (`components/TicketCard.tsx`)
- **Match Indicators**: 
  - `MATCH` + confidence 1.0 = Phone Match
  - `MATCH` + confidence <1.0 = Fuzzy Match (%)
  - `REVIEW` = Manual Review needed
  - `UNKNOWN` = No Match
- **Styling**: Distinct borders/backgrounds for EMERGENCy urgency.

## Core Components
- **`ActivityTimeline.tsx`**: Chronological ticket activity log with icons per type.
- **`EmailPreviewModal.tsx`**: Action Bridge for manual email control (select template, edit subject/body, trigger send API).
- **`TicketAttachments.tsx`**: Renders SMS-uploaded visual context photos.
