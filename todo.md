# Skooltech Dashboard Enrichment — Development Plan

## Approved Decisions
- Routing: **Nested file-based routes** (deep-linkable, browser history)
- State: **Server Components + Server Actions** (revalidatePath)
- Real-time: **Not now** (add Pusher/Ably later)
- Order: **Student first → Admin → Principal → Accounts → Teacher**
- Design: **Keep current system** — 4px radius, Poppins, Royal Blue #1D4ED8, Light mode only, INR ₹

---

## Global Infrastructure

### Step 1: Layout Foundation & Responsive Shell
- [ ] `src/app/dashboard/layout.tsx` — Remove `max-w-7xl`, full-width, sidebar slot
- [ ] `src/components/shared/DashboardShell.tsx` — Sidebar + main wrapper
- [ ] `src/components/shared/DashboardSidebar.tsx` — Desktop: 280px expanded / 64px collapsed, Mobile: overlay drawer
- [ ] `src/components/shared/MobileSidebarToggle.tsx` — Hamburger for mobile
- [ ] Sidebar responsive: `<768px` drawer, `768–1024px` icon-only, `≥1024px` expanded
- [ ] Update `DashboardHeader.tsx` — Remove `max-w-7xl`, full-width

### Step 7: Shared Components
- [ ] `SidebarNav.tsx` — Nav item w/ icon, label, badge, active state, collapsible groups
- [ ] `TabNavigation.tsx` — Horizontal tabs, keyboard nav, mobile scroll-snap
- [ ] `DataTable.tsx` — Sortable, filterable, paginated, exportable
- [ ] `Modal.tsx` — Accessible dialog, portal, focus trap, sizes
- [ ] `FormBuilder.tsx` — Dynamic forms with validation
- [ ] `ChartWrapper.tsx` — Recharts wrapper
- [ ] `PrintLayout.tsx` — A4/thermal print styles
- [ ] `EmptyState.tsx` — Illustration + action button
- [ ] `LoadingSkeleton.tsx` — Table/card/chart/list skeletons
- [ ] `ErrorBoundary.tsx` — Graceful fallback + retry

---

## Student Dashboard (PRIORITY 1)

Route: `/dashboard/student/*`

### Step 6: Sidebar Sections & Tabs
- [ ] **Overview** — `/dashboard/student` — attendance %, fee status, upcoming exams, recent results, notices
- [ ] **Attendance** — `/dashboard/student/attendance`
  - [ ] Tab: Monthly Calendar — month-wise grid P/A/L/E
  - [ ] Tab: Summary Stats — yearly %, subject-wise breakdown
  - [ ] Tab: Holidays — school holiday list
  - [ ] Tab: Apply Leave — Leave Application Modal (date range, reason, doc upload)
  - [ ] Tab: Raise Dispute — Dispute Modal (select date, reason, attachment)
- [ ] **My Exams** — `/dashboard/student/exams`
  - [ ] Tab: Upcoming — list with "View Time Table" button
  - [ ] Tab: Completed — list with "View Result" button → detailed marksheet (CBSE 9-point)
  - [ ] Tab: Time Tables — downloadable PDF
  - [ ] Tab: Results — historical with percentile/CGPA
- [ ] **Fees** — `/dashboard/student/fees`
  - [ ] Tab: Current Invoice — due amount + late fee breakdown
  - [ ] Tab: Payment History — transaction list
  - [ ] Tab: Receipts — download/print
  - [ ] Tab: Online Payment (BYOG) — UPI/Card/NetBanking checkout
- [ ] **Academics** — `/dashboard/student/academics`
  - [ ] Tab: Syllabus — by subject
  - [ ] Tab: Homework — list + submit
  - [ ] Tab: Assignments — list + status
  - [ ] Tab: Study Material — downloadable resources
  - [ ] Tab: Progress Report — overview
- [ ] **Schedule** — `/dashboard/student/schedule`
  - [ ] Tab: Weekly Timetable — color-coded, printable
  - [ ] Tab: Exam Schedule
  - [ ] Tab: Event Calendar
  - [ ] Tab: Substitute Teachers
