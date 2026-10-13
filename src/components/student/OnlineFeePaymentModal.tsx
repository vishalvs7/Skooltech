"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  QrCode, 
  Building, 
  Printer 
} from "lucide-react";
import { payStudentInvoiceOnlineAction, type OnlinePaymentResponse } from "@/actions/online-payment.actions";
import { FeeReceiptModal } from "@/components/accounts/FeeReceiptModal";

interface OnlineFeePaymentModalProps {
  admissionNo?: string;
  studentName?: string;
  isPaid?: boolean;
}

export function OnlineFeePaymentModal({
  admissionNo = "ADM-1001",
  studentName = "Aarav Sharma",
  isPaid = false,
}: OnlineFeePaymentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [state, setState] = useState<OnlinePaymentResponse | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setState(null);

    const formData = new FormData();
    formData.append("admissionNo", admissionNo);
    formData.append("amount", "13500");

    try {
      const res = await payStudentInvoiceOnlineAction(null, formData);
      setState(res);
    } catch {
      setState({ success: false, error: "Network or gateway connection failure." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="font-medium flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white"
      >
        <CreditCard className="h-4 w-4" />
        <span>Pay Fees Online (BYOG)</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-lg bg-white rounded-[4px] shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Student Fee Payment</h3>
                  <p className="text-xs text-slate-500">
                    BYOG Direct Bank Settlement • No Platform Fee
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-[4px] p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Success State */}
            {state?.success && state.receiptData ? (
              <div className="p-6 space-y-4 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Payment Processed Successfully!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Receipt #{state.receiptData.receiptNo} generated and dispatched via SMS & Email.
                  </p>
                </div>

                <div className="p-4 rounded-[4px] bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-bold text-slate-900 font-mono">₹13,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank Settlement UTR:</span>
                    <span className="font-mono text-blue-700 font-semibold">{state.receiptData.referenceNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Beneficiary:</span>
                    <span className="font-semibold text-slate-800">Delhi Public Heritage School</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    size="sm"
                    onClick={() => setShowReceipt(true)}
                    className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-1.5"
                  >
                    <Printer className="h-4 w-4" />
                    <span>View & Print Receipt</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              /* Payment Checkout View */
              <div className="p-6 space-y-4">
                {state?.error && (
                  <div className="p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                {/* Invoice Breakdown */}
                <div className="p-4 rounded-[4px] bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-semibold text-slate-800">Quarter 1 (April - June 2026)</span>
                    <Badge variant="warning" className="text-[10px]">Unpaid</Badge>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tuition Fee</span>
                    <span className="font-mono">₹11,000</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Computer & Science Lab Fee</span>
                    <span className="font-mono">₹1,500</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Development & Library Head</span>
                    <span className="font-mono">₹1,000</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                    <span>Total Payable (INR)</span>
                    <span className="text-emerald-700 font-mono">₹13,500</span>
                  </div>
                </div>

                {/* Payment Mode Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Select Payment Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("UPI")}
                      className={`p-3 rounded-[4px] border text-center transition ${
                        selectedMethod === "UPI"
                          ? "border-blue-700 bg-blue-50/50 text-blue-900 font-bold ring-1 ring-blue-700"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <QrCode className="h-4 w-4 mx-auto mb-1 text-blue-700" />
                      <span className="text-xs block">UPI / QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("CARD")}
                      className={`p-3 rounded-[4px] border text-center transition ${
                        selectedMethod === "CARD"
                          ? "border-blue-700 bg-blue-50/50 text-blue-900 font-bold ring-1 ring-blue-700"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <CreditCard className="h-4 w-4 mx-auto mb-1 text-slate-700" />
                      <span className="text-xs block">Debit / Credit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("NETBANKING")}
                      className={`p-3 rounded-[4px] border text-center transition ${
                        selectedMethod === "NETBANKING"
                          ? "border-blue-700 bg-blue-50/50 text-blue-900 font-bold ring-1 ring-blue-700"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <Building className="h-4 w-4 mx-auto mb-1 text-slate-700" />
                      <span className="text-xs block">NetBanking</span>
                    </button>
                  </div>
                </div>

                {/* Zero Liability Disclaimer */}
                <div className="p-3 rounded-[4px] bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                  <div>
                    <span className="font-semibold block">BYOG Direct Settlement Model</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      100% of student fee funds deposit directly into Delhi Public Heritage School&apos;s verified bank account.
                    </p>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handlePayment}
                    disabled={loading}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5"
                  >
                    <IndianRupee className="h-3.5 w-3.5" />
                    <span>{loading ? "Authorizing Gateway..." : "Pay ₹13,500 via BYOG"}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showReceipt && state?.receiptData && (
        <FeeReceiptModal
          receipt={{
            receiptNo: state.receiptData.receiptNo,
            studentName: state.receiptData.studentName,
            admissionNo: state.receiptData.admissionNo,
            className: state.receiptData.className,
            rollNo: state.receiptData.rollNo,
            amountPaid: state.receiptData.amountPaid,
            lateFeeCharged: 0,
            paymentMethod: "UPI",
            referenceNo: state.receiptData.referenceNo,
            date: state.receiptData.date,
            cashierName: "Online Portal (BYOG)",
          }}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </>
  );
}
