import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Page() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;


  const student = await prisma.student.findFirst({
    where: { userId: session.userId, schoolId: session.schoolId },
  });
  const leaves = student ? await prisma.leaveApplication.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
  }) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Leave History</h1>
        <p className="text-sm text-slate-600 mt-1">All your leave applications</p>
      </div>
      {leaves.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No leave applications yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {leaves.map((leave) => (
            <Card key={leave.id}>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{leave.reason}</p>
                  <p className="text-xs text-slate-500">{new Date(leave.startDate).toLocaleDateString("en-IN")} — {new Date(leave.endDate).toLocaleDateString("en-IN")}</p>
                  {leave.remarks && <p className="text-xs text-slate-600 mt-1 italic">Teacher: {leave.remarks}</p>}
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
