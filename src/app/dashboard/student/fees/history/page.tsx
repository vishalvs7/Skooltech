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


  const transactions = await prisma.paymentTransaction.findMany({
    where: { invoice: { student: { userId: session.userId, schoolId: session.schoolId } } },
    include: { invoice: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment History</h1>
        <p className="text-sm text-slate-600 mt-1">All your fee transactions</p>
      </div>
      {transactions.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No payments recorded yet.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Receipt</th>
                  <th className="text-left py-3 px-4">Invoice</th>
                  <th className="text-center py-3 px-4">Method</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{tx.receiptNo}</td>
                    <td className="py-3 px-4 text-slate-800">{tx.invoice.title}</td>
                    <td className="text-center py-3 px-4"><Badge variant="outline" className="text-[10px]">{tx.paymentMethod}</Badge></td>
                    <td className="text-right py-3 px-4 font-mono font-bold">₹{Number(tx.amountPaid).toLocaleString("en-IN")}</td>
                    <td className="text-right py-3 px-4 text-slate-500">{new Date(tx.createdAt).toLocaleDateString("en-IN")}</td>
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
