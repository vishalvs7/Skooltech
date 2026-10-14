import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  IndianRupee, 
  Users, 
  CalendarCheck2, 
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  CreditCard,
  History,
  Lock,
  Cpu
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[4px] bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Skool<span className="text-blue-700">tech</span>
            </span>
            <Badge variant="default" className="hidden sm:inline-flex ml-1 text-[10px]">
              V1 Enterprise SaaS
            </Badge>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="text-blue-700 font-semibold">Overview</Link>
            <Link href="/pricing" className="hover:text-blue-700 transition">Pricing</Link>
            <Link href="/about" className="hover:text-blue-700 transition">About</Link>
            <Link href="/contact" className="hover:text-blue-700 transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Portal Login
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">
                <span>1-Click Sandbox</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-20 py-12">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-blue-900 bg-blue-50 border-blue-200">
            <Sparkles className="h-3.5 w-3.5 text-blue-700" />
            Designed specifically for Indian K-12 Schools (CBSE / ICSE / State Boards)
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Intelligent Multi-Tenant SIS <br />
            <span className="text-blue-700">Engineered for Indian Campuses</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Eliminate administrative bottlenecks with a 3-step admissions pipeline, 30-second teacher morning roll-call, counter cash desk with dynamic daily late fees, CBSE 9-point report cards, and BYOG direct bank settlements.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <Link href="/demo">
              <Button size="lg" className="px-6 bg-blue-700 hover:bg-blue-800 text-white font-medium shadow-sm">
                Explore Demo (School: DEMO01) <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="px-6 font-medium">
                View Pricing Plans
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="px-6 font-medium">
                Register New School
              </Button>
            </Link>
          </div>
        </section>

        {/* 1-Click Interactive Role Launchpad */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              1-Click Role Sandbox Gateway
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Test drive all 5 operational roles on our pre-seeded demonstration school (&ldquo;Delhi Public Heritage School&rdquo;). No login required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* School Admin */}
            <Link href="/demo?role=admin" className="group">
              <Card className="h-full border-slate-200 hover:border-blue-600 hover:shadow-md transition bg-white text-left">
                <CardHeader className="pb-2">
                  <div className="h-9 w-9 rounded-[4px] bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">School Admin</CardTitle>
                  <CardDescription className="text-[11px]">Admissions & Rollover</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs font-semibold text-blue-700 group-hover:underline flex items-center gap-1">
                    Enter Portal <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Principal */}
            <Link href="/demo?role=principal" className="group">
              <Card className="h-full border-slate-200 hover:border-blue-600 hover:shadow-md transition bg-white text-left">
                <CardHeader className="pb-2">
                  <div className="h-9 w-9 rounded-[4px] bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">Principal</CardTitle>
                  <CardDescription className="text-[11px]">Audit & Biometrics</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs font-semibold text-indigo-700 group-hover:underline flex items-center gap-1">
                    Enter Portal <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Accounts */}
            <Link href="/demo?role=accounts" className="group">
              <Card className="h-full border-slate-200 hover:border-blue-600 hover:shadow-md transition bg-white text-left">
                <CardHeader className="pb-2">
                  <div className="h-9 w-9 rounded-[4px] bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">Accounts</CardTitle>
                  <CardDescription className="text-[11px]">Cash Desk & Vouchers</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs font-semibold text-emerald-700 group-hover:underline flex items-center gap-1">
                    Enter Portal <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Class Teacher */}
            <Link href="/demo?role=teacher" className="group">
              <Card className="h-full border-slate-200 hover:border-blue-600 hover:shadow-md transition bg-white text-left">
                <CardHeader className="pb-2">
                  <div className="h-9 w-9 rounded-[4px] bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">Class Teacher</CardTitle>
                  <CardDescription className="text-[11px]">Roll-Call & Grading</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs font-semibold text-amber-700 group-hover:underline flex items-center gap-1">
                    Enter Portal <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Student & Parent */}
            <Link href="/demo?role=student" className="group">
              <Card className="h-full border-slate-200 hover:border-blue-600 hover:shadow-md transition bg-white text-left">
                <CardHeader className="pb-2">
                  <div className="h-9 w-9 rounded-[4px] bg-rose-100 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">Student & Parent</CardTitle>
                  <CardDescription className="text-[11px]">Report Card & BYOG</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs font-semibold text-rose-700 group-hover:underline flex items-center gap-1">
                    Enter Portal <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Video Tour Placeholder */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="rounded-[4px] border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <Badge variant="outline" className="text-[10px] font-mono text-blue-700 uppercase">
                Interactive Walkthrough
              </Badge>
              <h3 className="text-lg font-bold text-slate-900">
                Watch the 2-Minute Skooltech V1 Architecture Tour
              </h3>
              <p className="text-xs text-slate-600 max-w-md">
                See how multi-tenant isolation, morning roll-call, counter cash desk, and printable CBSE report cards work together in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/demo">
                <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2">
                  <Play className="h-4 w-4 fill-white" />
                  <span>Interactive Walkthrough</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 6 Key Modules Feature Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              The 6 Core Engines of Skooltech
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Complete end-to-end functionality built to production standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module 1: 3-Step Admissions */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="h-9 w-9 rounded-[4px] bg-blue-100 text-blue-700 flex items-center justify-center mb-1">
                  <Building2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">3-Step Admissions Pipeline</CardTitle>
                <CardDescription className="text-xs">
                  Staged lifecycle: Admin draft &rarr; Teacher section & roll assignment &rarr; Accounts fee structure setup &rarr; Active enrollment. Includes 1-click batch annual rollover.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Module 2: Attendance Roll-Call */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="h-9 w-9 rounded-[4px] bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                  <CalendarCheck2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">1-Click Attendance Ledger</CardTitle>
                <CardDescription className="text-xs">
                  Teachers take daily roll-call in under 30 seconds via &ldquo;Mark All Present&rdquo; button, with hardware gate biometric cross-checking and Principal discrepancy auditing.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Module 3: Counter Cash Desk */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="h-9 w-9 rounded-[4px] bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">Counter Cash Desk & Receipts</CardTitle>
                <CardDescription className="text-xs">
                  Fast student lookup by admission number, dynamic daily late fees computed on read, Cash / UPI UTR / Bank Draft settlement, and printable 80mm thermal & CBSE A4 receipts.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Module 4: CBSE Report Cards */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="h-9 w-9 rounded-[4px] bg-purple-100 text-purple-700 flex items-center justify-center mb-1">
                  <Award className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">CBSE 9-Point Scale & CCE</CardTitle>
                <CardDescription className="text-xs">
                  Spontaneous exam scheduling, teacher tabular marks entry, live CBSE grade point calculation (A1 to E), and downloadable printable official student progress report cards.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Module 5: BYOG Payments */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="h-9 w-9 rounded-[4px] bg-blue-100 text-blue-700 flex items-center justify-center mb-1">
                  <CreditCard className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">BYOG Payment Gateway</CardTitle>
                <CardDescription className="text-xs">
                  Zero financial custody on platform. School admins configure their own Razorpay / Cashfree merchant credentials with 100% direct bank deposit and mock sandbox fallback.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Module 6: Tamper-Proof Audit */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="h-9 w-9 rounded-[4px] bg-rose-100 text-rose-700 flex items-center justify-center mb-1">
                  <History className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900">Tamper-Proof Audit Trail</CardTitle>
                <CardDescription className="text-xs">
                  Append-only immutable audit logging for fee settlements, marks revisions, attendance adjustments, and notice broadcasts with inspectable JSON delta verification.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-[4px] bg-blue-700 text-white font-bold flex items-center justify-center text-sm">
                S
              </div>
              <span className="font-bold text-slate-900 text-sm">Skooltech SIS</span>
              <span>&mdash;</span>
              <span>Next-Gen Multi-Tenant School Management</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/pricing" className="hover:text-blue-700">Pricing</Link>
              <Link href="/about" className="hover:text-blue-700">About Us</Link>
              <Link href="/contact" className="hover:text-blue-700">Contact</Link>
              <Link href="/register" className="hover:text-blue-700">Register</Link>
              <Link href="/login" className="hover:text-blue-700">Login</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6 text-[11px] text-slate-400 gap-2">
            <div>&copy; {new Date().getFullYear()} Skooltech Technologies India Pvt Ltd. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>All prices in Indian Rupees</span>
              <span>Geometry: Strict 4px Radius</span>
              <span>Theme: Light Mode Only</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
