# Callfolio API Reference (v7.0)

This document provides a comprehensive overview of the API endpoints available in Callfolio. All administrative endpoints require authentication.

---

## 1. Vapi Integration

... [No changes to Section 1] ...

---

## 2. Tickets API

### GET `/api/tickets`
**Purpose:** Lists tickets for the authenticated user's organization.
**Query Params:**
- `status`: Filter by status (NEW, IN_PROGRESS, etc.)
- `urgency`: Filter by urgency.
- `search`: Full-text search on codes, names, or addresses.

---

## 3. Contractors API (New in v6.0)

Endpoints for managing trade partners.

### GET `/api/contractors`
**Purpose:** Lists all contractors for the organization.

### POST `/api/contractors`
**Purpose:** Creates a new contractor.
**Body:** `{ name, email, phone, trade }`

### PUT `/api/contractors`
**Purpose:** Updates an existing contractor.
**Body:** `{ id, name, email, phone, trade }`

### DELETE `/api/contractors?id=[id]`
**Purpose:** Deletes a contractor.

---

## 4. Communication Templates API (New in v7.0)

### GET `/api/communication-templates`
**Purpose:** Fetches all templates for the organization.

### PUT `/api/communication-templates`
**Purpose:** Updates a template's content and subject.
**Body:** `{ slug, subject, content }`

---

## 5. Tenants API (Enhanced in v7.0)

### POST `/api/tenants/create`
**Purpose:** Manually create a new tenant.

### PUT `/api/tenants/update`
**Purpose:** Updates an existing tenant.
**Body:** `{ id, firstName, lastName, phone, ... }`

### DELETE `/api/tenants/delete`
**Purpose:** Deletes a tenant.

---

## 6. Admin & Automation

### POST `/api/admin/send-email`
**Purpose:** Advanced email dispatcher. Supports templates and contractor assignments.
**Body:** `{ ticket_id, recipient_type, recipient_email, subject, body, template_type, contractor_name?, update_status? }`

