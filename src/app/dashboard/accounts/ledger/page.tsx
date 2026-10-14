import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";

export default async function AccountsLedgerPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const students = await prisma.student.findMany({
    where: { schoolId: session.schoolId },
    include: {
      feeInvoices: {
        include: { transactions: true },
      },
    },
    orderBy: { fullName: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Ledger</h1>
        <p className="text-sm text-slate-600 mt-1">Complete fee ledger per student</p>
      </div>
      {students.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No student records.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-center py-3 px-4">Invoices</th>
                  <th className="text-center py-3 px-4">Payments</th>
                  <th className="text-right py-3 px-4">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => {
                  const totalDue = s.feeInvoices.reduce((sum, i) => sum + Number(i.baseAmount) - Number(i.paidAmount), 0);
                  const paymentCount = s.feeInvoices.reduce((c, i) => c + i.transactions.length, 0);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4"><p className="font-medium text-slate-800">{s.fullName}</p><p className="text-[10px] text-slate-500">{s.admissionNo}</p></td>
                      <td className="text-center py-3 px-4">{s.feeInvoices.length}</td>
                      <td className="text-center py-3 px-4">{paymentCount}</td>
                      <td className={`text-right py-3 px-4 font-mono font-bold ${totalDue > 0 ? "text-red-700" : "text-emerald-700"}`}>₹{totalDue.toLocaleString("en-IN")}</td>
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
