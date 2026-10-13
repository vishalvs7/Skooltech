"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
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

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-700 transition">Overview</Link>
            <Link href="/pricing" className="hover:text-blue-700 transition">Pricing</Link>
            <Link href="/about" className="hover:text-blue-700 transition">About</Link>
            <Link href="/contact" className="text-blue-700 font-semibold">Contact</Link>
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
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="default" className="text-xs uppercase font-medium px-3 py-1">
            Institutional Consultation
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Book a Guided Demo with an Academic Advisor
          </h1>
          <p className="text-sm text-slate-600">
            See how Skooltech eliminates attendance bottlenecks, simplifies cash collections, and automates CBSE report cards for your school campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="p-6 rounded-[4px] bg-white border border-slate-200 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900">Headquarters</h3>
              <div className="space-y-3 text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>Sector 14, Dwarka Institutional Area, New Delhi &mdash; 110078</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>+91 (011) 4892-0000 / +91 98110 23456</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>admissions@skooltech.in</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-[4px] bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2">
              <span className="font-bold block flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-700" />
                <span>Instant 1-Click Sandbox</span>
              </span>
              <p className="text-slate-600 leading-relaxed">
                Prefer exploring immediately? You can jump straight into our pre-seeded demonstration campus without submitting any contact info.
              </p>
              <div className="pt-2">
                <Link href="/demo">
                  <Button size="sm" className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs">
                    Launch Demo Instantly
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Intake Form */}
          <div className="md:col-span-2">
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-900">Request Institutional Walkthrough</CardTitle>
                <CardDescription className="text-xs">Fill out your school parameters below. An advisor will reach out within 2 business hours.</CardDescription>
              </CardHeader>

              <CardContent>
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Demo Request Received!</h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                        Thank you. Our CBSE implementation specialist has scheduled your campus profile and will contact you via WhatsApp / phone shortly.
                      </p>
                    </div>
                    <div className="pt-4 flex justify-center gap-3">
                      <Link href="/demo">
                        <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">
                          Test Drive Live Sandbox Now
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                        Submit Another Inquiry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Full Name *</label>
                        <Input placeholder="e.g. Dr. Ramesh Sharma" defaultValue="Dr. Ramesh Sharma" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Designation *</label>
                        <select className="w-full h-10 px-3 rounded-[4px] border border-slate-200 bg-white" required defaultValue="Principal">
                          <option value="Principal">Principal / Headmaster</option>
                          <option value="Trustee">School Trustee / Chairman</option>
                          <option value="Director">Academic Director</option>
                          <option value="Administrator">School Administrator</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">School Name *</label>
                        <Input placeholder="e.g. St. Xavier's Senior Secondary School" defaultValue="Heritage Model Academy" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Affiliation Board *</label>
                        <select className="w-full h-10 px-3 rounded-[4px] border border-slate-200 bg-white" required defaultValue="CBSE">
                          <option value="CBSE">CBSE (Central Board)</option>
                          <option value="ICSE">ICSE / ISC</option>
                          <option value="STATE">State Board</option>
                          <option value="CAMBRIDGE">Cambridge / IB</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">Official Email *</label>
                        <Input type="email" placeholder="principal@school.edu.in" defaultValue="principal@heritagemodel.edu.in" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-700">WhatsApp / Phone Number *</label>
                        <Input placeholder="+91 98123 45678" defaultValue="+91 98110 99887" required />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700">Estimated Student Enrollment</label>
                      <select className="w-full h-10 px-3 rounded-[4px] border border-slate-200 bg-white" defaultValue="300-800">
                        <option value="under-300">Under 300 Students (Primary Tier)</option>
                        <option value="300-800">300 to 800 Students (Standard K-12)</option>
                        <option value="800-1500">800 to 1,500 Students (Large Campus)</option>
                        <option value="above-1500">Above 1,500 Students (Institutional Chain)</option>
                      </select>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button type="submit" disabled={loading} className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5">
                        <Send className="h-4 w-4" />
                        <span>{loading ? "Submitting Inquiry..." : "Schedule Campus Consultation"}</span>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
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
