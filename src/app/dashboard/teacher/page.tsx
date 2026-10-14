import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Check, UserPlus } from "lucide-react";
import { AttendanceRollCall, type RosterStudent } from "@/components/attendance/AttendanceRollCall";
import { CreateExamModal } from "@/components/teacher/CreateExamModal";
import { MarksEntryModal } from "@/components/teacher/MarksEntryModal";
import { LeaveReviewModal } from "@/components/teacher/LeaveReviewModal";

export default async function TeacherOverviewPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  // Fetch teacher profile and managed section
  const teacher = await prisma.teacher.findUnique({
    where: { userId: session.userId },
    include: {
      managedSection: {
        include: {
          class: true,
          enrollments: {
            include: {
              student: {
                select: { fullName: true, admissionNo: true, status: true },
              },
            },
            orderBy: { rollNo: "asc" },
          },
        },
      },
    },
  });

  const section = teacher?.managedSection;
  const classLabel = section
    ? `${section.class.name} - Section ${section.name}`
    : "No section assigned";

  // Build roster from real enrollments
  const roster: RosterStudent[] =
    section?.enrollments
      .filter((e) => e.student.status === "ACTIVE")
      .map((e) => ({
        enrollmentId: e.id,
        rollNo: e.rollNo || "—",
        studentName: e.student.fullName,
        admissionNo: e.student.admissionNo,
      })) || [];

  // Fetch today's attendance summary
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAttendance = section
    ? await prisma.attendance.findMany({
        where: {
          enrollmentId: { in: section.enrollments.map((e) => e.id) },
          date: today,
        },
      })
    : [];

  const presentToday = todayAttendance.filter((a) => a.status === "PRESENT").length;
  const absentToday = todayAttendance.filter((a) => a.status === "ABSENT").length;

  // Fetch pending leave applications for this section's students
  const pendingLeaves = section
    ? await prisma.leaveApplication.findMany({
        where: {
          schoolId: session.schoolId,
          status: "PENDING",
          studentId: {
            in: section.enrollments.map((e) => e.studentId),
          },
        },
        include: { student: { select: { fullName: true, admissionNo: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Fetch pending admissions (students in PENDING_ACADEMIC status)
  const pendingAdmissions = await prisma.student.count({
    where: {
      schoolId: session.schoolId,
      status: "PENDING_ACADEMIC",
    },
  });

  // Fetch pending fee assignments
  const pendingFee = await prisma.student.count({
    where: {
      schoolId: session.schoolId,
      status: "PENDING_FEE",
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs uppercase">Teacher Portal</Badge>
            <span className="text-xs text-slate-500 font-mono">{classLabel}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {session.username}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {teacher?.fullName || session.username} — {classLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CreateExamModal />
          <MarksEntryModal
            examOptions={[]}
            roster={roster}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-blue-900">My Class</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{classLabel}</p>
                <p className="text-xs text-slate-600 mt-1">{roster.length} Active Students</p>
              </div>
              <Users className="h-8 w-8 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Today&apos;s Attendance</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">
                  {todayAttendance.length > 0 ? `${presentToday} / ${roster.length}` : "Not Marked"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {absentToday > 0 ? `${absentToday} Absent` : todayAttendance.length > 0 ? "All Present" : "Roll call pending"}
                </p>
              </div>
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Pending Admissions</p>
                <p className="text-3xl font-bold text-blue-700 mt-1">{pendingAdmissions} Queue</p>
                <p className="text-xs text-slate-500 mt-1">
                  {pendingFee > 0 ? `${pendingFee} awaiting fee` : "All placed"}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Admission */}
      {pendingAdmissions > 0 && (
        <Card className="border-blue-200 bg-blue-50/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-blue-900">Pending Admissions ({pendingAdmissions})</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Students in PENDING_ACADEMIC status need class placement
                </p>
              </div>
              <Badge variant="default">{pendingAdmissions} Awaiting</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leave Review */}
      <LeaveReviewModal
        leaves={pendingLeaves.map((l) => ({
          id: l.id,
          studentName: l.student.fullName,
          admissionNo: l.student.admissionNo,
          startDate: l.startDate.toISOString().split("T")[0],
          endDate: l.endDate.toISOString().split("T")[0],
          reason: l.reason,
          category: l.reason.startsWith("[") ? l.reason.slice(1, l.reason.indexOf("]")) : "GENERAL",
        }))}
      />

      {/* Attendance Roll Call */}
      <AttendanceRollCall roster={roster} classLabel={classLabel} />
    </div>
  );
}