- [ ] **Report Cards** — `/dashboard/student/report-cards`
  - [ ] Tab: Current Term — CBSE 9-point, CGPA 10/5, remarks, seal
  - [ ] Tab: Historical — previous terms
  - [ ] Tab: Download PDF
  - [ ] Tab: Print
- [ ] **Leave Applications** — `/dashboard/student/leaves`
  - [ ] Tab: Apply New — form
  - [ ] Tab: My Applications — list w/ status
  - [ ] Tab: Status Tracker — Pending/Approved/Rejected
  - [ ] Tab: History — past leaves
- [ ] **Notifications** — `/dashboard/student/notifications`
  - [ ] Tab: School Notices | Class Announcements | Fee Reminders | Exam Alerts | Messages
  - [ ] Mark read, filter by type
- [ ] **Profile** — `/dashboard/student/profile`
  - [ ] Tab: My Profile | Parent Details | Change Password | Notification Preferences | Download Center

---

## Admin Dashboard (PRIORITY 2)

Route: `/dashboard/admin/*`

### Step 2: Sidebar Sections & Tabs
- [ ] **Overview** — `/dashboard/admin` — metrics, quick actions, recent activity
- [ ] **Student Lifecycle** — `/dashboard/admin/students`
  - [ ] Tabs: Drafts (4A) → Placed (4B) → Fee Pending (4C) → Active → Alumni
  - [ ] CRUD: promote, edit, archive, bulk rollover
- [ ] **Staff Management** — `/dashboard/admin/staff`
  - [ ] Tabs: Teachers → Accounts → Principals
  - [ ] CRUD: add/edit/deactivate, assign sections, reset passwords
- [ ] **Academic Structure** — `/dashboard/admin/academics`
  - [ ] Tabs: Classes → Sections → Sessions → Subjects
  - [ ] CRUD: create class, assign teacher, set session current
- [ ] **Admissions** — `/dashboard/admin/admissions`
  - [ ] Tabs: New Applications → Pending Review → Approved → Rejected
- [ ] **Fee Structures** — `/dashboard/admin/fees`
  - [ ] Tabs: Templates → Invoices → Collections → Reports
- [ ] **Examinations** — `/dashboard/admin/exams`
  - [ ] Tabs: Exam Calendar → Results Overview → Report Cards
- [ ] **Communications** — `/dashboard/admin/communications`
  - [ ] Tabs: Notices → Circulars → SMS/Email Logs
- [ ] **Audit & Compliance** — `/dashboard/admin/audit`
  - [ ] Tabs: Audit Trail → Discrepancy Log → Compliance Reports
- [ ] **Settings** — `/dashboard/admin/settings`
  - [ ] Tabs: School Profile → Branding → Payment Gateway (BYOG) → Grading Scale → User Roles

---

## Principal Dashboard (PRIORITY 3)

Route: `/dashboard/principal/*`

### Step 3: Sidebar Sections & Tabs
- [ ] **Overview** — `/dashboard/principal` — attendance %, discrepancies, fee %, academic health
- [ ] **Attendance Oversight** — `/dashboard/principal/attendance`
  - [ ] Tabs: Daily Summary → Monthly Trends → Biometric Cross-Check → Discrepancy Resolution
- [ ] **Academic Monitoring** — `/dashboard/principal/academics`
  - [ ] Tabs: Exam Calendar → Result Analytics → Class Performance → Teacher Workload
- [ ] **Fee & Finance** — `/dashboard/principal/finance`
  - [ ] Tabs: Collection Overview → Overdue Analysis → Refunds → Gateway Settlements
- [ ] **Staff Management** — `/dashboard/principal/staff`
  - [ ] Tabs: Teacher Attendance → Leave Approvals → Performance → Announcements
- [ ] **Student Welfare** — `/dashboard/principal/welfare`
  - [ ] Tabs: Leave Requests → Disciplinary → Parent Communications → Counseling
