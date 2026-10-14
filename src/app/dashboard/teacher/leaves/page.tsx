import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TeacherLeavesPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const teacher = await prisma.teacher.findFirst({ where: { userId: session.userId } });
  const leaves = teacher ? await prisma.leaveApplication.findMany({
    where: {
      schoolId: session.schoolId,
      student: { enrollments: { some: { section: { classTeacherId: teacher.id } } } },
    },
    include: { student: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
  }) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leave Management</h1>
        <p className="text-sm text-slate-600 mt-1">Review and approve student leave applications</p>
      </div>
      {leaves.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No leave applications to review.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {leaves.map((leave) => (
            <Card key={leave.id}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{leave.student?.fullName}</p>
                  <p className="text-xs text-slate-500">{leave.reason}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(leave.startDate).toLocaleDateString("en-IN")} — {new Date(leave.endDate).toLocaleDateString("en-IN")}</p>
                </div>
                <Badge variant={leave.status === "APPROVED" ? "success" : leave.status === "REJECTED" ? "danger" : "warning"}>{leave.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
