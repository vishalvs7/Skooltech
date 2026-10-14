import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TeacherAttendancePage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const teacher = await prisma.teacher.findFirst({ where: { userId: session.userId } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = teacher ? await prisma.attendance.findMany({
    where: {
      schoolId: session.schoolId,
      date: { gte: today },
      enrollment: { section: { classTeacherId: teacher.id } },
    },
    include: { enrollment: { include: { student: { select: { fullName: true, admissionNo: true } } } } },
  }) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance</h1>
        <p className="text-sm text-slate-600 mt-1">Mark and review class attendance</p>
      </div>
      {attendance.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No attendance marked yet for today.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Admission No</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">{a.enrollment?.student?.fullName}</td>
                    <td className="py-3 px-4 text-slate-600">{a.enrollment?.student?.admissionNo}</td>
                    <td className="text-center py-3 px-4"><Badge variant={a.status === "PRESENT" ? "success" : "danger"}>{a.status}</Badge></td>
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