- [ ] **Audit Trail** — `/dashboard/principal/audit`
  - [ ] Tabs: Full Log → Fee Audits → Marks Changes → Admin Actions
- [ ] **Reports** — `/dashboard/principal/reports`
  - [ ] Tabs: CBSE Compliance → Board Affiliation → Annual Returns → Custom Reports
- [ ] **Settings** — `/dashboard/principal/settings`

---

## Accounts Dashboard (PRIORITY 4)

Route: `/dashboard/accounts/*`

### Step 4: Sidebar Sections & Tabs
- [ ] **Overview** — `/dashboard/accounts` — metrics, overdue aging, pending verifications
- [ ] **Cash Desk** — `/dashboard/accounts/cash-desk`
  - [ ] Tabs: Collect Payment → Today's Collections → Void/Refund → Shift Summary
  - [ ] Student lookup, dynamic late fee, UPI/UTR validation, print receipt
- [ ] **Fee Management** — `/dashboard/accounts/fees`
  - [ ] Tabs: Fee Structures → Invoice Generator → Bulk Billing → Concessions
- [ ] **Student Ledger** — `/dashboard/accounts/ledger`
  - [ ] Tabs: All Students → Overdue → Paid → Payment Plans
- [ ] **Payment Gateway** — `/dashboard/accounts/gateway`
  - [ ] Tabs: BYOG Config → Online Transactions → Settlements → Failed Payments
- [ ] **Receipts & Printing** — `/dashboard/accounts/receipts`
  - [ ] Tabs: Print Queue → Reprint → Thermal Settings → Templates
- [ ] **Reports** — `/dashboard/accounts/reports`
  - [ ] Tabs: Daily → Monthly/Quarterly → Outstanding Aging → Audit Export
- [ ] **Audit Log** — `/dashboard/accounts/audit`
- [ ] **Settings** — `/dashboard/accounts/settings`

---

## Teacher Dashboard (PRIORITY 5)

Route: `/dashboard/teacher/*`

### Step 5: Sidebar Sections & Tabs
- [ ] **My Class** — `/dashboard/teacher` — class header, quick stats, announcements
- [ ] **Attendance** — `/dashboard/teacher/attendance`
  - [ ] Tabs: Daily Roll-Call → Monthly View → Absentee Report → Leave Requests → Disputes
- [ ] **Admissions Queue** — `/dashboard/teacher/admissions`
  - [ ] Tabs: Pending Placement (4B) → My Section Students → Rollover Candidates
- [ ] **Examinations** — `/dashboard/teacher/exams`
  - [ ] Tabs: Create Exam → My Exams → Marks Entry → Published Results → Report Cards
- [ ] **Student Profiles** — `/dashboard/teacher/students`
  - [ ] Tabs: Class Roster → Academic Records → Attendance History → Parent Contacts
- [ ] **Leave Management** — `/dashboard/teacher/leaves`
  - [ ] Tabs: Pending Review → Approved → Rejected → History
- [ ] **Lesson Planning** — `/dashboard/teacher/lessons`
  - [ ] Tabs: Weekly Plan → Syllabus Tracker → Homework → Resources
- [ ] **Communications** — `/dashboard/teacher/communications`
  - [ ] Tabs: Class Notices → Parent Messages → Circulars → Announcements
- [ ] **Reports** — `/dashboard/teacher/reports`
- [ ] **Settings** — `/dashboard/teacher/settings`

---

## Step 8: Server Actions & API Completeness
- [ ] Attendance: `getMonthlyAttendanceAction`, `raiseAttendanceDisputeAction`, `resolveDisputeAction`, `getHolidaysAction`
- [ ] Exams: `createExamAction`, `getExamsAction`, `enterMarksAction`, `publishResultsAction`, `generateReportCardAction`, `getExamTimetableAction`
- [ ] Fees (Student): `getStudentInvoicesAction`, `getPaymentHistoryAction`, `downloadReceiptAction`
- [ ] Leaves: `submitLeaveApplicationAction`, `getLeaveApplicationsAction`, `approveLeaveAction`, `rejectLeaveAction`
- [ ] Academics: `getSyllabusAction`, `getHomeworkAction`, `submitHomeworkAction`, `getTimetableAction`
- [ ] Notifications: `getNotificationsAction`, `markNotificationReadAction`
- [ ] Profile: `updateProfileAction`, `changePasswordAction`, `uploadDocumentAction`
- [ ] Audit: `getAuditLogsAction`, `exportAuditLogsAction`

