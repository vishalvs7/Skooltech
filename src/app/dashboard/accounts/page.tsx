import { getSession } from "@/lib/auth";
import { assignFeePackageAction } from "@/actions/student.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, Receipt, AlertCircle, Printer, CheckCircle2, ArrowRight } from "lucide-react";
import { CashCollectionModal } from "@/components/accounts/CashCollectionModal";
import { FeeStructureModal } from "@/components/accounts/FeeStructureModal";

export default async function AccountsDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Modals */}
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success" className="text-xs uppercase font-medium">Accounts & Cash Desk</Badge>
            <span className="text-xs text-slate-500 font-mono">Currency: INR (₹)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Counter Fee Collection & Setup
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Process counter payments (Cash, UPI UTR, Bank Drafts), calculate dynamic late fees, and auto-print receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FeeStructureModal />
          <CashCollectionModal />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Total Collected (Q1)</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700 flex items-center justify-between">
              ₹3,51,000
              <IndianRupee className="h-5 w-5 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">26 Invoices Settled (Cash + UPI)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Overdue Balance</CardDescription>
            <CardTitle className="text-2xl font-bold text-rose-600 flex items-center justify-between">
              ₹1,89,000
              <AlertCircle className="h-5 w-5 text-rose-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">14 Invoices with dynamic daily late fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Billing Mode</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-between">
              Quarterly
              <Receipt className="h-5 w-5 text-blue-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">CBSE Standard (Apr, Jul, Oct, Jan)</p>
          </CardContent>
        </Card>
      </div>

      {/* Step 4C: Pending Fee Package Setup Queue */}
      <Card className="border-amber-200 bg-amber-50/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span>Pending Fee Structure Setup (Step 4C)</span>
                <Badge variant="warning" className="text-[10px]">Action Required</Badge>
              </CardTitle>
              <CardDescription>
                Assign fee category and generate initial billing invoice to activate student into school system.
              </CardDescription>
            </div>
            <Badge variant="secondary">1 Student Waiting</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-[4px] border border-slate-200 bg-white overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-2 font-semibold text-slate-700 grid grid-cols-5 border-b border-slate-200">
              <span>Admission No</span>
              <span>Student Full Name</span>
              <span>Assigned Class</span>
              <span>Current Status</span>
              <span>Fee Package Assignment</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 items-center">
              <span className="font-mono font-semibold text-blue-700">ADM-2026-092</span>
              <span className="font-semibold text-slate-900">Pooja Malhotra</span>
              <span className="text-slate-800 font-medium">Class 5 - Sec A (#26)</span>
              <span>
                <Badge variant="warning" className="text-[10px]">PENDING_FEE</Badge>
              </span>
              <div>
                <form
                  action={async (formData) => {
                    "use server";
                    await assignFeePackageAction(formData);
                  }}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="studentId" value="ADM-2026-092" />
                  <select
                    name="feeStructureId"
                    className="h-7 text-xs rounded-[4px] border border-slate-200 bg-white px-2 focus:border-blue-600"
                  >
                    <option value="fee-primary-qtr">Primary Standard (₹13,500/Qtr)</option>
                    <option value="fee-primary-monthly">Primary Standard (₹4,500/Mo)</option>
                  </select>
                  <Button size="sm" type="submit" variant="success" className="h-7 text-xs px-2.5">
                    Activate <CheckCircle2 className="h-3 w-3 ml-1" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Desk Overview & Recent Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Counter Transactions (Step 6)</CardTitle>
              <CardDescription>
                Immutable transaction vouchers generated with thermal receipt ready formatting.
              </CardDescription>
            </div>
            <CashCollectionModal />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-[4px] border border-slate-200 overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-2 font-semibold text-slate-700 grid grid-cols-5 border-b border-slate-200">
              <span>Receipt No</span>
              <span>Student / Admission No</span>
              <span>Payment Mode</span>
              <span>Amount Paid</span>
              <span>Status</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center">
              <span className="font-mono font-semibold text-blue-700">RCP-2026-0001</span>
              <span className="text-slate-800 font-medium">Aarav Sharma (ADM-1001)</span>
              <div>
                <Badge variant="default" className="text-[10px]">UPI (UTR verified)</Badge>
              </div>
              <span className="font-bold text-slate-900 font-mono">₹13,500.00</span>
              <div>
                <Badge variant="success" className="text-[10px]">SETTLED</Badge>
              </div>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center">
              <span className="font-mono font-semibold text-blue-700">RCP-2026-0002</span>
              <span className="text-slate-800 font-medium">Ananya Iyer (ADM-1002)</span>
              <div>
                <Badge variant="secondary" className="text-[10px]">CASH ON DESK</Badge>
              </div>
              <span className="font-bold text-slate-900 font-mono">₹13,500.00</span>
              <div>
                <Badge variant="success" className="text-[10px]">SETTLED</Badge>
              </div>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 items-center">
              <span className="font-mono font-semibold text-blue-700">RCP-2026-0003</span>
              <span className="text-slate-800 font-medium">Vihaan Patel (ADM-1003)</span>
              <div>
                <Badge variant="outline" className="text-[10px]">BANK DRAFT (SBI)</Badge>
              </div>
              <span className="font-bold text-slate-900 font-mono">₹13,500.00</span>
              <div>
                <Badge variant="success" className="text-[10px]">SETTLED</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
