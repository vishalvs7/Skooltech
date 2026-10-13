"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock 
} from "lucide-react";

export default function RegisterSchoolPage() {
  const [provisioned, setProvisioned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schoolCode, setSchoolCode] = useState("DPHS01");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setProvisioned(true);
    }, 900);
  };

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

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Already Registered? Log In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="default" className="text-xs uppercase font-medium px-3 py-1">
            New Institution Setup
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Register Your School Campus
          </h1>
          <p className="text-xs text-slate-600">
            Provision your dedicated school tenant space with instant multi-role access.
          </p>
        </div>

        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900">Institution Details</CardTitle>
            <CardDescription className="text-xs">
              Configure your school code, affiliation details, and primary administrator.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {provisioned ? (
              <div className="py-8 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Institution Tenant Provisioned!</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your school domain has been initialized under tenant code:{" "}
                    <span className="font-mono font-bold text-blue-700">{schoolCode}</span>.
                  </p>
                </div>

                <div className="p-4 rounded-[4px] bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">School Code:</span>
                    <span className="font-mono font-bold text-slate-900">{schoolCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Admin Username:</span>
                    <span className="font-mono text-slate-900">admin_{schoolCode.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Default Currency:</span>
                    <span className="font-semibold text-emerald-700 font-mono">INR (₹)</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <Link href="/demo">
                    <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5">
                      <span>Enter Campus Portal</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Official School Name *</label>
                  <Input placeholder="e.g. Delhi Public Heritage School" defaultValue="Delhi Public Heritage School" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Desired School Code *</label>
                    <Input
                      value={schoolCode}
                      onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                      placeholder="e.g. DEMO01"
                      className="font-mono uppercase font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Affiliation Code *</label>
                    <Input placeholder="CBSE/AFF/2026/XXXX" defaultValue="CBSE/AFF/2026/9821" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Affiliation Board</label>
                    <select className="w-full h-10 px-3 rounded-[4px] border border-slate-200 bg-white" defaultValue="CBSE">
                      <option value="CBSE">CBSE (Central Board)</option>
                      <option value="ICSE">ICSE / ISC</option>
                      <option value="STATE">State Board</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Base Currency</label>
                    <Input value="Indian Rupee (INR / ₹)" disabled className="bg-slate-100 font-medium" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Administrator Work Email *</label>
                  <Input type="email" placeholder="admin@dphs.edu.in" defaultValue="admin@dphs.edu.in" required />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Initial Password *</label>
                  <Input type="password" defaultValue="AdminDemo@2026" required />
                </div>

                <div className="p-3 rounded-[4px] bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-700" />
                  <span>Includes 14-day full feature trial with pre-seeded test data.</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={loading} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium">
                    {loading ? "Provisioning School Tenant..." : "Create School Tenant"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Skooltech Technologies India Pvt Ltd. All rights reserved.
      </footer>
    </div>
  );
}
