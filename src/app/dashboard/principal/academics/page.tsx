import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";

export default async function PrincipalAcademicsPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const classes = await prisma.class.count({ where: { schoolId: session.schoolId } });
  const exams = await prisma.exam.count({ where: { schoolId: session.schoolId } });
  const students = await prisma.student.count({ where: { schoolId: session.schoolId, status: "ACTIVE" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academics</h1>
        <p className="text-sm text-slate-600 mt-1">Academic performance and curriculum overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Classes</p><p className="text-3xl font-bold text-blue-700 mt-1">{classes}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Active Students</p><p className="text-3xl font-bold text-emerald-700 mt-1">{students}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Exams</p><p className="text-3xl font-bold text-slate-900 mt-1">{exams}</p></CardContent></Card>
      </div>
    </div>
  );
}
