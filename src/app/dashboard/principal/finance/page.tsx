import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";

export default async function PrincipalFinancePage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const invoices = await prisma.feeInvoice.findMany({ where: { schoolId: session.schoolId } });
  const totalDue = invoices.reduce((s, i) => s + Number(i.baseAmount) - Number(i.paidAmount), 0);
  const paid = invoices.reduce((s, i) => s + Number(i.paidAmount), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fee & Finance</h1>
        <p className="text-sm text-slate-600 mt-1">Financial overview and fee collection summary</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Total Collected</p><p className="text-3xl font-bold text-emerald-700 mt-1">₹{paid.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Outstanding</p><p className="text-3xl font-bold text-red-700 mt-1">₹{totalDue.toLocaleString("en-IN")}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-500 uppercase font-semibold">Invoices</p><p className="text-3xl font-bold text-slate-900 mt-1">{invoices.length}</p></CardContent></Card>
      </div>
    </div>
  );
}
