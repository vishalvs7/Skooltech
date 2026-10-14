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


  const exams = await prisma.exam.findMany({
    where: { schoolId: session.schoolId },
    orderBy: { startDate: "asc" },
  });
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Exam Schedule</h1>
        <p className="text-sm text-slate-600 mt-1">Upcoming examination dates</p>
      </div>
      {exams.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No exams scheduled.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <Card key={exam.id}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{exam.name}</p>
                  <p className="text-xs text-slate-500">{exam.examType}</p>
                </div>
                <p className="text-sm font-medium text-slate-700">{exam.startDate ? new Date(exam.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
