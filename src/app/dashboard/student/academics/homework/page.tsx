import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function StudentHomeworkPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const student = await prisma.student.findFirst({
    where: { userId: session.userId, schoolId: session.schoolId },
    include: { enrollments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  const sectionId = student?.enrollments[0]?.sectionId;
  const homework = sectionId ? await prisma.homework.findMany({
    where: { sectionId },
    orderBy: { dueDate: "asc" },
  }) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Homework</h1>
        <p className="text-sm text-slate-600 mt-1">Your current assignments</p>
      </div>
      {homework.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No homework assigned yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {homework.map((hw) => (
            <Card key={hw.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{hw.title}</p>
                    <p className="text-xs text-slate-500">{hw.subject} • Due: {new Date(hw.dueDate).toLocaleDateString("en-IN")}</p>
                  </div>
                  <Badge variant="outline">{hw.subject}</Badge>
                </div>
                {hw.description && <p className="text-xs text-slate-600 mt-2">{hw.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
