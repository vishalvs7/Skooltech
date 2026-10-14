import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminAcademicsPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const classes = await prisma.class.findMany({
    where: { schoolId: session.schoolId },
    include: { sections: { include: { classTeacher: { select: { fullName: true } } } } },
    orderBy: { numericOrder: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Structure</h1>
        <p className="text-sm text-slate-600 mt-1">Classes, sections & scheduling</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Classes & Sections</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {classes.length === 0 ? <p className="text-sm text-slate-500">No classes configured.</p> : classes.map((c) => (
            <div key={c.id} className="py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">{c.name}</span>
                <span className="text-xs text-slate-500">{c.sections.length} section{c.sections.length !== 1 ? "s" : ""}</span>
              </div>
              {c.sections.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.sections.map((sec) => (
                    <span key={sec.id} className="text-[10px] px-2 py-1 bg-slate-100 rounded-[4px] text-slate-600">
                      {sec.name} {sec.classTeacher ? `• ${sec.classTeacher.fullName}` : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
