# Skooltech — Technical Specification & Development Guide

## 1. Complete Technology Stack

| Layer / Category | Technology | Rationale & Usage |
|---|---|---|
| **Framework** | **Next.js (App Router, React, TypeScript)** | Full-stack unified framework. Fast server-side rendering, API route handlers, and type-safe Server Actions. |
| **Styling & Components** | **Tailwind CSS + shadcn/ui + Radix UI** | Accessible, clean, customizable UI component library with zero runtime bloat. |
| **Icons** | **Lucide React** | Consistent, crisp iconography across all dashboards. |
| **Database** | **PostgreSQL (Hosted on Supabase)** | Relational engine supporting Row-Level Security (RLS) for multi-tenant isolation, JSONB columns for audit logs, and high concurrency. |
| **ORM** | **Prisma ORM** | 100% free and open-source. Type-safe database queries, schema-first design, automated migration tracking, and seamless Supabase integration. |
| **Authentication & Session** | **Custom JWT / Supabase Auth with Session Cookies** | Manages multi-tenant claims (`school_id`, `role`, `must_change_password`). Supports tenant switching from school code to subdomain. |
| **Email & Notifications** | **Brevo (formerly Sendinblue) Node SDK** | Transactional email delivery for fee receipts, student absence alerts, and fee default notices. Supports future WhatsApp Cloud API expansion. |
| **Object / File Storage** | **Supabase Storage (S3-compatible)** | Secure cloud bucket for student photo uploads, medical certificates for leave requests, and school logos. |
| **Document Generation** | **CSS `@media print` & PDF Generators** | Fast, high-fidelity browser printing for standard 80mm thermal receipts and A4 report cards. |
| **Hosting & Deployment** | **Vercel** | Seamless Next.js deployment, edge network caching, zero-config CI/CD from Git. |

---

## 2. Recommended Project Folder Structure

```
Skooltech/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── prisma/
│   ├── schema.prisma               # Master database schema definition
│   └── migrations/                 # Version-controlled SQL migrations
├── specs/
│   ├── masterplan.md               # Product architecture & V1 feature plan
│   └── development.md              # Technical stack & engineering guidelines
├── public/
│   ├── images/
│   └── icons/
└── src/
    ├── actions/                    # Next.js Server Actions (Mutations)
    │   ├── auth.actions.ts
    │   ├── attendance.actions.ts
    │   ├── fee.actions.ts
    │   ├── exam.actions.ts
    │   └── student.actions.ts
    ├── app/                        # App Router (Pages & Layouts)
    │   ├── layout.tsx              # Root HTML layout with Poppins font setup
    │   ├── (marketing)/            # Public-Facing Marketing Website
    │   │   ├── layout.tsx          # Marketing Navbar & Footer
    │   │   ├── page.tsx            # Hero, Value Props, Interactive Demo Link
    │   │   ├── about/page.tsx      # About Skooltech mission & Indian school focus
    │   │   ├── pricing/page.tsx    # Transparent pricing in INR (₹)
    │   │   ├── contact/page.tsx    # "Book a Guided Demo" & Inquiry form
    │   │   ├── register/page.tsx   # School Admin Registration & Onboarding intake
    │   │   └── demo/page.tsx       # 1-Click Sandbox Auto-Login Gateway (DEMO01)
    │   ├── (auth)/                 # Authentication Routes
    │   │   ├── login/page.tsx      # Unified multi-tenant login (School Code + User + Pass)
    │   │   └── reset-password/page.tsx # Forced first-time password reset
    │   ├── (dashboard)/            # Role-gated school portals (Royal Blue + White)
    │   │   ├── admin/              # School Admin Portal
    │   │   ├── principal/          # Principal Portal (Metrics & Audit)
    │   │   ├── accounts/           # Accounts & Cash Collection Desk
    │   │   ├── teacher/            # Teacher & "My Class" Hub
    │   │   └── student/            # Student / Parent Portal
    │   └── api/                    # Webhooks & REST endpoints
    │       ├── biometric-sync/     # Endpoint for gate biometric push logs
    │       └── health/
    ├── components/                 # Reusable UI components
    │   ├── ui/                     # shadcn/ui components (Button, Modal, etc.)
    │   ├── shared/                 # Navbar, Sidebar, PageHeader
    │   ├── accounts/               # Cash modal, Receipt print template
    │   ├── attendance/             # Daily roll-call toggle grid
    │   └── exams/                  # Marks entry tables & report cards
    ├── lib/                        # Core utilities & shared helpers
    │   ├── prisma.ts               # Global Prisma client instance
    │   ├── auth.ts                 # Token verification & session decoding
    │   ├── audit.ts                # Reusable audit logging helper
    │   ├── brevo.ts                # Transactional email dispatcher
    │   └── utils.ts                # Formatting helpers (Currency ₹, dates)
    ├── middleware.ts               # Multi-tenant routing & RBAC protection
    └── types/                      # Shared TypeScript interfaces & types
        └── index.ts
```

