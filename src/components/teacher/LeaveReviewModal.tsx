"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Calendar,
  Paperclip,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Clock,
} from "lucide-react";
import { reviewLeaveAction } from "@/actions/leave.actions";

interface PendingLeaveItem {
  id: string;
  studentName: string;
  admissionNo: string;
  startDate: string;
  endDate: string;
  category: string;
  reason: string;
  documentUrl?: string;
}

interface LeaveReviewModalProps {
  leaves: PendingLeaveItem[];
}

export function LeaveReviewModal({ leaves: initialLeaves }: LeaveReviewModalProps) {
  const [leaves, setLeaves] = useState<PendingLeaveItem[]>(initialLeaves);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; success: boolean; message: string } | null>(null);

  const handleDecision = async (leaveId: string, status: "APPROVED" | "REJECTED") => {
    setLoadingId(leaveId);
    setFeedback(null);

    const formData = new FormData();
    formData.append("leaveId", leaveId);
    formData.append("status", status);
    formData.append("remarks", status === "APPROVED" ? "Leave granted" : "Documentation insufficient");

    try {
      const res = await reviewLeaveAction(null, formData);
      if (res.success) {
        setLeaves((prev) => prev.filter((l) => l.id !== leaveId));
        setFeedback({ id: leaveId, success: true, message: res.message || `Leave marked as ${status}.` });
      } else {
        setFeedback({ id: leaveId, success: false, message: res.error || "Failed to update leave." });
      }
    } catch {
      setFeedback({ id: leaveId, success: false, message: "Network error. Please try again." });
    } finally {
      setLoadingId(null);
    }
  };

  if (leaves.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-[4px] border border-slate-200 bg-slate-50 text-xs text-slate-500">
        <UserCheck className="h-4 w-4 text-slate-400" />
        <span>No pending leave applications for your class.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-blue-700" />
          <h4 className="text-sm font-semibold text-slate-900">Student Leave Review Queue</h4>
        </div>
        <Badge variant="default" className="text-[10px]">
          {leaves.length} Pending Request{leaves.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {feedback && (
        <div
          className={`p-2.5 rounded-[4px] text-xs flex items-center gap-2 ${
            feedback.success
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {feedback.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="space-y-2">
        {leaves.map((leave) => (
          <div
            key={leave.id}
            className="p-3.5 rounded-[4px] border border-slate-200 bg-white hover:border-slate-300 transition text-xs space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{leave.studentName}</span>
                  <Badge variant="outline" className="text-[10px] font-mono text-blue-700">
                    {leave.admissionNo}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1 text-slate-600 text-[11px]">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{leave.startDate} &mdash; {leave.endDate}</span>
                  <span>•</span>
                  <Badge variant="secondary" className="text-[9px] uppercase">
                    {leave.category}
                  </Badge>
                </div>
              </div>
              <Badge variant="warning" className="text-[10px] flex items-center gap-1">
                <Clock className="h-3 w-3" /> Awaiting Review
              </Badge>
            </div>

            <p className="text-slate-700 italic bg-slate-50 p-2 rounded-[4px] border border-slate-100">
              &ldquo;{leave.reason}&rdquo;
            </p>

            {leave.documentUrl && (
              <div className="flex items-center gap-1.5 text-[11px] text-blue-700">
                <Paperclip className="h-3 w-3" />
                <a href={leave.documentUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                  View Attached Document
                </a>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDecision(leave.id, "REJECTED")}
                disabled={loadingId === leave.id}
                className="h-7 text-xs px-2 text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                <X className="h-3 w-3 mr-1" />
                <span>Reject</span>
              </Button>
              <Button
                size="sm"
                onClick={() => handleDecision(leave.id, "APPROVED")}
                disabled={loadingId === leave.id}
                className="h-7 text-xs px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                <Check className="h-3 w-3 mr-1" />
                <span>Approve Leave</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
