import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";

export default async function GatewayTransactionsPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const payments = await prisma.paymentTransaction.findMany({
    where: { schoolId: session.schoolId },
    include: { invoice: { include: { student: { select: { fullName: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gateway Transactions</h1>
        <p className="text-sm text-slate-600 mt-1">All payment transactions</p>
      </div>
      {payments.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No transactions yet.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Receipt</th>
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-center py-3 px-4">Method</th>
                  <th className="text-right py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{p.receiptNo}</td>
                    <td className="py-3 px-4 text-slate-800">{p.invoice?.student?.fullName || "—"}</td>
                    <td className="text-right py-3 px-4 font-mono font-bold">₹{Number(p.amountPaid).toLocaleString("en-IN")}</td>
                    <td className="text-center py-3 px-4 text-slate-600">{p.paymentMethod}</td>
                    <td className="text-right py-3 px-4 text-slate-500">{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
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
