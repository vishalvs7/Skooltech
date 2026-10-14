import { archiveContext, requireArchiveStudent, attendancePercent, emptyAttendanceCounts } from "@/lib/archive";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const STATUS_VARIANT = {
  PRESENT: "success",
  ABSENT: "danger",
  LATE: "warning",
  EXCUSED: "secondary",
} as const;

export default async function ArchiveAttendancePage({
  params,
}: PageProps<"/dashboard/archive/[studentId]/attendance">) {
  const ctx = await archiveContext();
  if (!ctx.dbReady) return <DatabaseSetupNotice />;

  const { studentId } = await params;
  const student = await requireArchiveStudent(ctx.session.schoolId, studentId);

  const [records, groups] = await Promise.all([
    prisma.attendance.findMany({
      where: { enrollment: { studentId: student.id } },
      include: {
        enrollment: { include: { session: true } },
      },
      orderBy: { date: "desc" },
      take: 120,
    }),
    prisma.attendance.groupBy({
      by: ["enrollmentId", "status"],
      where: { enrollment: { studentId: student.id } },
      _count: { _all: true },
    }),
  ]);

  const overall = emptyAttendanceCounts();
  const perEnrollment = new Map<string, ReturnType<typeof emptyAttendanceCounts>>();
  for (const g of groups) {
    overall[g.status] += g._count._all;
    if (!perEnrollment.has(g.enrollmentId)) perEnrollment.set(g.enrollmentId, emptyAttendanceCounts());
    perEnrollment.get(g.enrollmentId)![g.status] = g._count._all;
  }
  const overallPct = attendancePercent(overall);
  const totalDays = overall.PRESENT + overall.ABSENT + overall.LATE + overall.EXCUSED;

  const sessionRows = student.enrollments
    .map((enr) => {
      const counts = perEnrollment.get(enr.id) || emptyAttendanceCounts();
      const total = counts.PRESENT + counts.ABSENT + counts.LATE + counts.EXCUSED;
      return { enr, counts, total, pct: attendancePercent(counts) };
    })
    .filter((r) => r.total > 0);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Days Marked</p><p className="text-2xl font-bold text-blue-700 mt-1">{totalDays}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Present</p><p className="text-2xl font-bold text-emerald-700 mt-1">{overall.PRESENT}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Absent</p><p className="text-2xl font-bold text-rose-700 mt-1">{overall.ABSENT}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Late</p><p className="text-2xl font-bold text-amber-700 mt-1">{overall.LATE}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Excused</p><p className="text-2xl font-bold text-slate-700 mt-1">{overall.EXCUSED}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Attendance %</p><p className="text-2xl font-bold text-slate-900 mt-1">{overallPct === null ? "—" : `${overallPct}%`}</p></CardContent></Card>
      </div>
      <h2 className="text-sm font-semibold text-slate-800 mb-3">By Session</h2>
      {sessionRows.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="p-8 text-center text-slate-500 text-sm">
            No attendance records yet for this student.
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Session</th>
                  <th className="text-center py-3 px-4">Present</th>
                  <th className="text-center py-3 px-4">Absent</th>
                  <th className="text-center py-3 px-4">Late</th>
                  <th className="text-center py-3 px-4">Excused</th>
                  <th className="text-right py-3 px-4">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessionRows.map(({ enr, counts, total, pct }) => (
                  <tr key={enr.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {enr.session.name}
                      <span className="text-slate-400 ml-2 font-normal">{enr.section.class.name}-{enr.section.name}</span>
                    </td>
                    <td className="text-center py-3 px-4 text-emerald-700">{counts.PRESENT}</td>
                    <td className="text-center py-3 px-4 text-rose-700">{counts.ABSENT}</td>
                    <td className="text-center py-3 px-4 text-amber-700">{counts.LATE}</td>
                    <td className="text-center py-3 px-4 text-slate-600">{counts.EXCUSED}</td>
                    <td className="text-right py-3 px-4 font-semibold">
                      <span className={pct !== null && pct >= 75 ? "text-emerald-700" : pct !== null && pct >= 60 ? "text-amber-700" : "text-rose-700"}>
                        {pct === null ? "—" : `${pct}%`}
                      </span>
                      <span className="text-slate-400 font-normal ml-1">({total} days)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      <h2 className="text-sm font-semibold text-slate-800 mb-3">
        Recent Records {records.length > 0 && <span className="text-slate-400 font-normal">(last {records.length})</span>}
      </h2>
      {records.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500 text-sm">No records to show.</CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Session</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.enrollment.session.name}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant={STATUS_VARIANT[r.status] || "outline"} className="text-[10px]">
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
