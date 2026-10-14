import { archiveContext, requireArchiveStudent, gradeForPercent } from "@/lib/archive";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ArchiveExamsPage({
  params,
}: PageProps<"/dashboard/archive/[studentId]/exams">) {
  const ctx = await archiveContext();
  if (!ctx.dbReady) return <DatabaseSetupNotice />;

  const { studentId } = await params;
  const student = await requireArchiveStudent(ctx.session.schoolId, studentId);

  const enrollmentIds = student.enrollments.map((e) => e.id);

  const results = enrollmentIds.length
    ? await prisma.examResult.findMany({
        where: { enrollmentId: { in: enrollmentIds } },
        include: {
          exam: true,
          enrollment: { include: { session: true, section: { include: { class: true } } } },
        },
        orderBy: [{ exam: { startDate: "asc" } }, { subject: "asc" }],
      })
    : [];

  const byExam = new Map<string, { exam: (typeof results)[number]["exam"]; rows: typeof results }>();
  for (const r of results) {
    if (!byExam.has(r.examId)) byExam.set(r.examId, { exam: r.exam, rows: [] });
    byExam.get(r.examId)!.rows.push(r);
  }

  const pctList = results.map((r) => {
    const total = Number(r.totalMarks);
    return total > 0 ? (Number(r.obtainedMarks) / total) * 100 : 0;
  });
  const avgPct = pctList.length
    ? Math.round((pctList.reduce((s, p) => s + p, 0) / pctList.length) * 10) / 10
    : null;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Exams</p><p className="text-2xl font-bold text-blue-700 mt-1">{byExam.size}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Subject Records</p><p className="text-2xl font-bold text-slate-900 mt-1">{results.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Average</p><p className="text-2xl font-bold text-slate-900 mt-1">{avgPct === null ? "—" : `${avgPct}%`}</p></CardContent></Card>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500 text-sm">
            No exam results recorded for this student yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {[...byExam.values()].map(({ exam, rows }) => (
            <Card key={exam.id}>
              <CardContent className="p-0">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{exam.name}</p>
                    <p className="text-xs text-slate-500">
                      {exam.examType}
                      {exam.startDate && (
                        <> &middot; {new Date(exam.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</>
                      )}
                      {rows[0] && <> &middot; {rows[0].enrollment.session.name} &middot; {rows[0].enrollment.section.class.name}-{rows[0].enrollment.section.name}</>}
                    </p>
                  </div>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-slate-500 uppercase text-[10px] font-semibold">
                      <th className="text-left py-2.5 px-4">Subject</th>
                      <th className="text-center py-2.5 px-4">Marks</th>
                      <th className="text-center py-2.5 px-4">Percentage</th>
                      <th className="text-center py-2.5 px-4">Grade</th>
                      <th className="text-left py-2.5 px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((r) => {
                      const total = Number(r.totalMarks);
                      const pct = total > 0 ? Math.round((Number(r.obtainedMarks) / total) * 1000) / 10 : 0;
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-medium text-slate-800">{r.subject}</td>
                          <td className="text-center py-2.5 px-4 font-mono">{Number(r.obtainedMarks)}/{total}</td>
                          <td className="text-center py-2.5 px-4 font-semibold">{pct}%</td>
                          <td className="text-center py-2.5 px-4">
                            <Badge variant={pct >= 60 ? "success" : pct >= 40 ? "warning" : "danger"} className="text-[10px]">
                              {gradeForPercent(pct)}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">{r.remarks || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