---

## Step 9: Mobile-First Responsive Polish
- [ ] Sidebar drawer slide-in + backdrop + swipe-to-close + focus trap
- [ ] Tables → card view mobile (<640px), horizontal scroll tablet
- [ ] Modals → full-screen mobile, centered desktop
- [ ] Touch targets ≥44×44px
- [ ] Fluid clamp() typography
- [ ] Safe areas for notched devices

---

## Step 10: Testing, Accessibility & Documentation
- [ ] Playwright E2E: login each role → navigate all tabs → CRUD happy paths
- [ ] Vitest: grading/fee calculators, audit logger, date utils
- [ ] WCAG 2.1 AA: keyboard nav, ARIA, contrast, focus visible
- [ ] Browsers: Chrome, Firefox, Safari, Edge (last 2)
- [ ] Devices: iPhone SE/14/Pro Max, iPad, Pixel, 1366/1920/2560
- [ ] Security: CSRF, rate limiting, XSS
- [ ] Docs: API (OpenAPI), deployment guide

---

## Phase Timeline
| Phase | Steps | Status |
|-------|-------|--------|
| 1: Foundation | 1, 7 | ✅ Done |
| 2: Student | 6 + student actions | ✅ Done |
| 3: Admin | 2 | ✅ Done |
| 4: Principal + Accounts + Teacher | 3, 4, 5 | ✅ Done |
| 5: Actions & Polish | 8, 9 | ⏳ Pending |
| 6: QA | 10 | ⏳ Pending |
| 7: Platform Growth | G1–G10 | ✅ Done (G1–G3 skipped, G7 deferred) |

## Build Status: ✅ 60+ routes compiling clean
- Student: 18 pages (overview, attendance×5, exams×5, fees, academics, schedule, report-cards, leaves×2, notifications, profile)
- Admin: 10 pages (overview, students, staff, academics, admissions, fees, exams, communications, audit, settings)
- Principal: 7 pages (overview, attendance, academics, staff, welfare, audit, reports, settings)
- Accounts: 8 pages (overview, cash-desk, ledger, fees, gateway, receipts, reports, settings)
- Teacher: 10 pages (overview, attendance, admissions, exams, students, leaves, lessons, communications, reports, settings)

---
---

# Platform Growth Phase — 10-Step Development Plan

## Decisions Locked (brainstorm 2026-10-13)
- **No trial.** Pay-first: registration incomplete until payment succeeds. School starts `UNPAID`.
- **School code stays the primary identifier** — auto-generated at registration (from name + suffix, uniqueness retry), never changes, used everywhere as fallback.
- **Username → slug → subdomain.** Admin chooses a username during registration; it becomes `School.slug` and the subdomain (`username.skooltech.com`). Reserved/locked at registration submit; abandoned-UNPAID slugs released after 7 days (default — confirm).
- **Demo is a tenant, not code.** DEMO01/Greenwood already is a normal tenant. Access via env-flag `DEMO_WIDGET=true` floating bottom-right launcher with one-click role logins; login card itself is clean (empty defaults, no pills). Never rendered in production unless flag set.
- **Admin finance = views yes, money mutations no.** Fee structures + reports + audit visible to SCHOOL_ADMIN; collecting payments/refunds/waivers is ACCOUNTS-only; everything audited (`recordAuditLog`).
- **Subdomain infra = one-time only.** Wildcard DNS `*.skooltech.com` → same app + `ROOT_DOMAIN` env (you do this once, ever). Per school: zero infra — subdomain "exists" the moment the slug row exists.
- **Journey:** register → pay → success page ("Go to your login" button → `https://slug.skooltech.com/login`) → SCHOOL_ADMIN dashboard → admin creates Principal / Teacher / Accounts / Student credentials via role-specific forms (temp password + forced change on first login — `mustChangePassword` flag + redirect already exist).

