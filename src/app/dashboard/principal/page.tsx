import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2, AlertTriangle, FileText, TrendingUp,
  Users, IndianRupee, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { AuditTrailViewer } from "@/components/principal/AuditTrailViewer";

export default async function PrincipalOverviewPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const schoolId = session.schoolId;

  // Fetch real metrics
  const [
    totalStudents,
    activeStudents,
    todayAttendance,
    totalEnrollmentsToday,
    totalRevenue,
    outstandingFees,
    totalStaff,
    pendingLeaves,
    recentAuditLogs,
    currentSession,
  ] = await Promise.all([
    prisma.student.count({ where: { schoolId } }),
    prisma.student.count({ where: { schoolId, status: "ACTIVE" } }),
    prisma.attendance.count({
      where: {
        schoolId,
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        status: "PRESENT",
      },
    }),
    prisma.attendance.count({
      where: {
        schoolId,
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.paymentTransaction.aggregate({
      where: { schoolId },
      _sum: { amountPaid: true },
    }),
    prisma.feeInvoice.aggregate({
      where: { schoolId, isPaid: false },
      _sum: { baseAmount: true, paidAmount: true },
    }),
    prisma.user.count({
      where: {
        schoolId,
        role: { in: ["TEACHER", "PRINCIPAL", "ACCOUNTS", "SCHOOL_ADMIN"] },
      },
    }),
    prisma.leaveApplication.count({
      where: { schoolId, status: "PENDING" },
    }),
    prisma.auditLog.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.academicSession.findFirst({ where: { schoolId, isCurrent: true } }),
  ]);

  const attendancePct = totalEnrollmentsToday > 0
    ? ((todayAttendance / totalEnrollmentsToday) * 100).toFixed(1)
    : "0.0";

  const totalRevenueAmt = Number(totalRevenue._sum.amountPaid || 0);
  const outstandingAmt = outstandingFees._sum.baseAmount
    ? Number(outstandingFees._sum.baseAmount) - Number(outstandingFees._sum.paidAmount || 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs uppercase">Principal Portal</Badge>
          <span className="text-xs text-slate-500 font-mono">
            {currentSession?.name || "No Active Session"} • Operations & Audit Oversight
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome, {session.username}</h1>
        <p className="text-sm text-slate-600 mt-0.5">Institutional metrics, attendance verification, and compliance oversight.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Today&apos;s Attendance</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">{attendancePct}%</p>
                <p className="text-xs text-slate-500 mt-1">
                  {todayAttendance}/{totalEnrollmentsToday || 0} Present
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Total Students</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalStudents}</p>
                <p className="text-xs text-emerald-600 mt-1">{activeStudents} Active</p>
              </div>
              <Users className="h-8 w-8 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Revenue</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">₹{(totalRevenueAmt / 100000).toFixed(1)}L</p>
                <p className="text-xs text-rose-600 mt-1">₹{(outstandingAmt / 100000).toFixed(1)}L Pending</p>
              </div>
              <IndianRupee className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Pending Leaves</p>
                <p className={`text-3xl font-bold mt-1 ${pendingLeaves > 0 ? "text-amber-600" : "text-emerald-700"}`}>
                  {pendingLeaves}
                </p>
                <p className="text-xs text-slate-500 mt-1">{totalStaff} Staff Members</p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${pendingLeaves > 0 ? "text-amber-500" : "text-emerald-500"}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                Immutable Audit Trail
              </CardTitle>
              <CardDescription>Recent critical actions across the school</CardDescription>
            </div>
            <Link href="/dashboard/principal/audit" className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1">
              Full Audit Log <TrendingUp className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <AuditTrailViewer logs={recentAuditLogs.map((log) => ({
            id: log.id,
            timestamp: log.createdAt.toLocaleString("en-IN"),
            username: log.userId ?? "system",
            userRole: log.userRole,
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            details: log.newValues as Record<string, unknown> | null,
          }))} />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/principal/attendance" className="block p-5 rounded-[4px] border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
          <CheckCircle2 className="h-6 w-6 text-blue-700 mb-2" />
          <h3 className="font-semibold text-sm text-slate-900">Attendance Overview</h3>
          <p className="text-xs text-slate-500 mt-0.5">Daily/weekly/monthly attendance reports</p>
        </Link>
        <Link href="/dashboard/principal/staff" className="block p-5 rounded-[4px] border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
          <Users className="h-6 w-6 text-blue-700 mb-2" />
          <h3 className="font-semibold text-sm text-slate-900">Staff Management</h3>
          <p className="text-xs text-slate-500 mt-0.5">Teacher roster and performance</p>
        </Link>
        <Link href="/dashboard/principal/audit" className="block p-5 rounded-[4px] border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
          <FileText className="h-6 w-6 text-blue-700 mb-2" />
          <h3 className="font-semibold text-sm text-slate-900">Compliance & Reports</h3>
          <p className="text-xs text-slate-500 mt-0.5">CBSE returns and audit exports</p>
        </Link>
      </div>
    </div>
  );
}