---

## 3. Database Schema Blueprint (Prisma Models)

Below is the initial conceptual Prisma schema mapping out the core entities:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -------------------------------------------------------------
// Multi-Tenant Core
// -------------------------------------------------------------
model School {
  id               String            @id @default(uuid())
  code             String            @unique // e.g. "DPS01"
  slug             String            @unique // e.g. "dps-delhi" for subdomains
  name             String
  affiliationNo    String?           // CBSE / State Board Code
  address          String?
  phone            String?
  email            String?
  logoUrl          String?
  currency         String            @default("INR")
  paymentGateway   String?           // "RAZORPAY", "CASHFREE", or "MOCK"
  paymentKeyId     String?           // BYOG Merchant Key ID
  paymentSecret    String?           // Encrypted BYOG Merchant Secret
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  users            User[]
  sessions         AcademicSession[]
  classes          Class[]
  feeStructures    FeeStructure[]
  auditLogs        AuditLog[]
  notices          Notice[]
}

model AcademicSession {
  id          String       @id @default(uuid())
  schoolId    String
  name        String       // e.g. "2026-2027"
  startDate   DateTime
  endDate     DateTime
  isCurrent   Boolean      @default(false)
  school      School       @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  enrollments Enrollment[]

  @@unique([schoolId, name])
}

// -------------------------------------------------------------
// Authentication & RBAC
// -------------------------------------------------------------
enum UserRole {
  SUPER_ADMIN
  SCHOOL_ADMIN
  PRINCIPAL
  ACCOUNTS
  TEACHER
  STUDENT
}

model User {
  id                 String     @id @default(uuid())
  schoolId           String
  username           String
  passwordHash       String
  role               UserRole
  email              String?
  phone              String?
  mustChangePassword Boolean    @default(true)
  isActive           Boolean    @default(true)
  createdAt          DateTime   @default(now())

  school             School     @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  teacherProfile     Teacher?
  studentProfile     Student?
  auditLogs          AuditLog[]

  @@unique([schoolId, username])
}

// -------------------------------------------------------------
// Academic Structure & Classes
// -------------------------------------------------------------
model Class {
  id          String       @id @default(uuid())
  schoolId    String
  name        String       // e.g. "Class 6"
  school      School       @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  sections    Section[]
}

model Section {
  id             String       @id @default(uuid())
  classId        String
  name           String       // e.g. "A"
  classTeacherId String?      @unique
  class          Class        @relation(fields: [classId], references: [id], onDelete: Cascade)
  classTeacher   Teacher?     @relation("ClassTeacherSection", fields: [classTeacherId], references: [id])
  enrollments    Enrollment[]
}

model Teacher {
  id                  String             @id @default(uuid())
  userId              String             @unique
  fullName            String
  user                User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  managedSection      Section?           @relation("ClassTeacherSection")
}

// -------------------------------------------------------------
// Student Profile & Enrollment Lifecycle
// -------------------------------------------------------------
enum StudentStatus {
  PENDING_ACADEMIC   // Created by Admin
  PENDING_FEE        // Assigned by Class Teacher
  ACTIVE             // Configured by Accounts
  ALUMNI
  WITHDRAWN
}

