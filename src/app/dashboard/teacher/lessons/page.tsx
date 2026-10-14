import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TeacherLessonsPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const lessons = await prisma.lessonPlan.findMany({
    where: { schoolId: session.schoolId, createdById: session.userId },
    orderBy: { weekStart: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lesson Planning</h1>
        <p className="text-sm text-slate-600 mt-1">Plan and track your weekly lessons</p>
      </div>
      {lessons.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No lesson plans created yet. Create your first lesson plan to get started.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <Card key={lesson.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{lesson.subject}</p>
                    <p className="text-xs text-slate-500">Week of {new Date(lesson.weekStart).toLocaleDateString("en-IN")}</p>
                  </div>
                  <Badge variant="outline">Wk {new Date(lesson.weekStart).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</Badge>
                </div>
                <p className="text-xs text-slate-600 mt-2"><span className="font-medium">Topics:</span> {lesson.topics}</p>
                {lesson.objectives && <p className="text-xs text-slate-500 mt-1"><span className="font-medium">Objectives:</span> {lesson.objectives}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
