import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";

export default async function PrincipalAttendancePage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const records = await prisma.attendance.findMany({
    where: { schoolId: session.schoolId, date: { gte: today } },
  });
  const present = records.filter((r) => r.status === "PRESENT").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;
  const total = records.length;
  const pct = total > 0 ? ((present / total) * 100).toFixed(1) : "0";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance Overview</h1>
        <p className="text-sm text-slate-600 mt-1">School-wide attendance monitoring</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Total Records</p><p className="text-3xl font-bold text-blue-700 mt-1">{total}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Present</p><p className="text-3xl font-bold text-emerald-700 mt-1">{present}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Absent</p><p className="text-3xl font-bold text-red-700 mt-1">{absent}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Attendance %</p><p className="text-3xl font-bold text-slate-900 mt-1">{pct}%</p></CardContent></Card>
      </div>
    </div>
  );
}