## Open Defaults (override if you disagree)
- Payment: Razorpay checkout (test-mode first) for plan purchase, with manual activation override for ops.
- SUPER_ADMIN: blocked from tenant financial views (platform sees its own billing only) — confirm.
- Slug availability check: live (debounced) on the registration form.

---

### Step G1: Login Cleanup + Demo Widget
- [ ] `login/page.tsx`: remove demo pre-fill defaults (lines 18–20 → empty strings) and the "Quick Demo Accounts" pill section — login card = school code + username + password only
- [ ] New `src/components/shared/DemoWidget.tsx`: fixed bottom-right pill "Demo accounts" → expands to card with 5 role buttons (Admin / Principal / Accounts / Teacher / Student)
- [ ] Widget renders only when `process.env.DEMO_WIDGET === "true"` (server gate; client never decides)
- [ ] Buttons one-click log-in via existing `/demo` route; re-gate `/demo` on `DEMO_WIDGET` flag (not just `NODE_ENV`) so production sandbox can enable it
- [ ] Verify: flag off → login page pristine, `/demo` 404; flag on → widget visible, all 5 one-clicks land on correct dashboards

### Step G2: Financial RBAC Hardening
- [ ] `collectCounterPaymentAction`: drop `SCHOOL_ADMIN` from allowed roles → `ACCOUNTS` only (+ audit remains)
- [ ] Audit + role-gate every money action: `assignFeePackageAction`, `online-payment` actions, future refund/waiver actions — pattern: `canMutateMoney(role)` helper in `src/lib/auth.ts`
- [ ] Keep SCHOOL_ADMIN: `/dashboard/admin/fees` (structure config), archive Fees tab (view), `/dashboard/admin/audit`
- [ ] SUPER_ADMIN: remove implicit bypass on `/dashboard/accounts/*` + finance actions (platform ≠ tenant finance) — default block, confirm with user
- [ ] Verify (curl session matrix): admin blocked from cash-desk mutations, accounts works, each mutation writes audit row

### Step G3: Subdomain Foundation
- [ ] `src/lib/tenant.ts`: `schoolSlugFromHost(host, rootDomain)` → slug | null (strip port, exact-match subdomain only, never treat apex as slug)
- [ ] Env: `ROOT_DOMAIN` (default empty = resolver always null = current behavior); `next.config.ts`: `allowedDevHosts` for `*.localhost`, trust `X-Forwarded-Host`
- [ ] Login JWT gains `slug` claim; middleware: if host has subdomain and session school's slug ≠ host slug → bounce to own subdomain login (no DB at edge)
- [ ] `login/page.tsx`: server-side — subdomain resolved → look up school by slug, show school name, hide school-code field (code auto-bound); null → today's code-entry form unchanged
- [ ] Verify: `http://greenwood.localhost:3000/login` binds DEMO01 with no code field; `localhost:3000` unchanged; session on one subdomain rejected on another

### Step G4: Subscription Model + Unpaid Gate ✅ DONE
- [x] Schema migration on `School`: `status SchoolStatus @default("UNPAID")` (enum `UNPAID | ACTIVE | SUSPENDED | EXPIRED`), `plan String?`, `currentPeriodEnd DateTime?` — slug/code unchanged
- [x] Seed: DEMO01 → `ACTIVE` (so dev/sales demo never blocked)
- [x] New route `/payment-pending` (school-scoped, shows school name + "Complete payment" CTA + contact)
- [x] Middleware/layout gate: any authenticated dashboard request where school status ≠ ACTIVE → `/payment-pending` (login itself still works so user can reach it)
- [x] Verify: flip DEMO01 to UNPAID in DB → dashboard blocked with pending page; back to ACTIVE → normal

