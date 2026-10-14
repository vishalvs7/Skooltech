import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, School, Palette, CreditCard, GraduationCap, Shield, Save } from "lucide-react";

const tabs = [
  { label: "School Profile", href: "/dashboard/admin/settings" },
  { label: "Branding", href: "/dashboard/admin/settings/branding" },
  { label: "Payment Gateway", href: "/dashboard/admin/settings/gateway" },
  { label: "Grading Scale", href: "/dashboard/admin/settings/grading" },
  { label: "User Roles", href: "/dashboard/admin/settings/roles" },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">School Settings</h1>
        <p className="text-sm text-slate-600 mt-1">Configure school profile, payment gateway, grading scale, and more.</p>
      </div>
      <TabNavigation tabs={tabs} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* School Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <School className="h-4 w-4 text-blue-700" /> School Profile
            </CardTitle>
            <CardDescription>Basic school information</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">School Name</label>
                <Input defaultValue="Greenwood International School" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">School Code</label>
                  <Input defaultValue="DEMO01" disabled className="font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Affiliation No</label>
                  <Input defaultValue="CBSE-AFF-2026/8834" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Address</label>
                <Input defaultValue="Plot 14, Sector 62, Noida, UP 201309" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Phone</label>
                  <Input defaultValue="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                  <Input defaultValue="principal@greenwood.edu.in" />
                </div>
              </div>
              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button className="flex items-center gap-1.5"><Save className="h-4 w-4" /> Save Profile</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Payment Gateway BYOG */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-700" /> Payment Gateway (BYOG)
            </CardTitle>
            <CardDescription>Configure your own payment gateway for direct settlement</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Gateway Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-[4px] border border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-center">
                    <p className="font-bold text-xs text-blue-900">Mock</p>
                    <p className="text-[10px] text-blue-700">Sandbox</p>
                  </div>
                  <div className="p-3 rounded-[4px] border border-slate-200 hover:bg-slate-50 text-center">
                    <p className="font-bold text-xs text-slate-900">Razorpay</p>
                    <p className="text-[10px] text-slate-500">BYOG</p>
                  </div>
                  <div className="p-3 rounded-[4px] border border-slate-200 hover:bg-slate-50 text-center">
                    <p className="font-bold text-xs text-slate-900">Cashfree</p>
                    <p className="text-[10px] text-slate-500">BYOG</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Merchant Key ID</label>
                <Input defaultValue="rzp_test_greenwood_demo" className="font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Merchant Secret</label>
                <Input type="password" defaultValue="mock_secret_enc_greenwood" />
              </div>
              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button className="flex items-center gap-1.5"><Save className="h-4 w-4" /> Save Gateway</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Grading Scale */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-700" /> Grading Scale
            </CardTitle>
            <CardDescription>Select the grading system for report cards</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Default Scale</label>
                <div className="space-y-2">
                  {[
                    { value: "PERCENTAGE", label: "Percentage (%)", desc: "Display raw percentage score" },
                    { value: "CGPA_10", label: "CGPA on 10.0 Scale", desc: "CBSE standard CGPA" },
                    { value: "CGPA_5", label: "GPA on 5.0 Scale", desc: "Alternative grading" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-start gap-3 p-3 rounded-[4px] border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input type="radio" name="gradingScale" defaultChecked={opt.value === "PERCENTAGE"} className="mt-0.5 accent-blue-700" />
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{opt.label}</p>
                        <p className="text-xs text-slate-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button className="flex items-center gap-1.5"><Save className="h-4 w-4" /> Save Grading</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Current Session */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-700" /> Academic Session
            </CardTitle>
            <CardDescription>Current active academic session</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="p-4 rounded-[4px] bg-blue-50 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">2026-2027</p>
                    <p className="text-xs text-slate-600">Apr 01, 2026 — Mar 31, 2027</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Start Date</label>
                  <Input type="date" defaultValue="2026-04-01" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">End Date</label>
                  <Input type="date" defaultValue="2027-03-31" />
                </div>
              </div>
              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button className="flex items-center gap-1.5"><Save className="h-4 w-4" /> Update Session</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
