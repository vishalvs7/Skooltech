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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Receipts</h1>
        <p className="text-sm text-slate-600 mt-1">Download fee payment receipts</p>
      </div>
      {transactions.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No receipts available.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((tx) => (
            <Card key={tx.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-blue-700 text-sm">{tx.receiptNo}</span>
                  <Badge variant="success" className="text-[10px]">PAID</Badge>
                </div>
                <p className="text-xs text-slate-500 mb-1">{tx.invoice.title}</p>
                <p className="text-xl font-bold text-slate-900">₹{Number(tx.amountPaid).toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(tx.createdAt).toLocaleDateString("en-IN")} • {tx.paymentMethod}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
