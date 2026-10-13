# 🏫 Skooltech — Multi-Tenant School Management SaaS (SIS)

> **Modern, High-Velocity Student Information System tailored for Indian K-12 Schools (CBSE / ICSE / State Boards)**

Skooltech is built from the ground up for the operational realities of Indian schools: 30-second teacher morning roll-calls, a 3-step staged admissions pipeline, counter cash desk operations with dynamic daily late fees and printable CBSE A4/thermal receipts, CBSE 9-point scale CCE report card generation, and **BYOG (Bring Your Own Gateway)** zero-liability direct bank settlements.

---

## 🚀 Live Demo & Sandbox Gateway

Visit the running application locally and test drive all 5 operational roles in under 10 seconds:

| User Role | Username / ID | Password | Direct 1-Click Sandbox Link |
| :--- | :--- | :--- | :--- |
| **School Administrator** | `admin_demo` | `DemoPass@123` | [1-Click Admin Access](http://localhost:3000/demo?role=admin) |
| **Principal** | `principal_demo` | `DemoPass@123` | [1-Click Principal Access](http://localhost:3000/demo?role=principal) |
| **Accounts / Cashier** | `accounts_demo` | `DemoPass@123` | [1-Click Accounts Access](http://localhost:3000/demo?role=accounts) |
| **Class Teacher** | `teacher_sharma` | `DemoPass@123` | [1-Click Teacher Access](http://localhost:3000/demo?role=teacher) |
| **Student / Parent** | `ADM-1001` | `Student@123` | [1-Click Student Access](http://localhost:3000/demo?role=student) |

*Pre-seeded School Code:* **`DEMO01`** (*Delhi Public Heritage School*)

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack, React Server Components & Server Actions)
- **Database & ORM:** PostgreSQL / Supabase with **Prisma ORM 6.19.3**
- **Authentication & RBAC:** Jose JWT signed HTTP-only cookies, Middleware route guards, Forced first-time password reset (`mustChangePassword`)
- **UI & Styling:** Tailwind CSS, `lucide-react`, Custom Radix primitives
- **Design Tokens:**
  - **Typography:** Poppins (`next/font/google`)
  - **Geometry:** Strict **4px border-radius** (`rounded-[4px]`) across cards, buttons, dialogs, inputs, and badges
  - **Palette:** Royal Blue (`#1D4ED8`), Deep Navy (`#1E3A8A`), Pure White (`#FFFFFF`)
  - **Theme:** Strictly **Light Mode Only** (Zero dark theme)
- **Currency:** Indian Rupee (**INR / ₹**) strictly formatted via `Intl.NumberFormat('en-IN')`

---

## 📦 Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/skooltech/skooltech.git
cd skooltech
npm install
```

### 2. Configure Environment Variables
Create `.env.local` using `.env.example`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skooltech?schema=public"
JWT_SECRET="skooltech-super-secret-development-jwt-key-32chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional Third-Party Services (Uses clean mock adapters if omitted):
# BREVO_API_KEY="your-brevo-api-key"
# RAZORPAY_KEY_ID="rzp_test_xxxx"
# RAZORPAY_KEY_SECRET="your-secret"
# CASHFREE_APP_ID="cf_app_xxxx"
# CASHFREE_SECRET_KEY="your-secret"
```

### 3. Initialize Database Schema & Seed Sandbox
```bash
# Push schema to database
npx prisma db push

# Seed 40 students, 5 teachers, attendance logs, and exam results
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧩 The 6 Core Modules of Skooltech V1

```mermaid
flowchart LR
    A[Admin Admissions Draft] --> B[Teacher Class & Roll Assignment]
    B --> C[Accounts Fee Package Setup]
    C --> D[Active Student Enrollment]
    D --> E[Daily Roll-Call & Biometrics]
    D --> F[Cash Desk & BYOG Payments]
    D --> G[CBSE 9-Point Report Cards]
```

### 1. Staged 3-Step Admissions Pipeline & Bulk Rollover
- **Step 4A (Admin):** Drafts student identity record (`PENDING_ACADEMIC`).
- **Step 4B (Class Teacher):** Assigns class section and roll number in the "My Class" queue (`PENDING_FEE`).
- **Step 4C (Accounts):** Assigns tuition, development, and lab fee packages (`ACTIVE`).
- **Annual Rollover Wizard:** 1-click bulk academic session rollover promoting eligible students (e.g., Class 5-A $\rightarrow$ Class 6-A) with alumni archiving.

### 2. Morning Roll-Call & Biometric Discrepancy Auditing
- **1-Click Roll-Call Ledger:** Class teachers take morning attendance in under 30 seconds via the **"Mark All Present"** button.
- **Biometric Ingestion REST Gateway (`/api/biometric-sync`):** Asynchronously ingests punch logs from hardware gate turnstiles.
- **Principal Cross-Check Ledger:** Flags gate-vs-rollcall discrepancies without blocking daily operations.

### 3. Counter Cash Desk & Dynamic Daily Late Fees
- **Pure Math Late Fee Engine (`src/lib/fee-calculator.ts`):** Dynamically calculates overdue penalties on read (`daysOverdue * ₹25/day`, capped at maximum limit) without database write lag.
- **Counter Collections:** Supports Cash, UPI (with 12-digit UTR validation), and Bank Drafts.
- **Voucher Printer:** Printable standard CBSE A4 receipts and 80mm POS thermal vouchers.

### 4. Spontaneous Examinations & CBSE 9-Point Scale Report Cards
- **Spontaneous Exams:** Class Teachers can create Unit Tests, Class Tests, Mid-Terms, or Annual Finals on demand.
- **Tabular Marks Entry:** Matrix view with live client-side percentage and CBSE grade badge calculation.
- **Evaluation Engine (`src/lib/grading-calculator.ts`):** Evaluates CBSE 9-point scale (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`, `D`, `E`), Percentage (%), and CGPA (10.0 or 5.0 scale).
- **Printable Report Cards:** High-fidelity A4 CBSE progress reports with attendance summaries, teacher remarks, and school stamps.

### 5. BYOG (Bring Your Own Gateway) Zero-Liability Payments
- **Direct Settlement:** Student fee funds deposit 100% directly into the school's bank account. Skooltech maintains zero financial custody.
- **Adapters (`src/lib/payments/`):**
  - `RazorpayPaymentGateway` (BYOG Merchant Keys with HMAC-SHA256 signature verification)
  - `CashfreePaymentGateway` (BYOG App ID & Secret)
  - `MockPaymentGateway` (Zero-config instant sandbox simulator)
- **Student Portal Pay Modal:** Parents can clear tuition fees online with 1 click.

### 6. Tamper-Proof Audit Trail
- **Append-Only Ledger (`src/lib/audit.ts`):** Records compliance-critical mutations (fee collections, mark changes, leave approvals, notices) into `audit_logs`.
- **Principal Inspection Viewer:** Searchable audit trail with JSON delta inspection modals.

---

## 🚢 Production Build Verification

Verify Turbopack and TypeScript compilation:
```bash
npm run build
```

Expected compilation output:
```text
✓ Compiled successfully in 3.1s
✓ Finished TypeScript in 9.8s
✓ Collecting page data (17/17)
✓ Generating static pages (17/17)
```

Routes successfully generated:
- `○ /` (Public Marketing Landing Page with 1-Click Role Sandbox)
- `○ /pricing` (Public Indian Rupee INR ₹ Packages & FAQ)
- `○ /about` (Mission & Indian K-12 Focus)
- `○ /contact` (Guided Demo & Consultation Intake)
- `○ /register` (New Institution Tenant Self-Provisioning)
- `○ /login` (Multi-Tenant Unified Role Portal Login)
- `○ /reset-password` (Forced First-Time Password Reset Flow)
- `ƒ /demo` (Multi-Role Sandbox Auto-Login Gateway)
- `ƒ /dashboard/admin` (School Admin Dashboard)
- `ƒ /dashboard/principal` (Principal & Biometric Discrepancy Hub)
- `ƒ /dashboard/accounts` (Counter Cash Desk & Fee Structures)
- `ƒ /dashboard/teacher` (My Class Roll-Call & Marks Matrix)
- `ƒ /dashboard/student` (Student & Parent Portal, Report Card & BYOG)
- `ƒ /api/biometric-sync` (Gate Hardware Ingestion Endpoint)

---

## 📄 License & Intellectual Property

Copyright &copy; 2026 Skooltech Technologies India Pvt Ltd. All rights reserved.
Developed strictly following Indian K-12 education standards (CBSE/ICSE/State Boards).
