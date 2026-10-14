"use client";

import { useState, useActionState, useEffect } from "react";
import { collectCounterPaymentAction, FeePaymentResponse } from "@/actions/fee.actions";
import { calculateDynamicLateFee } from "@/lib/fee-calculator";
import { FeeReceiptModal, FeeReceiptData } from "@/components/accounts/FeeReceiptModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IndianRupee,
  X,
  Search,
  AlertCircle,
  Banknote,
} from "lucide-react";

export interface OverdueStudent {
  admissionNo: string;
  name: string;
  className: string;
  rollNo: string;
  baseAmount: number;
  paidAmount: number;
  dueDate: string;
}

interface CashCollectionModalProps {
  overdueStudents?: OverdueStudent[];
}

export function CashCollectionModal({ overdueStudents = [] }: CashCollectionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<OverdueStudent | null>(overdueStudents[0] || null);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI" | "BANK_DRAFT">("UPI");
  const [activeReceipt, setActiveReceipt] = useState<FeeReceiptData | null>(null);

  const [state, formAction, isPending] = useActionState<FeePaymentResponse | null, FormData>(
    collectCounterPaymentAction,
    null
  );

  useEffect(() => {
    if (state?.success && state.receiptData) {
      setActiveReceipt(state.receiptData);
      setIsOpen(false);
    }
  }, [state]);

  const filteredStudents = overdueStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lateFeeInfo = selectedStudent
    ? calculateDynamicLateFee(selectedStudent.dueDate, selectedStudent.baseAmount)
    : null;

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="font-medium flex items-center gap-1.5"
      >
        <Banknote className="h-4 w-4" />
        Collect Fee Payment
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-[4px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Collect Counter Fee Payment</h3>
                  <p className="text-xs text-slate-500">Cash / UPI / Bank Draft</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Student Search */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Search Student</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Admission No or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 text-sm rounded-[4px] border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                  />
                </div>
                {searchQuery && filteredStudents.length > 0 && (
                  <div className="mt-1 max-h-40 overflow-y-auto border border-slate-200 rounded-[4px] divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                      <button
                        key={s.admissionNo}
                        type="button"
                        onClick={() => { setSelectedStudent(s); setSearchQuery(""); }}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{s.name}</p>
                          <p className="text-slate-500 font-mono">{s.admissionNo} • {s.className}</p>
                        </div>
                        <span className="font-mono text-slate-700">₹{(s.baseAmount - s.paidAmount).toLocaleString("en-IN")}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Student */}
              {selectedStudent ? (
                <div className="p-4 rounded-[4px] border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900">{selectedStudent.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{selectedStudent.admissionNo} • {selectedStudent.className}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">₹{(selectedStudent.baseAmount - selectedStudent.paidAmount).toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-slate-500">Outstanding</p>
                    </div>
                  </div>
                  {lateFeeInfo && lateFeeInfo.lateFee > 0 && (
                    <p className="text-xs text-amber-700 mt-2">
                      Late fee: ₹{lateFeeInfo.lateFee} ({lateFeeInfo.overdueDays} days overdue)
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-[4px]">
                  {overdueStudents.length === 0
                    ? "No students with outstanding fees found."
                    : "Search and select a student to collect payment."}
                </div>
              )}

              {/* Payment Form */}
              {selectedStudent && (
                <form action={formAction} className="space-y-3">
                  <input type="hidden" name="admissionNo" value={selectedStudent.admissionNo} />
                  <input type="hidden" name="amountPaid" value={selectedStudent.baseAmount - selectedStudent.paidAmount} />
                  <input type="hidden" name="lateFeeCharged" value={lateFeeInfo?.lateFee || 0} />

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["CASH", "UPI", "BANK_DRAFT"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`h-9 rounded-[4px] border text-xs font-semibold transition-colors ${
                            paymentMethod === method
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {method === "BANK_DRAFT" ? "Draft" : method}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="paymentMethod" value={paymentMethod} />
                  </div>

                  {paymentMethod === "UPI" && (
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">UPI UTR Reference</label>
                      <Input name="referenceNo" placeholder="12-digit UTR number" className="h-9 text-sm font-mono" />
                    </div>
                  )}

                  {paymentMethod === "BANK_DRAFT" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1.5">Draft Number</label>
                        <Input name="referenceNo" placeholder="Draft No" className="h-9 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1.5">Bank Name</label>
                        <Input name="bankName" placeholder="Issuing Bank" className="h-9 text-sm" />
                      </div>
                    </div>
                  )}

                  {state?.error && (
                    <div className="p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{state.error}</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)} disabled={isPending}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={isPending} className="bg-emerald-700 hover:bg-emerald-800">
                      {isPending ? "Processing..." : `Collect ₹${(selectedStudent.baseAmount - selectedStudent.paidAmount).toLocaleString("en-IN")}`}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {activeReceipt && <FeeReceiptModal receipt={activeReceipt} onClose={() => setActiveReceipt(null)} />}
    </>
  );
}
