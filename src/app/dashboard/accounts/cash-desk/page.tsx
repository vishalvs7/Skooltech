import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";

export default async function AccountsCashDeskPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const pending = await prisma.feeInvoice.findMany({
    where: { schoolId: session.schoolId, isPaid: false },
    include: { student: { select: { fullName: true, admissionNo: true } } },
    orderBy: { dueDate: "asc" },
    take: 20,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cash Desk</h1>
        <p className="text-sm text-slate-600 mt-1">Collect fee payments and generate receipts</p>
      </div>
      {pending.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-emerald-700 text-sm font-medium">No pending invoices — all fees collected!</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Invoice</th>
                  <th className="text-right py-3 px-4">Balance</th>
                  <th className="text-center py-3 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pending.map((inv) => {
                  const balance = Number(inv.baseAmount) - Number(inv.paidAmount);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4"><p className="font-medium text-slate-800">{inv.student?.fullName}</p><p className="text-[10px] text-slate-500">{inv.student?.admissionNo}</p></td>
                      <td className="py-3 px-4 text-slate-600">{inv.title}</td>
                      <td className="text-right py-3 px-4 font-mono font-bold text-red-700">₹{balance.toLocaleString("en-IN")}</td>
                      <td className="text-center py-3 px-4 text-slate-500">{new Date(inv.dueDate).toLocaleDateString("en-IN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
