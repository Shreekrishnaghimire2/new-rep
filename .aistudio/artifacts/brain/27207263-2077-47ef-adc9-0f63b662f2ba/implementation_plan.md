# Implementation Plan — SKG ENTERPRISES Admin Panel & Backend Integration

Build a secure, full-stack Admin Panel for SKG ENTERPRISES enabling administrators to log in, review incoming client project inquiries, update inquiry progress statuses, and add private internal notes backed by a persistent Express storage engine.

---

## 1. User Review Required

> [!IMPORTANT]
> **Default Admin Credentials**: For immediate development access, the system will initialize with a secure default credential:
> - **Username**: `admin`
> - **Password / PIN**: `skg@admin2026` (also configurable via `ADMIN_PASSWORD` in `.env.example`)
> The admin interface will provide an option to update the credentials directly in the session.

---

## 2. Proposed Architectural & Code Changes

### A. Backend (`server.ts`)
- **Admin Authentication**:
  - Secure login endpoint: `POST /api/admin/login` validating username and password/PIN with rate limiting (max 5 failed attempts per 15 minutes) to protect against brute force attacks.
  - Generates a cryptographically random session token stored in an active session cache.
  - Middleware `requireAdminAuth` to verify `Authorization: Bearer <token>` on all admin endpoints.
  - Logout endpoint: `POST /api/admin/logout`.
- **Inquiry Management API**:
  - `GET /api/admin/inquiries`: Fetch all inquiries with filtering by status, search by client name/email/ID, and sorting by submission date.
  - `PATCH /api/admin/inquiries/:id`: Update status (`received`, `in_review`, `contacted`, `completed`, `archived`) and append internal admin notes (with timestamp and note author).
  - `DELETE /api/admin/inquiries/:id`: Secure deletion/archive capability.
  - `GET /api/admin/stats`: Summary counts of total inquiries, pending reviews, contacted leads, and conversion metrics.
- **Persistence**:
  - Enhancing `.inquiries_store.json` data structure with `notes: { id: string; text: string; createdAt: string }[]` and `updatedAt: string`.

### B. Frontend (`src/components/AdminPanel.tsx` & Navigation)
- **Dedicated Admin Page (`#admin`)**:
  - Seamlessly integrated into the navigation system with a discreet lock icon / admin link in the header and footer.
  - **Login View**: Elegant high-contrast glassmorphic login card with password/PIN visibility toggle, error feedback, and loading state.
  - **Dashboard View**:
    - **KPI Metrics Strip**: Total Inquiries, Pending Review, In Contact, and Completed Projects.
    - **Search & Filter Bar**: Instant search by client name, email, or inquiry ID, with filter buttons for statuses (`All`, `Received`, `In Review`, `Contacted`, `Archived`).
    - **Inquiry Detail Drawer/Modal**: View full project description, requested service, budget range, timeline, client IP, and submission date.
    - **Status Selector**: Instant status updates (`Received` ➔ `In Review` ➔ `Contacted` ➔ `Completed` ➔ `Archived`).
    - **Internal Team Notes Section**: Add, view, and organize internal notes on each inquiry with timestamps.
    - **Export**: One-click download of inquiries as CSV or JSON.
    - **Logout**: Safe session clearance.

### C. Bilingual Support (`src/translations.ts`)
- Complete English and Nepali translations for all admin panel labels, KPI cards, status badges, and note inputs.

---

## 3. Verification Plan

### Automated Verification
- `compile_applet`: Verify clean TypeScript compilation of the frontend and server.
- `lint_applet`: Ensure 0 lint and type errors (`tsc --noEmit`).
- `npm run build`: Verify production bundle generation.

### Manual & API Verification
- `curl -X POST /api/admin/login` with valid and invalid credentials.
- Test inquiry status transition: submit a test inquiry ➔ login to admin ➔ update status to `in_review` ➔ add internal note ➔ verify response.
- Verify status reflects on the public verification endpoint (`/api/contact/verify/:id`).
- Test keyboard accessibility, mobile responsiveness, and session persistence in browser `localStorage`.