model Student {
  id            String             @id @default(uuid())
  userId        String             @unique
  schoolId      String
  admissionNo   String             // Unique identifier per school
  fullName      String
  dateOfBirth   DateTime?
  gender        String?
  parentName    String?
  parentPhone   String?
  parentEmail   String?
  status        StudentStatus      @default(PENDING_ACADEMIC)

  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  enrollments   Enrollment[]
  feeInvoices   FeeInvoice[]
  leaves        LeaveApplication[]

  @@unique([schoolId, admissionNo])
}

model Enrollment {
  id          String          @id @default(uuid())
  studentId   String
  sessionId   String
  sectionId   String
  rollNo      String?
  student     Student         @relation(fields: [studentId], references: [id], onDelete: Cascade)
  session     AcademicSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  section     Section         @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  attendance  Attendance[]
  examResults ExamResult[]

  @@unique([studentId, sessionId])
}

// -------------------------------------------------------------
// Daily Attendance & Biometric
// -------------------------------------------------------------
enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

model Attendance {
  id           String           @id @default(uuid())
  enrollmentId String
  date         DateTime         @db.Date
  status       AttendanceStatus @default(PRESENT)
  markedById   String
  enrollment   Enrollment       @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)

  @@unique([enrollmentId, date])
}

// -------------------------------------------------------------
// Accounts & Fee Management
// -------------------------------------------------------------
enum FeeBillingCycle {
  MONTHLY
  QUARTERLY
}

enum PaymentMethod {
  CASH
  UPI
  BANK_DRAFT
}

model FeeStructure {
  id           String          @id @default(uuid())
  schoolId     String
  name         String          // e.g. "Primary Standard Fee"
  cycle        FeeBillingCycle @default(MONTHLY)
  amount       Decimal         @db.Decimal(10, 2)
  lateFeePerDay Decimal        @default(10.00) @db.Decimal(10, 2)
  lateFeeCap   Decimal         @default(500.00) @db.Decimal(10, 2)
  school       School          @relation(fields: [schoolId], references: [id], onDelete: Cascade)
}

model FeeInvoice {
  id           String               @id @default(uuid())
  studentId    String
  title        String               // e.g. "Quarter 1 (April-June) Fee"
  baseAmount   Decimal              @db.Decimal(10, 2)
  dueDate      DateTime
  isPaid       Boolean              @default(false)
  student      Student              @relation(fields: [studentId], references: [id], onDelete: Cascade)
  transactions PaymentTransaction[]
}

model PaymentTransaction {
  id             String        @id @default(uuid())
  invoiceId      String
  receiptNo      String        @unique // e.g. "RCP-2026-0001"
  amountPaid     Decimal       @db.Decimal(10, 2)
  lateFeeCharged Decimal       @default(0.00) @db.Decimal(10, 2)
  paymentMethod  PaymentMethod
  referenceNo    String?       // UPI UTR or Draft Number
  bankName       String?       // For Bank Drafts
  collectedById  String
  createdAt      DateTime      @default(now())

  invoice        FeeInvoice    @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
}

// -------------------------------------------------------------
// Examinations & Grading
// -------------------------------------------------------------
model Exam {
  id          String       @id @default(uuid())
  schoolId    String
  name        String       // e.g. "Unit Test 1"
  examType    String       // "Unit Test", "Half-Yearly", "Annual"
  date        DateTime?
  results     ExamResult[]
}

model ExamResult {
  id           String     @id @default(uuid())
  examId       String
  enrollmentId String
  subject      String     // e.g. "Mathematics"
  totalMarks   Decimal    @db.Decimal(5, 2)
  obtainedMarks Decimal   @db.Decimal(5, 2)

  exam         Exam       @relation(fields: [examId], references: [id], onDelete: Cascade)
  enrollment   Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
}

// -------------------------------------------------------------
// Leaves, Notices & Audit Trail
// -------------------------------------------------------------
model LeaveApplication {
  id          String   @id @default(uuid())
  studentId   String
  startDate   DateTime
  endDate     DateTime
  reason      String
  documentUrl String?  // Uploaded medical slip
  status      String   @default("PENDING") // PENDING, APPROVED, REJECTED
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
}

model Notice {
  id        String   @id @default(uuid())
  schoolId  String
  title     String
  content   String
  targetRole String  @default("ALL")
  createdAt DateTime @default(now())
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
}

