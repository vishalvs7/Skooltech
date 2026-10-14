import { archiveContext, requireArchiveStudent } from "@/lib/archive";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ArchiveFeesPage({
  params,
}: PageProps<"/dashboard/archive/[studentId]/fees">) {
  const ctx = await archiveContext();
  if (!ctx.dbReady) return <DatabaseSetupNotice />;

  const { studentId } = await params;
  const student = await requireArchiveStudent(ctx.session.schoolId, studentId);

  const invoices = await prisma.feeInvoice.findMany({
    where: { studentId: student.id },
    include: { transactions: { orderBy: { createdAt: "desc" } } },
    orderBy: { dueDate: "asc" },
  });

  const totalBilled = invoices.reduce((s, i) => s + Number(i.baseAmount), 0);
  const totalPaid = invoices.reduce((s, i) => s + Number(i.paidAmount), 0);
  const outstanding = totalBilled - totalPaid;

  const allPayments = invoices.flatMap((i) =>
    i.transactions.map((t) => ({ ...t, invoiceTitle: i.title }))
  );
  allPayments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Total Billed</p><p className="text-2xl font-bold text-blue-700 mt-1">₹{totalBilled.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Total Paid</p><p className="text-2xl font-bold text-emerald-700 mt-1">₹{totalPaid.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Outstanding</p><p className={`text-2xl font-bold mt-1 ${outstanding > 0 ? "text-rose-700" : "text-slate-900"}`}>₹{outstanding.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-[11px] text-slate-500 uppercase font-semibold">Invoices</p><p className="text-2xl font-bold text-slate-900 mt-1">{invoices.length}</p></CardContent></Card>
      </div>
      <h2 className="text-sm font-semibold text-slate-800 mb-3">Fee Invoices</h2>
      {invoices.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="p-8 text-center text-slate-500 text-sm">
            No fee invoices generated for this student yet.
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Invoice</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Paid</th>
                  <th className="text-right py-3 px-4">Balance</th>
                  <th className="text-center py-3 px-4">Due Date</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => {
                  const balance = Number(inv.baseAmount) - Number(inv.paidAmount);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-800">{inv.title}</td>
                      <td className="text-right py-3 px-4 font-mono">₹{Number(inv.baseAmount).toLocaleString("en-IN")}</td>
                      <td className="text-right py-3 px-4 font-mono text-emerald-700">₹{Number(inv.paidAmount).toLocaleString("en-IN")}</td>
                      <td className={`text-right py-3 px-4 font-mono font-semibold ${balance > 0 ? "text-rose-700" : "text-slate-500"}`}>₹{balance.toLocaleString("en-IN")}</td>
                      <td className="text-center py-3 px-4 text-slate-600">
                        {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant={inv.isPaid ? "success" : "warning"} className="text-[10px]">
                          {inv.isPaid ? "PAID" : "PENDING"}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4 text-slate-600">{inv.transactions.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      <h2 className="text-sm font-semibold text-slate-800 mb-3">Payment History</h2>
      {allPayments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500 text-sm">No payments recorded yet.</CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Receipt No</th>
                  <th className="text-left py-3 px-4">Invoice</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-center py-3 px-4">Method</th>
                  <th className="text-right py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{p.receiptNo}</td>
                    <td className="py-3 px-4 text-slate-700">{p.invoiceTitle}</td>
                    <td className="text-right py-3 px-4 font-mono font-bold">₹{Number(p.amountPaid).toLocaleString("en-IN")}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline" className="text-[10px]">{p.paymentMethod}</Badge>
                    </td>
                    <td className="text-right py-3 px-4 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
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
