"use client";

import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { Printer, X, CheckCircle2, Building, ShieldCheck } from "lucide-react";

export interface FeeReceiptData {
  receiptNo: string;
  studentName: string;
  admissionNo: string;
  className: string;
  rollNo: string;
  amountPaid: number;
  lateFeeCharged: number;
  paymentMethod: "CASH" | "UPI" | "BANK_DRAFT";
  referenceNo?: string;
  bankName?: string;
  date: string;
  cashierName: string;
}

interface FeeReceiptModalProps {
  receipt: FeeReceiptData;
  onClose: () => void;
}

export function FeeReceiptModal({ receipt, onClose }: FeeReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const baseAmount = receipt.amountPaid - receipt.lateFeeCharged;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[4px] border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Controls (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Payment Recorded Successfully</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handlePrint} className="h-8 text-xs bg-blue-700 hover:bg-blue-800">
              <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Receipt
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-[4px]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-fee-receipt" className="p-8 text-slate-900 font-sans text-xs bg-white">
          {/* Institutional School Header */}
          <div className="text-center pb-4 border-b border-slate-300">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
              Greenwood International School
            </h2>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Affiliated to CBSE, New Delhi • Affiliation No: CBSE-AFF-2026/8834
            </p>
            <p className="text-[10px] text-slate-500">
              Sector 62, Institutional Area, Noida, UP 201309 • Phone: +91 98765 43210
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 rounded-[2px] bg-slate-100 border border-slate-300 font-bold uppercase tracking-wider text-[11px]">
              Fee Payment Voucher / Receipt
            </div>
          </div>

          {/* Voucher Metadata */}
          <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-200 text-[11px]">
            <div>
              <p><span className="font-semibold text-slate-600">Receipt No:</span> <span className="font-mono font-bold text-slate-900">{receipt.receiptNo}</span></p>
              <p><span className="font-semibold text-slate-600">Date:</span> {receipt.date}</p>
              <p><span className="font-semibold text-slate-600">Academic Session:</span> 2026-2027</p>
            </div>
            <div className="text-right">
              <p><span className="font-semibold text-slate-600">Cashier:</span> {receipt.cashierName}</p>
              <p><span className="font-semibold text-slate-600">Payment Mode:</span> <span className="font-bold text-blue-700">{receipt.paymentMethod}</span></p>
              {receipt.referenceNo && (
                <p className="font-mono text-[10px]"><span className="font-semibold text-slate-600">Ref / UTR:</span> {receipt.referenceNo}</p>
              )}
            </div>
          </div>

          {/* Student Profile Box */}
          <div className="my-3 p-2.5 rounded-[4px] bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <p className="text-slate-500">Student Name:</p>
              <p className="font-bold text-slate-900 text-sm">{receipt.studentName}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Admission Number:</p>
              <p className="font-mono font-bold text-slate-900 text-sm">{receipt.admissionNo}</p>
            </div>
            <div>
              <p className="text-slate-500">Class & Section:</p>
              <p className="font-semibold text-slate-800">{receipt.className}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Roll Number:</p>
              <p className="font-semibold text-slate-800">#{receipt.rollNo}</p>
            </div>
          </div>

          {/* Fee Itemization Table */}
          <div className="border border-slate-300 rounded-[2px] overflow-hidden my-3">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                  <th className="py-1.5 px-3">Description</th>
                  <th className="py-1.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-1.5 px-3">Quarter 1 Tuition & Development Fee</td>
                  <td className="py-1.5 px-3 text-right font-mono">{formatINR(baseAmount)}</td>
                </tr>
                {receipt.lateFeeCharged > 0 && (
                  <tr className="text-amber-800 bg-amber-50/50">
                    <td className="py-1.5 px-3">Late Payment Penalty Fee</td>
                    <td className="py-1.5 px-3 text-right font-mono font-semibold">+{formatINR(receipt.lateFeeCharged)}</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-300 text-xs text-slate-900">
                  <td className="py-2 px-3 uppercase tracking-wider">Total Received</td>
                  <td className="py-2 px-3 text-right font-mono text-blue-800 text-sm">{formatINR(receipt.amountPaid)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bank Draft Details if applicable */}
          {receipt.paymentMethod === "BANK_DRAFT" && receipt.bankName && (
            <p className="text-[10px] text-slate-500 italic mb-2">
              Paid via Demand Draft: {receipt.referenceNo} issued by {receipt.bankName}
            </p>
          )}

          {/* Footer Signatures */}
          <div className="pt-8 flex items-end justify-between text-[10px] text-slate-500 border-t border-slate-200 mt-6">
            <div>
              <p>• Computer generated receipt. No physical signature required.</p>
              <p>• Fees once paid are non-refundable.</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <p className="font-semibold text-slate-700">Authorized Accounts Signatory</p>
            </div>
          </div>
        </div>

        {/* Bottom Close Action (Hidden on Print) */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end no-print">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Done & Close
          </Button>
        </div>
      </div>
    </div>
  );
}
