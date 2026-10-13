import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  Award, 
  Sparkles, 
  Compass, 
  HeartHandshake 
} from "lucide-react";

export const metadata = {
  title: "About Us | Skooltech SIS",
  description: "Designed specifically for Indian K-12 schools, CBSE/ICSE boards, and institutional trusts.",
};

export default function AboutPage() {
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
            <Link href="/pricing" className="hover:text-blue-700 transition">Pricing</Link>
            <Link href="/about" className="text-blue-700 font-semibold">About</Link>
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

      {/* Hero Section */}
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <Badge variant="default" className="text-xs uppercase font-medium px-3 py-1">
            Built for Indian K-12 Education
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Empowering Indian Schools with <br />
            <span className="text-blue-700">Intelligent, Zero-Friction Operations</span>
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Most school software in India is cluttered, slow, and built on outdated legacy architectures. Skooltech was engineered from day one for Indian operational realities: CBSE/ICSE grading, counter cash desks, and BYOG financial settlements.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-[4px] bg-blue-100 flex items-center justify-center text-blue-700">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Teacher-First Ergonomics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teachers shouldn&apos;t spend 15 minutes of assembly time taking attendance. Our &ldquo;My Class&rdquo; ledger offers a 1-click &ldquo;Mark All Present&rdquo; button, reducing roll-call to 30 seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-[4px] bg-emerald-100 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Zero Financial Custody (BYOG)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We believe SaaS platforms should never hold school money. With our Bring Your Own Gateway model, 100% of student fee funds deposit directly into your institution&apos;s bank account.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-[4px] bg-purple-100 flex items-center justify-center text-purple-700">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">CBSE CCE & Board Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Native support for CBSE 9-point grading (A1 to E), flexible CGPA formulas, quarterly billing schedules, and formatted thermal/A4 receipt vouchers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Commitment Banner */}
        <div className="rounded-[4px] bg-blue-900 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-blue-200 tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Multi-Tenant Enterprise Architecture</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Ready to modernise your school campus?
            </h2>
            <p className="text-xs text-blue-200 leading-relaxed">
              Experience all 5 operational roles in our live interactive sandbox in under 10 seconds.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-sm">
                Try Live Sandbox <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Skooltech SIS</span>
            <span>•</span>
            <span>Made with precision for Indian K-12 Schools</span>
          </div>
          <div>&copy; {new Date().getFullYear()} Skooltech Technologies India Pvt Ltd. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
