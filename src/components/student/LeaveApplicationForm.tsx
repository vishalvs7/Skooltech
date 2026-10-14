"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, CalendarDays, Upload, Send, FileText } from "lucide-react";

const LEAVE_TYPES = ["Sick Leave", "Medical Leave", "Personal Leave", "Family Function", "Other"];

export function LeaveApplicationForm() {
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [submitted, setSubmitted] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/40">
        <CardContent className="p-6 text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">Leave Application Submitted!</h3>
          <p className="text-sm text-slate-600 mt-1">
            Your {leaveType} application for {startDate} to {endDate} has been sent to your class teacher for approval.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Badge variant="warning">Status: Pending Review</Badge>
            <Badge variant="secondary">Ref: LV-2026-0451</Badge>
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setSubmitted(false)}>
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-700" />
            New Leave Application
          </CardTitle>
          <CardDescription>Fill in the details below. All fields marked * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Leave Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Leave Type *</label>
              <div className="flex flex-wrap gap-2">
                {LEAVE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLeaveType(type)}
                    className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border transition-colors ${
                      leaveType === type
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">From Date *</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">To Date *</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Reason *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={4}
                placeholder="Explain the reason for leave..."
                className="w-full rounded-[4px] border border-slate-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none resize-none"
              />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Supporting Document (optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-[4px] p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500">Upload medical certificate / supporting document</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG up to 5MB</p>
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit" className="flex items-center gap-1.5">
                <Send className="h-4 w-4" /> Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Side Info */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-700" />
              Leave Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <p>• Sick leave up to 3 days without medical certificate.</p>
            <p>• Medical leave beyond 3 days requires a doctor&apos;s certificate.</p>
            <p>• Applications must be submitted before or on the day of leave.</p>
            <p>• Maximum 12 leaves per academic session.</p>
            <p>• Applications are reviewed by your class teacher within 24 hours.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Leave Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Used this session</span>
              <span className="font-bold text-slate-900">4 / 12 days</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Sick Leave used</span>
              <span className="font-bold text-rose-600">3 days</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Personal Leave used</span>
              <span className="font-bold text-blue-600">1 day</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
