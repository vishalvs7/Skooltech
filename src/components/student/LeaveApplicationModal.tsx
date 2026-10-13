"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Clock, 
  CheckCheck,
  Paperclip
} from "lucide-react";
import { applyStudentLeaveAction, type LeaveActionResponse } from "@/actions/leave.actions";

interface LeaveApplicationModalProps {
  studentAdmissionNo?: string;
  studentName?: string;
}

export function LeaveApplicationModal({
  studentAdmissionNo = "ADM-1001",
  studentName = "Aarav Sharma",
}: LeaveApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<LeaveActionResponse | null>(null);
  const [mockFileName, setMockFileName] = useState<string | null>("medical-fitness-cert.pdf");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setState(null);

    const formData = new FormData(e.currentTarget);
    if (mockFileName) {
      formData.append("documentUrl", `/uploads/${mockFileName}`);
    }

    try {
      const res = await applyStudentLeaveAction(null, formData);
      setState(res);
      if (res.success) {
        setTimeout(() => {
          setIsOpen(false);
          setState(null);
        }, 2000);
      }
    } catch {
      setState({ success: false, error: "Network or server failure while submitting leave." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="font-medium flex items-center gap-1.5"
      >
        <Calendar className="h-4 w-4 text-blue-700" />
        <span>Apply for Leave</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg bg-white rounded-[4px] shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-blue-100 flex items-center justify-center text-blue-700">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Student Leave Application</h3>
                  <p className="text-xs text-slate-500">
                    {studentName} ({studentAdmissionNo}) • Class 5-A
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {state?.error && (
                <div className="p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              {state?.success && (
                <div className="p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{state.message}</span>
                </div>
              )}

              {/* Date Range Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    From Date <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    name="startDate"
                    type="date"
                    defaultValue="2026-05-18"
                    required
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    To Date <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    name="endDate"
                    type="date"
                    defaultValue="2026-05-20"
                    required
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Reason Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  defaultValue="MEDICAL"
                  className="w-full h-9 px-3 text-xs rounded-[4px] border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                  required
                >
                  <option value="MEDICAL">Medical Illness / Doctor Visit</option>
                  <option value="FAMILY">Family Occasion / Outstation Travel</option>
                  <option value="PERSONAL">Personal Emergency</option>
                  <option value="COMPETITION">Inter-School Sports / Competition</option>
                </select>
              </div>

              {/* Justification Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Detailed Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="reason"
                  rows={3}
                  placeholder="Explain reason for leave..."
                  defaultValue="Viral flu and high fever. Doctor advised complete bed rest for 3 days."
                  className="w-full p-2.5 text-xs rounded-[4px] border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-700 resize-none"
                  required
                />
              </div>

              {/* Mock Medical Document Attachment */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Medical / Supporting Document (Optional)
                </label>
                <div className="p-3 border border-dashed border-slate-200 rounded-[4px] bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <Paperclip className="h-4 w-4 text-blue-700" />
                    <div>
                      <span className="font-semibold text-slate-800">{mockFileName || "No file chosen"}</span>
                      <p className="text-[10px] text-slate-500">PDF, JPG or PNG up to 5MB</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMockFileName("dr-prescription-receipt.pdf")}
                    className="h-7 text-xs px-2"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    <span>Upload Slip</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-500">
                  Route: <span className="font-medium text-slate-700">Class Teacher Approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
