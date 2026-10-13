import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  ArrowRight, 
  IndianRupee, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Sparkles 
} from "lucide-react";

export const metadata = {
  title: "Pricing Plans (INR ₹) | Skooltech SIS",
  description: "Transparent, predictable pricing in Indian Rupees for CBSE, ICSE, and State Board K-12 schools.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[4px] bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              S
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Skool<span className="text-blue-700">tech</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-700 transition">Overview</Link>
            <Link href="/pricing" className="text-blue-700 font-semibold">Pricing</Link>
            <Link href="/about" className="hover:text-blue-700 transition">About</Link>
            <Link href="/contact" className="hover:text-blue-700 transition">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Portal Login
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                1-Click Sandbox <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="default" className="text-xs font-medium uppercase px-3 py-1">
            Predictable Indian Rupee (₹) Pricing
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Simple, Transparent Plans for Every School
          </h1>
          <p className="text-base text-slate-600">
            Zero hidden transaction cuts. Zero platform custody fees. Every plan includes full access to our multi-tenant architecture and BYOG payment integrations.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Tier 1: Primary */}
          <Card className="flex flex-col justify-between border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <Badge variant="secondary" className="w-fit text-[11px] mb-2">Primary Schools</Badge>
              <CardTitle className="text-xl font-bold text-slate-900">Standard Starter</CardTitle>
              <CardDescription className="text-xs">Ideal for standalone primary or feeder schools up to 250 students.</CardDescription>
              <div className="pt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">₹24,000</span>
                <span className="text-xs text-slate-500 font-medium">/ year</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">₹2,000/month billed annually</p>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 border-t border-slate-100 flex-1 flex flex-col justify-between">
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Up to 250 Active Students</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>3-Step Admissions Pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Teacher 1-Click Roll-Call Ledger</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Cash Desk & A4/Thermal Receipts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>CBSE 9-Point Report Card Generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Email Support (48h turnaround)</span>
                </li>
              </ul>

              <Link href="/register?plan=starter" className="block pt-4">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tier 2: Pro (Popular) */}
          <Card className="flex flex-col justify-between border-blue-600 ring-2 ring-blue-600 bg-white relative shadow-lg">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge className="bg-blue-700 text-white text-[11px] font-bold px-3 py-0.5 shadow-sm">
                MOST POPULAR FOR CBSE / ICSE
              </Badge>
            </div>

            <CardHeader className="pb-4 pt-6">
              <Badge variant="default" className="w-fit text-[11px] mb-2">Complete K-12 Solution</Badge>
              <CardTitle className="text-xl font-bold text-slate-900">Campus Growth Pro</CardTitle>
              <CardDescription className="text-xs">Comprehensive operations for senior secondary schools up to 750 students.</CardDescription>
              <div className="pt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-700">₹54,000</span>
                <span className="text-xs text-slate-500 font-medium">/ year</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">₹4,500/month billed annually</p>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 border-t border-slate-100 flex-1 flex flex-col justify-between">
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2 font-medium text-slate-900">
                  <Check className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Up to 750 Active Students</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Hardware Biometric Ingestion Gateway</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Principal Gate Discrepancy Cross-Check</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>BYOG Payment Gateway (Razorpay & Cashfree)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Brevo Transactional SMS & Email Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Tamper-Proof Audit Trail</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>Priority WhatsApp & Phone Support</span>
                </li>
              </ul>

              <Link href="/register?plan=pro" className="block pt-4">
                <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold">
                  Choose Campus Growth <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tier 3: Enterprise */}
          <Card className="flex flex-col justify-between border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <Badge variant="secondary" className="w-fit text-[11px] mb-2">School Chains & Trusts</Badge>
              <CardTitle className="text-xl font-bold text-slate-900">Institutional Chain</CardTitle>
              <CardDescription className="text-xs">Multi-branch institutional governance for trusts with 1,000+ students.</CardDescription>
              <div className="pt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">₹1,20,000</span>
                <span className="text-xs text-slate-500 font-medium">/ year</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Billed annually • Includes setup advisor</p>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 border-t border-slate-100 flex-1 flex flex-col justify-between">
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Students & Multi-Campus</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Multi-Tenant Centralized Trust Dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dedicated BYOG Gateway Implementation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Custom Report Card Watermark & Branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Technical Account Manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>99.9% Uptime Service Level Agreement</span>
                </li>
              </ul>

              <Link href="/contact" className="block pt-4">
                <Button variant="outline" className="w-full">Talk to an Advisor</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="bg-white rounded-[4px] border border-slate-200 p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Core Feature Comparison</h3>
            <p className="text-xs text-slate-500">Every feature is designed around Indian school workflows and CBSE compliance.</p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-700 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Capability</th>
                  <th className="py-3 px-4 text-center">Standard Starter</th>
                  <th className="py-3 px-4 text-center">Campus Growth Pro</th>
                  <th className="py-3 px-4 text-center">Institutional Chain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Currency & Financial System</td>
                  <td className="py-3 px-4 text-center font-mono">INR (₹)</td>
                  <td className="py-3 px-4 text-center font-mono text-blue-700 font-bold">INR (₹)</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">INR (₹)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">BYOG (Bring Your Own Gateway)</td>
                  <td className="py-3 px-4 text-center text-slate-400">&mdash;</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Razorpay / Cashfree</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Custom Gateway</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Daily Attendance Roll-Call</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">1-Click Fast Grid</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">1-Click Fast Grid</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">1-Click Fast Grid</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Biometric Gate Hardware Sync</td>
                  <td className="py-3 px-4 text-center text-slate-400">&mdash;</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">REST Sync API</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">Multi-Gate Sync API</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Report Card Engine</td>
                  <td className="py-3 px-4 text-center">CBSE 9-Point Scale</td>
                  <td className="py-3 px-4 text-center font-bold text-blue-700">CBSE / CGPA / %</td>
                  <td className="py-3 px-4 text-center font-bold">Custom Board Formats</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Audit Trail Retention</td>
                  <td className="py-3 px-4 text-center">90 Days</td>
                  <td className="py-3 px-4 text-center font-bold text-blue-700">Permanent Append-Only</td>
                  <td className="py-3 px-4 text-center font-bold">Permanent Append-Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Indian School FAQ */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Key questions from school trustees, accountants, and principals.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-[4px] bg-white border border-slate-200 text-xs space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-700" />
                Does Skooltech deduct a percentage commission on student fees?
              </h4>
              <p className="text-slate-600 leading-relaxed pl-6">
                <strong>No. Never.</strong> We operate strictly on a <strong>Bring Your Own Gateway (BYOG)</strong> model. When parents pay fees online, 100% of the settlement deposits directly into your school&apos;s verified bank account via your own Razorpay or Cashfree account.
              </p>
            </div>

            <div className="p-4 rounded-[4px] bg-white border border-slate-200 text-xs space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-700" />
                What happens if the school biometric machine or internet goes down?
              </h4>
              <p className="text-slate-600 leading-relaxed pl-6">
                Your daily routine is never disrupted. Manual teacher roll-call in the <strong>&ldquo;My Class&rdquo;</strong> tab is our primary attendance source. Biometric punches sync asynchronously whenever connectivity resumes, and discrepancies are flagged in the Principal dashboard.
              </p>
            </div>

            <div className="p-4 rounded-[4px] bg-white border border-slate-200 text-xs space-y-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-blue-700" />
                Can we print receipts on our existing thermal receipt machines?
              </h4>
              <p className="text-slate-600 leading-relaxed pl-6">
                Yes. Our Cash Desk fee receipts are specifically formatted to support both standard 80mm POS thermal slip printers and official CBSE A4 full-page vouchers.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Skooltech SIS</span>
            <span>•</span>
            <span>Currency: INR (₹)</span>
            <span>•</span>
            <span>CBSE / ICSE Compliant</span>
          </div>
          <div>&copy; {new Date().getFullYear()} Skooltech Technologies India Pvt Ltd. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
