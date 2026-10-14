import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function StudentReportCardsPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const student = await prisma.student.findFirst({
    where: { userId: session.userId, schoolId: session.schoolId },
    include: { enrollments: true },
  });
  const enrollmentIds = student?.enrollments.map((e) => e.id) || [];

  const results = enrollmentIds.length > 0 ? await prisma.examResult.findMany({
    where: { enrollmentId: { in: enrollmentIds } },
    include: { exam: true },
    orderBy: { createdAt: "desc" },
  }) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Report Cards</h1>
        <p className="text-sm text-slate-600 mt-1">Your examination results</p>
      </div>
      {results.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No exam results available yet.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Exam</th>
                  <th className="text-left py-3 px-4">Subject</th>
                  <th className="text-center py-3 px-4">Marks</th>
                  <th className="text-center py-3 px-4">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r) => {
                  const pct = Number(r.totalMarks) > 0 ? (Number(r.obtainedMarks) / Number(r.totalMarks)) * 100 : 0;
                  const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : pct >= 60 ? "B" : pct >= 50 ? "C" : "D";
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-slate-800">{r.exam?.name || "—"}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{r.subject}</td>
                      <td className="text-center py-3 px-4 font-mono">{Number(r.obtainedMarks)}/{Number(r.totalMarks)}</td>
                      <td className="text-center py-3 px-4"><Badge variant={pct >= 60 ? "success" : pct >= 40 ? "warning" : "danger"}>{grade}</Badge></td>
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
