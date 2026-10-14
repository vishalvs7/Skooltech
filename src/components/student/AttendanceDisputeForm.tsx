"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldAlert, Upload, Send, AlertTriangle } from "lucide-react";

export function AttendanceDisputeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [disputeDate, setDisputeDate] = useState("");
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
          <h3 className="font-bold text-lg text-slate-900">Dispute Submitted Successfully!</h3>
          <p className="text-sm text-slate-600 mt-1">
            Your attendance dispute for {disputeDate} has been forwarded to your class teacher and the Principal&apos;s office for verification.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Badge variant="warning">Status: Under Review</Badge>
            <Badge variant="secondary">Ref: DSP-2026-0123</Badge>
          </div>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setSubmitted(false)}>
            Submit Another Dispute
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
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            Attendance Correction Request
          </CardTitle>
          <CardDescription>Provide details of the day you believe attendance was incorrectly marked.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Disputed Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Disputed Date *</label>
              <Input type="date" value={disputeDate} onChange={(e) => setDisputeDate(e.target.value)} required />
            </div>

            {/* Actual Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Actual Status *</label>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-emerald-300 bg-emerald-50 text-emerald-800 cursor-pointer">
                  <input type="radio" name="actualStatus" value="PRESENT" defaultChecked className="accent-emerald-600" />
                  <span className="text-sm font-medium">I was PRESENT</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] border border-amber-300 bg-amber-50 text-amber-800 cursor-pointer">
                  <input type="radio" name="actualStatus" value="LATE" className="accent-amber-600" />
                  <span className="text-sm font-medium">I was LATE</span>
                </label>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Explanation *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={4}
                placeholder="Describe what happened. For example: I was present in class but the teacher missed marking me..."
                className="w-full rounded-[4px] border border-slate-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none resize-none"
              />
            </div>

            {/* Supporting Evidence */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Supporting Evidence (optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-[4px] p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500">Upload evidence (screenshots, gate punch record, etc.)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG up to 5MB</p>
              </div>
            </div>

            <div className="p-3 rounded-[4px] bg-amber-50 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p>Disputes are verified against gate biometric logs and teacher records. False disputes may result in disciplinary action.</p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit" className="flex items-center gap-1.5">
                <Send className="h-4 w-4" /> Submit Dispute
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Side Info */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Dispute Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <div className="flex gap-3">
              <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
              <p>Submit the dispute form with your explanation.</p>
            </div>
            <div className="flex gap-3">
              <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
              <p>Class teacher verifies against their roll-call records.</p>
            </div>
            <div className="flex gap-3">
              <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
              <p>Gate biometric logs are cross-checked by the Principal&apos;s office.</p>
            </div>
            <div className="flex gap-3">
              <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
              <p>Attendance record is corrected if the dispute is verified.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">My Past Disputes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-[4px] bg-slate-50 text-xs">
              <div>
                <p className="font-semibold text-slate-800">Apr 8, 2026</p>
                <p className="text-slate-500">Marked Late → Disputed</p>
              </div>
              <Badge variant="success" className="text-[10px]">Resolved</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
