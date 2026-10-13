"use client";

import { useState, useActionState, useEffect } from "react";
import { collectCounterPaymentAction, FeePaymentResponse } from "@/actions/fee.actions";
import { calculateDynamicLateFee } from "@/lib/fee-calculator";
import { FeeReceiptModal, FeeReceiptData } from "@/components/accounts/FeeReceiptModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { 
  IndianRupee, 
  X, 
  Search, 
  QrCode, 
  Building, 
  Receipt, 
  AlertCircle, 
  Sparkles,
  CreditCard,
  Banknote,
  FileCheck
} from "lucide-react";

interface MockOverdueStudent {
  admissionNo: string;
  name: string;
  className: string;
  rollNo: string;
  baseAmount: number;
  dueDate: string;
}

const SAMPLE_OVERDUE_STUDENTS: MockOverdueStudent[] = [
  { admissionNo: "ADM-1004", name: "Ishaan Gupta", className: "Class 5 - Sec A", rollNo: "4", baseAmount: 13500, dueDate: "2026-04-10" },
  { admissionNo: "ADM-1008", name: "Riya Kapoor", className: "Class 5 - Sec A", rollNo: "8", baseAmount: 13500, dueDate: "2026-04-10" },
  { admissionNo: "ADM-1013", name: "Reyansh Singhania", className: "Class 5 - Sec A", rollNo: "13", baseAmount: 13500, dueDate: "2026-04-10" },
  { admissionNo: "ADM-1017", name: "Vivaan Saxena", className: "Class 5 - Sec A", rollNo: "17", baseAmount: 13500, dueDate: "2026-04-10" },
];

