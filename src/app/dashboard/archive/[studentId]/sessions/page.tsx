import { archiveContext, requireArchiveStudent, attendancePercent, emptyAttendanceCounts } from "@/lib/archive";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ArchiveSessionsPage({
  params,
}: PageProps<"/dashboard/archive/[studentId]/sessions">) {
  const ctx = await archiveContext();
  if (!ctx.dbReady) return <DatabaseSetupNotice />;

  const { studentId } = await params;
  const student = await requireArchiveStudent(ctx.session.schoolId, studentId);

  const groups = await prisma.attendance.groupBy({
    by: ["enrollmentId", "status"],
    where: { enrollment: { studentId: student.id } },
    _count: { _all: true },
  });

  const countsByEnrollment = new Map<string, ReturnType<typeof emptyAttendanceCounts>>();
  for (const g of groups) {
    if (!countsByEnrollment.has(g.enrollmentId)) {
      countsByEnrollment.set(g.enrollmentId, emptyAttendanceCounts());
    }
    countsByEnrollment.get(g.enrollmentId)![g.status] = g._count._all;
  }

  const currentSession = student.enrollments.find((e) => e.session.isCurrent);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase font-semibold">Sessions on Record</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">{student.enrollments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase font-semibold">Current Session</p>
            <p className="text-xl font-bold text-slate-900 mt-2">
              {currentSession ? currentSession.session.name : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
            <p className="text-xl font-bold text-slate-900 mt-2">{student.status.replace(/_/g, " ")}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-sm font-semibold text-slate-800 mb-3">Academic Session History</h2>

      {student.enrollments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500 text-sm">
            No enrollment history. The student has not been placed in a class yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Session</th>
                  <th className="text-left py-3 px-4">Class - Section</th>
                  <th className="text-center py-3 px-4">Roll No</th>
                  <th className="text-center py-3 px-4">Attendance</th>
                  <th className="text-center py-3 px-4">Term</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {student.enrollments.map((enr) => {
                  const counts = countsByEnrollment.get(enr.id) || emptyAttendanceCounts();
                  const pct = attendancePercent(counts);
                  return (
                    <tr key={enr.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-800">{enr.session.name}</td>
                      <td className="py-3 px-4 text-slate-700">
                        {enr.section.class.name} - {enr.section.name}
                      </td>
                      <td className="text-center py-3 px-4 font-mono">{enr.rollNo || "—"}</td>
                      <td className="text-center py-3 px-4">
                        {pct === null ? (
                          <span className="text-slate-400">—</span>
                        ) : (
                          <span className={pct >= 75 ? "text-emerald-700 font-semibold" : pct >= 60 ? "text-amber-700 font-semibold" : "text-rose-700 font-semibold"}>
                            {pct}%
                          </span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {enr.session.isCurrent ? (
                          <Badge variant="success" className="text-[10px]">CURRENT</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">PAST</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
