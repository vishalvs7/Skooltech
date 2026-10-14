import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function StudentFeesPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const student = await prisma.student.findFirst({
    where: { userId: session.userId, schoolId: session.schoolId },
  });
  const invoices = student ? await prisma.feeInvoice.findMany({
    where: { studentId: student.id },
    orderBy: { dueDate: "asc" },
  }) : [];

  const totalDue = invoices.reduce((s, i) => s + Number(i.baseAmount) - Number(i.paidAmount), 0);
  const paid = invoices.reduce((s, i) => s + Number(i.paidAmount), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Fees</h1>
        <p className="text-sm text-slate-600 mt-1">Your fee invoices and payment status</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Total Invoices</p><p className="text-3xl font-bold text-blue-700 mt-1">{invoices.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Paid</p><p className="text-3xl font-bold text-emerald-700 mt-1">₹{paid.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Outstanding</p><p className="text-3xl font-bold text-red-700 mt-1">₹{totalDue.toLocaleString("en-IN")}</p></CardContent></Card>
      </div>
      {invoices.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-500 text-sm">No fee invoices generated yet.</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Invoice</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-center py-3 px-4">Due Date</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-slate-800">{inv.title}</td>
                    <td className="text-right py-3 px-4 font-mono">₹{Number(inv.baseAmount).toLocaleString("en-IN")}</td>
                    <td className="text-center py-3 px-4 text-slate-500">{new Date(inv.dueDate).toLocaleDateString("en-IN")}</td>
                    <td className="text-center py-3 px-4"><Badge variant={inv.isPaid ? "success" : "warning"}>{inv.isPaid ? "PAID" : "PENDING"}</Badge></td>
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