export function CashCollectionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<MockOverdueStudent>(SAMPLE_OVERDUE_STUDENTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI" | "BANK_DRAFT">("UPI");
  const [activeReceipt, setActiveReceipt] = useState<FeeReceiptData | null>(null);

  const [state, formAction, isPending] = useActionState<FeePaymentResponse | null, FormData>(
    collectCounterPaymentAction,
    null
  );

  // When payment succeeds, open printable receipt modal
  useEffect(() => {
    if (state?.success && state.receiptData) {
      setActiveReceipt(state.receiptData);
    }
  }, [state]);

  const lateFeeInfo = calculateDynamicLateFee(
    selectedStudent.dueDate,
    selectedStudent.baseAmount,
    25, // ₹25/day
    1000, // ₹1,000 cap
    5 // 5 grace days
  );

  const handleSelectStudent = (admissionNo: string) => {
    const found = SAMPLE_OVERDUE_STUDENTS.find((s) => s.admissionNo === admissionNo);
    if (found) setSelectedStudent(found);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        size="sm"
      >
        <IndianRupee className="h-4 w-4 mr-1.5" /> Open Cash Collection Desk
      </Button>

      {/* Main Collection Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Counter Fee Collection Desk
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instant student lookup, dynamic late fee calculation, and receipt generation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-[4px]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {state?.error && (
                <div className="mb-4 p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{state.error}</span>
                </div>
              )}

              <form action={formAction} className="space-y-4">
                {/* Student Lookup Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Select Student / Search Admission Number
                  </label>
                  <select
                    value={selectedStudent.admissionNo}
                    onChange={(e) => handleSelectStudent(e.target.value)}
                    className="flex h-9 w-full rounded-[4px] border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-600 focus:outline-none"
                  >
                    {SAMPLE_OVERDUE_STUDENTS.map((s) => (
                      <option key={s.admissionNo} value={s.admissionNo}>
                        {s.admissionNo} — {s.name} ({s.className}, Roll #{s.rollNo})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hidden Fields for Receipt */}
                <input type="hidden" name="admissionNo" value={selectedStudent.admissionNo} />
                <input type="hidden" name="studentName" value={selectedStudent.name} />
                <input type="hidden" name="className" value={selectedStudent.className} />
                <input type="hidden" name="rollNo" value={selectedStudent.rollNo} />
                <input type="hidden" name="lateFeeCharged" value={lateFeeInfo.lateFee} />
                <input type="hidden" name="amountPaid" value={lateFeeInfo.totalPayable} />

                {/* Overdue Calculation Summary Card */}
                <div className="p-3.5 bg-slate-50 rounded-[4px] border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Tuition Fee (Quarter 1):</span>
                    <span className="font-mono font-semibold">{formatINR(selectedStudent.baseAmount)}</span>
                  </div>

                  <div className="flex justify-between items-center text-amber-800 bg-amber-50/70 p-1.5 rounded-[3px] border border-amber-200">
                    <span className="flex items-center gap-1 font-medium">
                      <span>Late Payment Penalty:</span>
                      <Badge variant="warning" className="text-[10px] py-0 px-1 font-mono">
                        {lateFeeInfo.overdueDays} Days @ ₹25/day
                      </Badge>
                    </span>
                    <span className="font-mono font-bold">+{formatINR(lateFeeInfo.lateFee)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-slate-900 font-bold text-sm">
                    <span>Total Amount Payable:</span>
                    <span className="font-mono text-emerald-700 text-base">
                      {formatINR(lateFeeInfo.totalPayable)}
                    </span>
                  </div>
                </div>

                {/* 3 Counter Payment Modes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Counter Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("UPI")}
                      className={`p-2.5 rounded-[4px] border text-left transition-all ${
                        paymentMethod === "UPI"
                          ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <QrCode className="h-4 w-4 text-blue-700 mb-1" />
                      <p className="font-bold text-xs text-slate-900">UPI Scanner</p>
                      <p className="text-[10px] text-slate-500">PhonePe / GPay QR</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("CASH")}
                      className={`p-2.5 rounded-[4px] border text-left transition-all ${
                        paymentMethod === "CASH"
                          ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Banknote className="h-4 w-4 text-emerald-700 mb-1" />
                      <p className="font-bold text-xs text-slate-900">Cash on Desk</p>
                      <p className="text-[10px] text-slate-500">Physical notes</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("BANK_DRAFT")}
                      className={`p-2.5 rounded-[4px] border text-left transition-all ${
                        paymentMethod === "BANK_DRAFT"
                          ? "border-purple-600 bg-purple-50/60 ring-1 ring-purple-600"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Building className="h-4 w-4 text-purple-700 mb-1" />
                      <p className="font-bold text-xs text-slate-900">Bank Draft</p>
                      <p className="text-[10px] text-slate-500">Demand Draft / Cheque</p>
                    </button>
                  </div>
                  <input type="hidden" name="paymentMethod" value={paymentMethod} />
                </div>

                {/* Conditional Fields based on Payment Mode */}
                {paymentMethod === "UPI" && (
                  <div className="p-3 bg-blue-50/40 rounded-[4px] border border-blue-200 space-y-2">
                    <label className="block text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      UPI Reference / UTR Number (12 Digits) *
                    </label>
                    <Input
                      name="referenceNo"
                      required
                      defaultValue="987456123456"
                      placeholder="e.g. 987456123456"
                      className="font-mono text-xs bg-white"
                    />
                    <p className="text-[11px] text-blue-800">
                      Parent scans the counter QR standee and verifies the 12-digit UTR on transaction receipt.
                    </p>
                  </div>
                )}

                {paymentMethod === "BANK_DRAFT" && (
                  <div className="p-3 bg-purple-50/40 rounded-[4px] border border-purple-200 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-purple-900 uppercase tracking-wider mb-1">
                        Demand Draft Number *
                      </label>
                      <Input
                        name="referenceNo"
                        required
                        defaultValue="DD-884920"
                        placeholder="e.g. DD-884920"
                        className="font-mono text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-purple-900 uppercase tracking-wider mb-1">
                        Issuing Bank Name *
                      </label>
                      <Input
                        name="bankName"
                        required
                        defaultValue="State Bank of India"
                        placeholder="e.g. SBI, HDFC"
                        className="text-xs bg-white"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "CASH" && (
                  <div className="p-2.5 bg-emerald-50/40 rounded-[4px] border border-emerald-200 text-xs text-emerald-800">
                    Count physical currency notes at desk and verify counterfeit markers before printing receipt.
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    {isPending ? "Recording & Printing..." : `Collect ${formatINR(lateFeeInfo.totalPayable)} & Print Receipt`}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal Triggered After Payment */}
      {activeReceipt && (
        <FeeReceiptModal
          receipt={activeReceipt}
          onClose={() => {
            setActiveReceipt(null);
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
}
