import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AccountsFeesPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const structures = await prisma.feeStructure.findMany({
    where: { schoolId: session.schoolId },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fee Management</h1>
        <p className="text-sm text-slate-600 mt-1">Fee structures and schedules</p>
      </div>
      {structures.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No fee structures configured.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-center py-3 px-4">Cycle</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-center py-3 px-4">Grace Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {structures.map((fs) => (
                  <tr key={fs.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">{fs.name}</td>
                    <td className="text-center py-3 px-4"><Badge variant="outline" className="text-[10px]">{fs.cycle}</Badge></td>
                    <td className="text-right py-3 px-4 font-mono font-bold">₹{Number(fs.amount).toLocaleString("en-IN")}</td>
                    <td className="text-center py-3 px-4 text-slate-600">{fs.graceDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
