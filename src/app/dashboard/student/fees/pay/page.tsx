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


  const invoices = await prisma.feeInvoice.findMany({
    where: { student: { userId: session.userId, schoolId: session.schoolId }, isPaid: false },
    orderBy: { dueDate: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pay Fees Online</h1>
        <p className="text-sm text-slate-600 mt-1">Secure online payment via BYOG gateway</p>
      </div>
      {invoices.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-emerald-700 text-sm font-medium">All fees are paid up to date! No pending invoices.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => {
            const balance = Number(inv.baseAmount) - Number(inv.paidAmount);
            return (
              <Card key={inv.id}>
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{inv.title}</p>
                    <p className="text-xs text-slate-500">Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">₹{balance.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-slate-500">Outstanding</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
