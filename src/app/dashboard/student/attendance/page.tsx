import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function StudentAttendancePage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const student = await prisma.student.findFirst({
    where: { userId: session.userId, schoolId: session.schoolId },
  });
  const records = student ? await prisma.attendance.findMany({
    where: { schoolId: session.schoolId, enrollment: { studentId: student.id } },
    include: { enrollment: { include: { student: true } } },
    orderBy: { date: "desc" },
    take: 30,
  }) : [];

  const present = records.filter((r) => r.status === "PRESENT").length;
  const total = records.length;
  const pct = total > 0 ? ((present / total) * 100).toFixed(1) : "0";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Attendance</h1>
        <p className="text-sm text-slate-600 mt-1">Your attendance records</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Total Days</p><p className="text-3xl font-bold text-blue-700 mt-1">{total}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Present</p><p className="text-3xl font-bold text-emerald-700 mt-1">{present}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Percentage</p><p className="text-3xl font-bold text-slate-900 mt-1">{pct}%</p></CardContent></Card>
      </div>
      {records.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No attendance records found.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">{new Date(r.date).toLocaleDateString("en-IN")}</td>
                    <td className="text-center py-3 px-4"><Badge variant={r.status === "PRESENT" ? "success" : r.status === "LATE" ? "warning" : "danger"}>{r.status}</Badge></td>
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
