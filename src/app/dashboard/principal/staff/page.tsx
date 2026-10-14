import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";

export default async function PrincipalStaffPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const teachers = await prisma.teacher.findMany({
    where: { user: { schoolId: session.schoolId } },
    include: { user: { select: { role: true } }, managedSection: { include: { class: true } } },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Overview</h1>
        <p className="text-sm text-slate-600 mt-1">Teaching and non-teaching staff</p>
      </div>
      {teachers.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No staff records.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {teachers.map((t) => (
            <Card key={t.id}><CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-slate-800">{t.fullName}</p>
                <p className="text-xs text-slate-500">{t.designation || t.user?.role || "—"}</p>
              </div>
              {t.managedSection && (
                <p className="text-xs text-slate-600">Class Teacher: {t.managedSection.class.name} - {t.managedSection.name}</p>
              )}
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  );
}
