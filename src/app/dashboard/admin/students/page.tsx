import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminStudentsPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const students = await prisma.student.findMany({
    where: { schoolId: session.schoolId },
    include: {
      enrollments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { section: { include: { class: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Lifecycle</h1>
        <p className="text-sm text-slate-600 mt-1">Manage admissions, enrollments and student records</p>
      </div>
      {students.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No students enrolled yet.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Admission No</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Class</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => {
                  const e = s.enrollments[0];
                  const cls = e?.section?.class?.name || "—";
                  const section = e?.section?.name || "";
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-semibold text-blue-700">{s.admissionNo}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{s.fullName}</td>
                      <td className="py-3 px-4 text-slate-600">{cls}{section ? ` - ${section}` : ""}</td>
                      <td className="text-center py-3 px-4"><Badge variant="outline" className="text-[10px]">{s.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
