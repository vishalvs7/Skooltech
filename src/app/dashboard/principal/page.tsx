import { getSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, FileText, Check, ShieldAlert, Cpu, ShieldCheck } from "lucide-react";
import { NoticeBoardModal } from "@/components/admin/NoticeBoardModal";
import { AuditTrailViewer } from "@/components/principal/AuditTrailViewer";

export default async function PrincipalDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs uppercase font-medium">Principal Portal</Badge>
            <span className="text-xs text-slate-500 font-mono">Operations & Audit Oversight</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {session?.username}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Institutional metrics, attendance verification, biometric cross-checking, and audit inspection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NoticeBoardModal />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Daily Attendance Rate</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700 flex items-center justify-between">
              95.2%
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">38 Present out of 40 Students today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Biometric Cross-Check</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600 flex items-center justify-between">
              2 Discrepancies
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Hardware gate sync vs. Teacher roll-call</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Audit Log Status</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-between">
              Active
              <FileText className="h-5 w-5 text-blue-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Append-only compliance logs running</p>
          </CardContent>
        </Card>
      </div>

      {/* Step 5: Biometric vs Teacher Roll-Call Discrepancies Card */}
      <Card className="border-amber-200 bg-amber-50/15">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                <Cpu className="h-4 w-4 text-blue-700" />
                <span>Biometric Discrepancy Cross-Check (Step 5)</span>
                <Badge variant="warning" className="text-[10px]">Audit Match</Badge>
              </CardTitle>
              <CardDescription>
                Automated comparison between Class Teacher roll-call and gate biometric logs (`/api/biometric-sync`).
              </CardDescription>
            </div>
            <Badge variant="secondary">2 Flagged Entries</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-[4px] border border-slate-200 bg-white overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-2 font-semibold text-slate-700 grid grid-cols-5 border-b border-slate-200">
              <span>Person / Role</span>
              <span>Teacher Roll-Call</span>
              <span>Gate Biometric Punch</span>
              <span>Discrepancy Detail</span>
              <span>Action</span>
            </div>
            {/* Student mismatch */}
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center">
              <div>
                <p className="font-semibold text-slate-900">Vihaan Patel</p>
                <p className="font-mono text-[11px] text-slate-500">ADM-1003 (Class 5-A)</p>
              </div>
              <div>
                <Badge variant="success" className="text-[10px]">PRESENT (08:30 AM)</Badge>
              </div>
              <div>
                <Badge variant="danger" className="text-[10px]">NO PUNCH RECORDED</Badge>
              </div>
              <span className="text-slate-600 text-[11px]">
                Marked present by teacher, but no turnstile punch logged at main gate.
              </span>
              <div>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                  Verify with Teacher
                </Button>
              </div>
            </div>
            {/* Staff late arrival */}
            <div className="px-4 py-3 grid grid-cols-5 items-center">
              <div>
                <p className="font-semibold text-slate-900">Amit Patel</p>
                <p className="font-mono text-[11px] text-slate-500">TCH-003 (Science Dept)</p>
              </div>
              <div>
                <Badge variant="secondary" className="text-[10px]">STAFF ROSTER</Badge>
              </div>
              <div>
                <Badge variant="warning" className="text-[10px]">PUNCHED 08:35 AM</Badge>
              </div>
              <span className="text-slate-600 text-[11px]">
                Late gate clock-in by 35 minutes (School start time: 08:00 AM).
              </span>
              <div>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                  Acknowledge
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 8: Comprehensive Institutional Audit Trail */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                <span>Tamper-Proof Audit Trail (Step 8)</span>
                <Badge variant="default" className="text-[10px]">Append-Only Log</Badge>
              </CardTitle>
              <CardDescription>
                Cryptographic audit trail tracking fee settlements, marks entry, leave decisions, and administrative events.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AuditTrailViewer />
        </CardContent>
      </Card>
    </div>
  );
}
