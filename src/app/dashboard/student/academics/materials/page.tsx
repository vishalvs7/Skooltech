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


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Study Material</h1>
        <p className="text-sm text-slate-600 mt-1">Reference books and resources shared by teachers</p>
      </div>
      <Card><CardContent className="p-8 text-center text-slate-500 text-sm">Study materials will be shared by your subject teachers.</CardContent></Card>
    </div>
  );
}
