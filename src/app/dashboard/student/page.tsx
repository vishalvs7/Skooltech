import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  FileCheck,
  IndianRupee,
  Bell,
  ArrowRight,
  Award,
  Clock,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { OnlineFeePaymentModal } from "@/components/student/OnlineFeePaymentModal";
import { ReportCardModal } from "@/components/student/ReportCardModal";

export default async function StudentOverviewPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  // Fetch student profile with enrollment
  const student = await prisma.student.findFirst({
    where: {
      schoolId: session.schoolId,
      userId: session.userId,
    },
    include: {
      enrollments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          section: { include: { class: true } },
          session: true,
        },
      },
      feeInvoices: {
        orderBy: { dueDate: "asc" },
      },
    },
  });

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500">
        Student profile not found. Contact your school administrator.
      </div>
    );
  }

  const enrollment = student.enrollments[0];
  const classLabel = enrollment
    ? `${enrollment.section.class.name} - Section ${enrollment.section.name}`
    : "Not Enrolled";
  const rollNo = enrollment?.rollNo || "—";
  const academicYear = enrollment?.session.name || "N/A";

  // Fetch attendance summary
  const attendanceRecords = enrollment
    ? await prisma.attendance.findMany({
        where: { enrollmentId: enrollment.id },
        select: { status: true },
      })
    : [];

  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter((a) => a.status === "PRESENT").length;
  const absentDays = attendanceRecords.filter((a) => a.status === "ABSENT").length;
  const attendancePct = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : "0.0";

  // Fetch fee status
  const unpaidInvoices = student.feeInvoices.filter((inv) => !inv.isPaid);
  const totalOutstanding = unpaidInvoices.reduce(
    (sum, inv) => sum + (Number(inv.baseAmount) - Number(inv.paidAmount)),
    0
  );
  const latestPayment = await prisma.paymentTransaction.findFirst({
    where: { invoice: { studentId: student.id } },
    orderBy: { createdAt: "desc" },
    select: { receiptNo: true, amountPaid: true, paymentMethod: true },
  });

  // Fetch latest exam results
  const latestExam = await prisma.exam.findFirst({
    where: { schoolId: session.schoolId },
    orderBy: { createdAt: "desc" },
  });

  let examPerformance: string | null = null;
  let examLabel: string | null = null;
  if (latestExam && enrollment) {
    const results = await prisma.examResult.findMany({
      where: {
        examId: latestExam.id,
        enrollmentId: enrollment.id,
      },
    });
    if (results.length > 0) {
      const totalObtained = results.reduce((sum, r) => sum + Number(r.obtainedMarks), 0);
      const totalMax = results.reduce((sum, r) => sum + Number(r.totalMarks), 0);
      examPerformance = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : null;
      examLabel = latestExam.name;
    }
  }

  // Fetch upcoming exams
  const upcomingExams = await prisma.exam.findMany({
    where: {
      schoolId: session.schoolId,
      startDate: { gte: new Date() },
    },
    orderBy: { startDate: "asc" },
    take: 3,
  });

  // Fetch recent notices
  const notices = await prisma.notice.findMany({
    where: {
      schoolId: session.schoolId,
      OR: [{ targetRole: "ALL" }, { targetRole: "STUDENT" }],
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs uppercase font-medium">Student & Parent Portal</Badge>
              <span className="text-xs text-slate-500 font-mono">Admission No: {student.admissionNo}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome, {student.fullName}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              {classLabel} • Roll No: {rollNo} • Academic Year {academicYear}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <OnlineFeePaymentModal
              admissionNo={student.admissionNo}
              studentName={student.fullName}
            />
            <ReportCardModal
              studentName={student.fullName}
              admissionNo={student.admissionNo}
              rollNo={rollNo}
              className={enrollment?.section.class.name || ""}
              sectionName={enrollment?.section.name || ""}
              academicSession={academicYear}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Attendance Rate</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700 flex items-center justify-between">
              {attendancePct}%
              <CalendarCheck className="h-5 w-5 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              {presentDays} Present / {absentDays} Absent / {totalDays} Days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Fee Status</CardDescription>
            <CardTitle className={`text-2xl font-bold flex items-center justify-between ${
              totalOutstanding > 0 ? "text-rose-600" : "text-emerald-700"
            }`}>
              {totalOutstanding > 0
                ? `₹${totalOutstanding.toLocaleString("en-IN")} Due`
                : "All Paid"}
              <IndianRupee className="h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              {latestPayment
                ? `Last: ${latestPayment.receiptNo} (${latestPayment.paymentMethod})`
                : "No payments yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Academic Performance</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center justify-between">
              {examPerformance ? `${examPerformance}%` : "N/A"}
              <FileCheck className="h-5 w-5 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">{examLabel || "No exams recorded yet"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Upcoming Exams</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600 flex items-center justify-between">
              {upcomingExams.length} Exam{upcomingExams.length !== 1 ? "s" : ""}
              <Clock className="h-5 w-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">
              {upcomingExams.length > 0
                ? upcomingExams.map((e) => e.name).join(", ")
                : "None scheduled"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-700" />
                  Upcoming Examinations
                </CardTitle>
                <CardDescription>Scheduled exams for this session</CardDescription>
              </div>
              <Link href="/dashboard/student/exams" className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingExams.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No upcoming exams scheduled.</p>
            ) : (
              upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-[4px] border border-slate-200 bg-slate-50">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{exam.name}</p>
                    <p className="text-xs text-slate-500">
                      {exam.startDate
                        ? new Date(exam.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                        : "Date TBA"}
                    </p>
                  </div>
                  <Badge variant="warning" className="text-[10px]">Upcoming</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-700" />
                  School Notices
                </CardTitle>
                <CardDescription>Latest announcements</CardDescription>
              </div>
              <Link href="/dashboard/student/notifications" className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notices.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No notices yet.</p>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`p-3 rounded-[4px] border ${
                    notice.targetRole === "STUDENT"
                      ? "border-blue-100 bg-blue-50/40"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p className="font-semibold text-sm text-slate-900">{notice.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{notice.content}</p>
                  <Badge variant={notice.targetRole === "STUDENT" ? "default" : "secondary"} className="text-[10px] mt-1.5">
                    {notice.targetRole}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
          <CardDescription>Common tasks at your fingertips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Link href="/dashboard/student/attendance" className="flex flex-col items-center gap-2 p-4 rounded-[4px] border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-center">
              <CalendarCheck className="h-6 w-6 text-blue-700" />
              <span className="text-xs font-medium text-slate-700">Attendance</span>
            </Link>
            <Link href="/dashboard/student/exams" className="flex flex-col items-center gap-2 p-4 rounded-[4px] border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-center">
              <FileCheck className="h-6 w-6 text-blue-700" />
              <span className="text-xs font-medium text-slate-700">My Exams</span>
            </Link>
            <Link href="/dashboard/student/fees" className="flex flex-col items-center gap-2 p-4 rounded-[4px] border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-center">
              <IndianRupee className="h-6 w-6 text-emerald-700" />
              <span className="text-xs font-medium text-slate-700">Pay Fees</span>
            </Link>
            <Link href="/dashboard/student/leaves" className="flex flex-col items-center gap-2 p-4 rounded-[4px] border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-center">
              <CalendarDays className="h-6 w-6 text-blue-700" />
              <span className="text-xs font-medium text-slate-700">Apply Leave</span>
            </Link>
            <Link href="/dashboard/student/report-cards" className="flex flex-col items-center gap-2 p-4 rounded-[4px] border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-center">
              <Award className="h-6 w-6 text-blue-700" />
              <span className="text-xs font-medium text-slate-700">Report Card</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
