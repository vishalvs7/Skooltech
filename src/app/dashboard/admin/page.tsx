import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, GraduationCap, CalendarDays, ShieldCheck, IndianRupee,
  AlertCircle, TrendingUp, FileText, Bell,
} from "lucide-react";
import Link from "next/link";
import { NewStudentModal } from "@/components/admin/NewStudentModal";
import { RolloverWizardModal } from "@/components/admin/RolloverWizardModal";
import { NoticeBoardModal } from "@/components/admin/NoticeBoardModal";

export default async function AdminOverviewPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const schoolId = session.schoolId;

  // Fetch real counts
  const [
    totalStudents,
    activeStudents,
    pendingAcademic,
    pendingFee,
    totalStaff,
    totalClasses,
    currentSession,
    totalRevenue,
    outstandingFees,
    recentAuditLogs,
    recentNotices,
  ] = await Promise.all([
    prisma.student.count({ where: { schoolId } }),
    prisma.student.count({ where: { schoolId, status: "ACTIVE" } }),
    prisma.student.count({ where: { schoolId, status: "PENDING_ACADEMIC" } }),
    prisma.student.count({ where: { schoolId, status: "PENDING_FEE" } }),
    prisma.user.count({
      where: {
        schoolId,
        role: { in: ["TEACHER", "PRINCIPAL", "ACCOUNTS", "SCHOOL_ADMIN"] },
      },
    }),
    prisma.class.count({ where: { schoolId } }),
    prisma.academicSession.findFirst({ where: { schoolId, isCurrent: true } }),
    prisma.paymentTransaction.aggregate({
      where: { schoolId },
      _sum: { amountPaid: true },
    }),
    prisma.feeInvoice.aggregate({
      where: { schoolId, isPaid: false },
      _sum: { baseAmount: true, paidAmount: true },
    }),
    prisma.auditLog.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.notice.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const totalRevenueAmt = Number(totalRevenue._sum.amountPaid || 0);
  const outstandingAmt = outstandingFees._sum.baseAmount
    ? Number(outstandingFees._sum.baseAmount) - Number(outstandingFees._sum.paidAmount || 0)
    : 0;

  const sessionLabel = currentSession?.name || "No Active Session";
  const pendingTotal = pendingAcademic + pendingFee;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs uppercase">School Admin Portal</Badge>
            <span className="text-xs text-slate-500 font-mono">Session {sessionLabel}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome, {session.username}</h1>
          <p className="text-sm text-slate-600 mt-0.5">Manage students, staff, academics, and school operations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <NoticeBoardModal />
          <RolloverWizardModal />
          <NewStudentModal />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Total Students</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalStudents}</p>
                <p className="text-xs text-emerald-600 mt-1">{activeStudents} Active{pendingTotal > 0 ? ` + ${pendingTotal} Pending` : ""}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Staff Members</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalStaff}</p>
                <p className="text-xs text-slate-500 mt-1">Teachers & Admin</p>
              </div>
              <Users className="h-8 w-8 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Revenue Collected</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">₹{(totalRevenueAmt / 100000).toFixed(1)}L</p>
                <p className="text-xs text-rose-600 mt-1">₹{(outstandingAmt / 100000).toFixed(1)}L Outstanding</p>
              </div>
              <IndianRupee className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Pending Actions</p>
                <p className={`text-3xl font-bold mt-1 ${pendingTotal > 0 ? "text-amber-600" : "text-emerald-700"}`}>
                  {pendingTotal}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {pendingAcademic > 0 ? `${pendingAcademic} placement` : ""}
                  {pendingAcademic > 0 && pendingFee > 0 ? " • " : ""}
                  {pendingFee > 0 ? `${pendingFee} fee assignment` : ""}
                  {pendingTotal === 0 ? "All clear" : ""}
                </p>
              </div>
              <AlertCircle className={`h-8 w-8 ${pendingTotal > 0 ? "text-amber-500" : "text-emerald-500"}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      {pendingTotal > 0 && (
        <Card className="border-amber-200 bg-amber-50/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Pending Student Lifecycle Actions
                </CardTitle>
                <CardDescription>Complete the onboarding pipeline for these students</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pendingAcademic > 0 && (
                <div className="p-3 rounded-[4px] border border-amber-200 bg-white flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{pendingAcademic} Student(s) Pending Placement</p>
                    <p className="text-xs text-slate-500">Awaiting class/section assignment by Class Teacher</p>
                  </div>
                  <Badge variant="warning">PENDING_ACADEMIC</Badge>
                </div>
              )}
              {pendingFee > 0 && (
                <div className="p-3 rounded-[4px] border border-blue-200 bg-white flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{pendingFee} Student(s) Pending Fee Setup</p>
                    <p className="text-xs text-slate-500">Awaiting fee package assignment by Accounts</p>
                  </div>
                  <Badge variant="default">PENDING_FEE</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Trail */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-700" />
                  Recent Audit Trail
                </CardTitle>
                <CardDescription>Last 5 critical actions</CardDescription>
              </div>
              <Link href="/dashboard/admin/audit" className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1">
                View All <TrendingUp className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentAuditLogs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No audit entries yet.</p>
            ) : (
              recentAuditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2.5 rounded-[4px] border border-slate-100 bg-slate-50 text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{log.action.replace(/_/g, " ")}</p>
                    <p className="text-slate-500">{log.entityType} • {log.userRole}</p>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(log.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Notices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-700" />
                  Recent Notices
                </CardTitle>
                <CardDescription>School announcements</CardDescription>
              </div>
              <Link href="/dashboard/admin/communications" className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1">
                View All <FileText className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentNotices.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No notices published yet.</p>
            ) : (
              recentNotices.map((notice) => (
                <div key={notice.id} className="p-3 rounded-[4px] border border-slate-200 bg-slate-50">
                  <p className="font-semibold text-sm text-slate-900">{notice.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notice.content}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-[9px]">{notice.targetRole}</Badge>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notice.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Academic Structure */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-700" />
                Academic Structure
              </CardTitle>
              <CardDescription>Classes and session overview</CardDescription>
            </div>
            <Link href="/dashboard/admin/academics" className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1">
              Manage <TrendingUp className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-[4px] border border-slate-200 bg-slate-50 text-center">
              <p className="text-2xl font-bold text-blue-700">{totalClasses}</p>
              <p className="text-xs text-slate-600 mt-1">Classes</p>
            </div>
            <div className="p-4 rounded-[4px] border border-slate-200 bg-slate-50 text-center">
              <p className="text-2xl font-bold text-blue-700">{sessionLabel}</p>
              <p className="text-xs text-slate-600 mt-1">Current Session</p>
            </div>
            <div className="p-4 rounded-[4px] border border-slate-200 bg-slate-50 text-center">
              <p className="text-2xl font-bold text-emerald-700">{activeStudents}</p>
              <p className="text-xs text-slate-600 mt-1">Active Students</p>
            </div>
            <div className="p-4 rounded-[4px] border border-slate-200 bg-slate-50 text-center">
              <p className="text-2xl font-bold text-amber-600">{pendingTotal}</p>
              <p className="text-xs text-slate-600 mt-1">In Pipeline</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
