import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";

export default async function PrincipalWelfarePage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const disputes = await prisma.attendanceDispute.count({ where: { schoolId: session.schoolId } });
  const leaves = await prisma.leaveApplication.count({ where: { schoolId: session.schoolId, status: "PENDING" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Welfare</h1>
        <p className="text-sm text-slate-600 mt-1">Attendance disputes, leave requests and student wellbeing</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Pending Leaves</p><p className="text-3xl font-bold text-amber-700 mt-1">{leaves}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Attendance Disputes</p><p className="text-3xl font-bold text-red-700 mt-1">{disputes}</p></CardContent></Card>
      </div>
    </div>
  );
}