model AuditLog {
  id         String   @id @default(uuid())
  schoolId   String
  userId     String
  userRole   String
  action     String   // e.g. "COLLECT_FEE", "UPDATE_MARKS"
  entityType String
  entityId   String
  oldValues  Json?
  newValues  Json?
  createdAt  DateTime @default(now())

  school     School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 4. Environment Variables Specification (`.env.example`)

```env
# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase PostgreSQL Database (Connection Pooling & Direct)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"

# Supabase Authentication & Storage
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."

# Authentication Secret
JWT_SECRET="super-secret-jwt-key-replace-in-production"

# Transactional Email (Brevo)
BREVO_API_KEY="xkeysib-..."
BREVO_SENDER_EMAIL="notifications@skooltech.in"
BREVO_SENDER_NAME="Skooltech Alerts"
```

---

## 5. Development Workflow & Getting Started

### 5.1 Project Setup Commands
```bash
# 1. Install project dependencies
npm install

# 2. Install UI primitives & icons
npm install lucide-react clsx tailwind-merge class-variance-authority

# 3. Initialize Prisma Client
npx prisma generate

# 4. Push schema migrations to Supabase
npx prisma migrate dev --name init_multi_tenant_schema

# 5. Start development server
npm run dev
```

### 5.2 Coding & Engineering Standards
1. **Multi-Tenant Safety:** Always extract `schoolId` from the verified session context on the server side. Never trust `schoolId` passed blindly in client request bodies.
2. **Audit Logging Rule:** Any mutation modifying marks, attendance after submission, or financial balances must invoke `lib/audit.ts` before returning a response.
3. **Receipt Number Formatting:** Maintain sequential formatting in the format `RCP-{YYYY}-{0001}` scoped per school.

---

## 6. Design System & UI Styling Guidelines

### 6.1 Typography & Geometry Standards
* **Primary Font Family:** **Poppins** (imported via `next/font/google`). Clean, modern geometric sans-serif ensuring crisp legibility across numbers, tables, and reports.
* **Component Border Radius:** Strictly **4px (`--radius: 0.25rem` / Tailwind `rounded-[4px]`)**.
  * Applied uniformly across **cards, buttons, input fields, dropdowns, and modal dialogs**.
  * Produces a sharp, structured, and institutional appearance without overly rounded "bubbly" aesthetics.

### 6.2 Core Visual Philosophy
* **Minimalist & Functional:** No unnecessary colors, decorative gradients, or visual clutter. The UI is clean, functional, and fast.
* **Theme Mode:** **Strictly Light Theme Only (No Dark Theme)**. A pure white canvas ensures optimal daytime readability for office staff and matches physical printed receipts and report cards.
* **Primary Palette:** **Royal Blue and Pure White**, with darker shades of blue utilized where contrast, depth, and interactive states are needed.

### 6.3 Palette Specification

| Token / Element | Color / Shade | Usage & Rules |
|---|---|---|
| **Background (Canvas)** | **Pure White (`#FFFFFF`)** | Default background for all dashboards, page containers, cards, tables, and modals. Zero dark mode. |
| **Primary Brand / Action** | **Royal Blue (`#1D4ED8` / `blue-700`)** | Action buttons, banners, active navigation items, key toggles, and primary highlights. |
| **Dark Blue (Depth & Hover)** | **Deep Navy Blue (`#1E3A8A` / `blue-900`)** | Button hover states, active pressed states, primary headings, and high-contrast typography. |
| **Subtle Accent / Borders** | **Muted Sky Blue (`#BFDBFE` / `blue-200`)** | Input focus rings, selected card borders, and subtle banner tints. |
| **Dividers & Table Lines** | **Clean Light Gray (`#E2E8F0` / `slate-200`)** | Table borders, card dividers, and form separators. |

### 6.4 Role-Based Accents (Future Expansion)
* Different user roles (`Admin`, `Principal`, `Accounts`, `Teacher`, `Student`) will feature subtle, dedicated color-coded badges to provide instant role context.
* Specific role color assignments are deferred and will be finalized during the portal UI implementation phase.


