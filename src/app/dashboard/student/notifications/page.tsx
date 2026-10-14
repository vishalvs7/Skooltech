import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";

export default async function StudentNotificationsPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const notices = await prisma.notice.findMany({
    where: { schoolId: session.schoolId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-600 mt-1">School notifications and announcements</p>
      </div>
      {notices.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No notifications.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <Card key={n.id}>
              <CardContent className="p-4">
                <p className="font-semibold text-sm text-slate-900">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.content}</p>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString("en-IN")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