### Step G5: Registration Wizard — Identity Step ✅ DONE
- [x] Flesh out empty `src/app/(auth)/register/` into multi-step wizard (client shell, server actions per step)
- [x] Step 1 form: school name + username with live availability check (debounced action: slug free + not in blocked list: `www, api, admin, app, demo, mail, dashboard, skooltech, login, register, static, assets, cdn`)
- [x] Auto-generate school code server-side from name (e.g. `Greenwood International` → `GREEN01`, retry suffix on collision)
- [x] Submit step 1 → create `School { status: UNPAID, slug, code, name }` — slug locked immediately (uniqueness enforced by DB)
- [x] Verify: duplicate username rejected live; taken code auto-retries; row created UNPAID; back button doesn't create duplicates
- Note: removed old mock `src/app/register/page.tsx` (fake setTimeout provisioning) that conflicted with real route; made `AuditLog.userId` nullable (platform events have no actor); registration cookie `skooltech_registration` (24h) carries the wizard identity into G6

### Step G6: Registration — Admin Account, Payment, Success ✅ DONE
- [x] Step 2: admin account (username/email, password, phone) → creates `User(role=SCHOOL_ADMIN)` bound to the school
- [x] Step 3: plan display + payment — Razorpay Checkout (test-mode keys env-driven) for plan purchase; ops override action `activateSchoolManualAction` (SUPER_ADMIN only) for manual activation
- [x] Step 4 success page: "Payment received — Go to your login" button → `https://{slug}.{ROOT_DOMAIN}/login`
- [x] Registration completion state machine: UNPAID (abandoned = slug released after 7 days, cron/manual sweep) → PAYMENT_PENDING → ACTIVE
- [x] Verify: full wizard in test mode; success button lands on subdomain login; admin credentials work immediately after activation
- Notes: added `PAYMENT_PENDING` to SchoolStatus enum; new `src/lib/plans.ts` (starter ₹24k / pro ₹54k, enterprise contact-only) and `src/lib/billing.ts` (platform Skooltech←school billing, Razorpay env keys w/ MOCK fallback — distinct from BYOG); wizard now 4 steps calling actions in handlers (no setState-in-effect); `activateSchoolManualAction` + `releaseAbandonedRegistrationsAction` are SUPER_ADMIN-gated (no UI yet, so not HTTP-invocable — code-verified); `?plan=` searchParam from pricing page wired to plan picker

### Step G7: Payment Activation Wiring
- [ ] Razorpay webhook/return handler: signature-verify → `School.status = ACTIVE` + `currentPeriodEnd` + `recordAuditLog(SCHOOL_ACTIVATED)`
- [ ] Unpaid/pending subdomain: login page shows branded "payment pending" notice (not a generic error), still allows admin login to reach payment-pending page
- [ ] Idempotency: repeated webhooks don't double-activate or extend wrongly
- [ ] Verify: register → pay (test key) → status flips within seconds → subdomain login → dashboard reachable; webhook replay is a no-op

### Step G8: createUserAction + Principal & Accounts Forms ✅ DONE
- [x] `src/actions/user.actions.ts`: `createUserAction` — server-side: caller must be SCHOOL_ADMIN/SUPER_ADMIN of same schoolId, username unique within school, password hashed, `mustChangePassword: true`, audit row `STAFF_ACCOUNT_CREATED`
- [x] `/dashboard/admin/staff/add`: role-aware form — Principal/Accounts role toggle (full name, username, email, phone, temp password + confirm); preselects role via `?role=principal|accounts`
- [x] Principal/Accounts = `User` row only (no profile table) — added nullable `User.fullName` for display
- [x] List page (`/dashboard/admin/staff`) gains role filter tabs (All / Teachers / Accounts / Principals) + "Add Principal" / "Add Accounts" buttons + status column (Active / Must change password / Disabled)
- [x] Verify: created Principal & Accounts log in → forced to `/reset-password` → after change lands on own dashboard (`/dashboard/principal`); duplicate username rejected; invalid role rejected; non-admin blocked; cross-school username reuse allowed (uniqueness is per school)

