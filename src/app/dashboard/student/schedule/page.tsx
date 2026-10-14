import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentSchedulePage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const student = await prisma.student.findFirst({
    where: { userId: session.userId, schoolId: session.schoolId },
    include: { enrollments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  const sectionId = student?.enrollments[0]?.sectionId;
  const timetable = sectionId ? await prisma.timetable.findMany({
    where: { sectionId },
    orderBy: [{ dayOfWeek: "asc" }, { periodNo: "asc" }],
  }) : [];

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Schedule</h1>
        <p className="text-sm text-slate-600 mt-1">Weekly class timetable</p>
      </div>
      {timetable.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No timetable published yet.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].filter((d) => timetable.some((t) => t.dayOfWeek === d)).map((day) => (
            <Card key={day}>
              <CardHeader className="pb-2"><CardTitle className="text-sm">{days[day]}</CardTitle></CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {timetable.filter((t) => t.dayOfWeek === day).map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-4 w-16 text-slate-500 font-medium">P{t.periodNo}</td>
                        <td className="py-2 px-4 font-medium text-slate-800">{t.subject}</td>
                        <td className="py-2 px-4 text-slate-500">{t.startTime} - {t.endTime}</td>
                        {t.roomNo && <td className="py-2 px-4 text-slate-500">Room {t.roomNo}</td>}
                      </tr>
                    ))}
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
