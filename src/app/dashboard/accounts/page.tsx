import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, AlertCircle, Receipt, TrendingUp } from "lucide-react";
import { CashCollectionModal, type OverdueStudent } from "@/components/accounts/CashCollectionModal";
import { FeeStructureModal } from "@/components/accounts/FeeStructureModal";

export default async function AccountsOverviewPage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const schoolId = session.schoolId;

  // Fetch real financial data
  const [
    totalCollected,
    todayCollected,
    totalOutstanding,
    overdueCount,
    pendingFeeStudents,
    recentTransactions,
    totalInvoices,
    paidInvoices,
    overdueInvoicesList,
  ] = await Promise.all([
    prisma.paymentTransaction.aggregate({
      where: { schoolId },
      _sum: { amountPaid: true },
    }),
    prisma.paymentTransaction.aggregate({
      where: {
        schoolId,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
      _sum: { amountPaid: true },
    }),
    prisma.feeInvoice.aggregate({
      where: { schoolId, isPaid: false },
      _sum: { baseAmount: true, paidAmount: true },
    }),
    prisma.feeInvoice.count({
      where: {
        schoolId,
        isPaid: false,
        dueDate: { lt: new Date() },
      },
    }),
    prisma.student.count({
      where: { schoolId, status: "PENDING_FEE" },
    }),
    prisma.paymentTransaction.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        invoice: {
          include: {
            student: { select: { fullName: true, admissionNo: true } },
          },
        },
      },
    }),
    prisma.feeInvoice.count({ where: { schoolId } }),
    prisma.feeInvoice.count({ where: { schoolId, isPaid: true } }),
    prisma.feeInvoice.findMany({
      where: { schoolId, isPaid: false },
      include: {
        student: {
          select: {
            fullName: true,
            admissionNo: true,
            enrollments: {
              orderBy: { createdAt: "desc" },
              take: 1,
              include: { section: { include: { class: true } } },
            },
          },
        },
      },
      orderBy: { dueDate: "asc" },
      take: 10,
    }),
  ]);

  const overdueStudents: OverdueStudent[] = overdueInvoicesList.map((inv) => ({
    admissionNo: inv.student.admissionNo,
    name: inv.student.fullName,
    className: inv.student.enrollments[0]
      ? `${inv.student.enrollments[0].section.class.name} - Sec ${inv.student.enrollments[0].section.name}`
      : "N/A",
    rollNo: inv.student.enrollments[0]?.rollNo || "—",
    baseAmount: Number(inv.baseAmount),
    paidAmount: Number(inv.paidAmount),
    dueDate: inv.dueDate.toISOString().split("T")[0],
  }));

  const totalCollectedAmt = Number(totalCollected._sum.amountPaid || 0);
  const todayCollectedAmt = Number(todayCollected._sum.amountPaid || 0);
  const outstandingAmt = totalOutstanding._sum.baseAmount
    ? Number(totalOutstanding._sum.baseAmount) - Number(totalOutstanding._sum.paidAmount || 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success" className="text-xs uppercase">Accounts & Cash Desk</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Counter Fee Collection & Setup</h1>
          <p className="text-sm text-slate-600 mt-0.5">Process payments, calculate late fees, and print receipts.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FeeStructureModal />
          <CashCollectionModal overdueStudents={overdueStudents} />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Total Collected</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">
                  ₹{(totalCollectedAmt / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Today: ₹{todayCollectedAmt.toLocaleString("en-IN")}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Overdue Balance</p>
                <p className="text-3xl font-bold text-rose-600 mt-1">
                  ₹{(outstandingAmt / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-rose-600 mt-1">{overdueCount} Invoices overdue</p>
              </div>
              <AlertCircle className="h-8 w-8 text-rose-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Invoice Status</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {paidInvoices}/{totalInvoices}
                </p>
                <p className="text-xs text-slate-500 mt-1">Paid / Total</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Fee Assignment */}
      {pendingFeeStudents > 0 && (
        <Card className="border-amber-200 bg-amber-50/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Pending Fee Structure Setup</CardTitle>
                <CardDescription>Students awaiting fee package assignment</CardDescription>
              </div>
              <Badge variant="warning">{pendingFeeStudents} Student{pendingFeeStudents !== 1 ? "s" : ""} Waiting</Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Counter Transactions</CardTitle>
              <CardDescription>Latest fee collections</CardDescription>
            </div>
            <CashCollectionModal />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentTransactions.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">No transactions recorded yet.</p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                  <th className="text-left py-3 px-4">Receipt No</th>
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-center py-3 px-4">Method</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-center py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{tx.receiptNo}</td>
                    <td className="py-3 px-4 text-slate-800">
                      {tx.invoice.student.fullName} ({tx.invoice.student.admissionNo})
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge
                        variant={tx.paymentMethod === "UPI" ? "default" : tx.paymentMethod === "CASH" ? "secondary" : "outline"}
                        className="text-[10px]"
                      >
                        {tx.paymentMethod}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4 font-mono font-bold text-slate-900">
                      ₹{Number(tx.amountPaid).toLocaleString("en-IN")}
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="success" className="text-[10px]">SETTLED</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