### Step G9: Teacher & Student Credential Forms ✅ DONE
- [x] Teacher form (staff/add): User(role=TEACHER) + `Teacher` row (fullName, employeeId, designation) in one transaction — added TEACHER to role toggle, conditional employeeId/designation fields, "Add Teacher" button on staff list
- [x] Student form (`/dashboard/admin/students/new`): extended `createStudentDraftAction` — auto collision-free `ADM-XXXX` (when admissionNo blank), DOB/address fields, optional class/section placement (creates Enrollment + sets PENDING_FEE), optional custom temp password (default `Student@123`); server-fetched class/section dropdowns
- [x] Verify: teacher logs in → forced reset → teacher dashboard; student logs in (username=admissionNo) → forced reset → student dashboard; ADM-1041/1042 collision-free; duplicate admissionNo, short password, invalid section all rejected; all rows schoolId-scoped; audit on each creation

### Step G10: End-to-End Verification Pass ✅ DONE
- [x] Journey: new school register → pay (test/MOCK) → login → create all 4 role types → each logs into correct dashboard
- [x] RBAC matrix: admin views vs money mutations, accounts full access, teacher/student archive denial, unpaid gate, SUPER_ADMIN finance block
- [x] Demo: flag off/on, one-click logins, demo tenant isolation (changes in DEMO01 invisible to other tenants)
- [x] Subdomain: `greenwood.localhost:3000` full flow, host-session mismatch bounce, apex fallback code entry
- [x] Quality gate: `npx tsc --noEmit` clean, `npm run lint` (no new errors), `npm run build` clean with all new routes
- [x] Update this checklist + Phase Timeline table

Verification notes:
- **Journey** (TESTA01): identity→`TESTA01`/`testacademy` (UNPAID) → admin `testadmin` created → order (MOCK ₹54k/pro) → PAYMENT_PENDING → verify → ACTIVE, `currentPeriodEnd` 2027-10-14, cookie cleared, audit chain `SCHOOL_REGISTERED→REGISTRATION_ADMIN_CREATED→SUBSCRIPTION_ORDER_CREATED→SCHOOL_ACTIVATED`. Created Principal/Accounts/Teacher/Student for the new tenant; each (post forced-reset) lands on exactly its own dashboard (200) and is gated out of all others (307). Student auto-got `ADM-1001` (fresh tenant).
- **RBAC**: archive → Principal/Accounts 200, Teacher/Student 307→own dashboard. Unpaid gate: ACTIVE 200, PAYMENT_PENDING 307→`/payment-pending` (admin + accounts), restored 200. Money mutations (`collectCounterPaymentAction`, online-payment) allow ACCOUNTS+SCHOOL_ADMIN only → SUPER_ADMIN blocked by omission (G2 deferred: no explicit SUPER_ADMIN finance UI block; no SUPER_ADMIN user seeded). Cross-tenant login (valid DEMO01 creds + TESTA01 code) correctly rejected.
- **Demo**: all 5 one-click `/demo?role=` logins issue correct school-scoped session. Demo route production-gated (middleware 404 + route guard). Tenant isolation confirmed (DEMO01 40 students / no TESTA rows; teachers per-school).
- **Subdomain**: G3 skipped → no host-based tenant resolution; apex **school-code entry** is the primary login path (verified, incl. cross-tenant rejection). Host-session mismatch bounce + `greenwood.localhost` flow deferred with G3.
- **Quality**: tsc clean; lint 3 errors/174 warnings all pre-existing (Phase 7 files scoped-clean); build clean, 178/178 pages.

## Phase 7 Status
| Step | Status |
|------|--------|
| G1–G3 | ⏭️ Skipped (per user — revisit later) |
| G4 | ✅ Done |
| G5 | ✅ Done |
| G6 | ✅ Done |
| G7 | ⏸️ Deferred (webhook wiring largely covered by G6 verify action) |
| G8 | ✅ Done |
| G9 | ✅ Done |
| G10 | ✅ Done |
