import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Page() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;


  const student = await prisma.student.findFirst({
    where: { userId: session.userId, schoolId: session.schoolId },
    include: { enrollments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  const enrollmentId = student?.enrollments[0]?.id;
  const results = enrollmentId ? await prisma.examResult.findMany({
    where: { enrollmentId },
    include: { exam: true },
    orderBy: { createdAt: "desc" },
  }) : [];

  const bySubject: Record<string, { obtained: number; total: number }> = {};
  results.forEach((r) => {
    if (!bySubject[r.subject]) bySubject[r.subject] = { obtained: 0, total: 0 };
    bySubject[r.subject].obtained += Number(r.obtainedMarks);
    bySubject[r.subject].total += Number(r.totalMarks);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Progress</h1>
        <p className="text-sm text-slate-600 mt-1">Subject-wise performance overview</p>
      </div>
      {Object.keys(bySubject).length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No exam results available yet.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(bySubject).map(([subject, data]) => {
            const pct = data.total > 0 ? ((data.obtained / data.total) * 100).toFixed(1) : "0";
            return (
              <Card key={subject}>
                <CardContent className="p-5">
                  <p className="text-xs font-semibold uppercase text-slate-500 mb-1">{subject}</p>
                  <p className="text-2xl font-bold text-blue-700">{pct}%</p>
                  <p className="text-xs text-slate-500 mt-1">{data.obtained}/{data.total} marks</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
