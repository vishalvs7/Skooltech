"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar, BookOpen, AlertCircle, CheckCircle2, X } from "lucide-react";
import { createExamAction, type ExamActionResponse } from "@/actions/exam.actions";

export function CreateExamModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<ExamActionResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setState(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createExamAction(null, formData);
      setState(res);
      if (res.success) {
        setTimeout(() => {
          setIsOpen(false);
          setState(null);
        }, 1800);
      }
    } catch {
      setState({ success: false, error: "Network or server failure while creating exam." });
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
        <PlusCircle className="h-4 w-4 text-blue-700" />
        <span>Create Spontaneous Exam</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md bg-white rounded-[4px] shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-blue-100 flex items-center justify-center text-blue-700">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Create New Exam</h3>
                  <p className="text-xs text-slate-500">Spontaneous or Scheduled Assessment</p>
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Exam Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  name="name"
                  placeholder="e.g. Periodic Test 2 (PT-2) or Unit Test 3"
                  defaultValue="Unit Test 2 (Algebra & Mechanics)"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Exam Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="examType"
                  defaultValue="UNIT_TEST"
                  className="w-full h-10 px-3 text-sm rounded-[4px] border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                >
                  <option value="UNIT_TEST">Unit Test (20 - 40 Marks)</option>
                  <option value="CLASS_TEST">Spontaneous Class Test (10 - 25 Marks)</option>
                  <option value="MID_TERM">Half-Yearly / Mid-Term (80 - 100 Marks)</option>
                  <option value="FINAL">Annual Final Exam (80 - 100 Marks)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Assessment Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    name="startDate"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="p-3 rounded-[4px] bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Badge variant="default" className="text-[10px]">Auto-Link</Badge>
                  <span>Grading Scale Active</span>
                </div>
                <p className="text-slate-600">
                  Scores entered will automatically evaluate via the CBSE 9-point scale and reflect in student report cards.
                </p>
              </div>

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
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? "Scheduling..." : "Schedule Exam"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
