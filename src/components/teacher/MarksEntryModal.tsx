"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  Calculator,
  Search,
} from "lucide-react";
import { recordBatchMarksAction, type ExamActionResponse } from "@/actions/exam.actions";
import { calculateSubjectGrade } from "@/lib/grading-calculator";

interface RosterStudent {
  enrollmentId: string;
  rollNo: string;
  studentName: string;
  admissionNo: string;
}

interface MarksEntryModalProps {
  examOptions: Array<{ id: string; name: string }>;
  roster: RosterStudent[];
  defaultExamId?: string;
}

export function MarksEntryModal({ examOptions, roster, defaultExamId }: MarksEntryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(defaultExamId || examOptions[0]?.id || "");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [totalMarks, setTotalMarks] = useState<number>(40);
  const [searchQuery, setSearchQuery] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(false);
  const [actionResult, setActionResult] = useState<ExamActionResponse | null>(null);

  const filteredStudents = useMemo(() => {
    return roster.filter(
      (s) =>
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.includes(searchQuery)
    );
  }, [roster, searchQuery]);

  const handleScoreChange = (enrollmentId: string, val: string) => {
    const num = parseFloat(val);
    setScores((prev) => ({
      ...prev,
      [enrollmentId]: isNaN(num) ? 0 : Math.min(Math.max(0, num), totalMarks),
    }));
  };

  const handleSaveMarks = async () => {
    setLoading(true);
    setActionResult(null);

    const marksData = roster.map((s) => ({
      enrollmentId: s.enrollmentId,
      obtainedMarks: scores[s.enrollmentId] ?? 0,
      remarks: (scores[s.enrollmentId] ?? 0) >= totalMarks * 0.9 ? "Outstanding" : undefined,
    }));

    const formData = new FormData();
    formData.append("examId", selectedExam);
    formData.append("subject", selectedSubject);
    formData.append("totalMarks", totalMarks.toString());
    formData.append("marksData", JSON.stringify(marksData));

    try {
      const res = await recordBatchMarksAction(null, formData);
      setActionResult(res);
      if (res.success) {
        setTimeout(() => {
          setIsOpen(false);
          setActionResult(null);
        }, 2000);
      }
    } catch {
      setActionResult({ success: false, error: "Network or server failure while recording marks." });
    } finally {
      setLoading(false);
    }
  };

  if (roster.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled className="text-xs">
        <FileSpreadsheet className="h-4 w-4 mr-1" />
        No Students Enrolled
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="font-medium flex items-center gap-1.5"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>Enter / Update Marks</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-[4px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-blue-100 flex items-center justify-center text-blue-700">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Marks Entry Matrix</h3>
                  <p className="text-xs text-slate-500">CBSE 9-Point Scale Live Calculation</p>
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

            <div className="p-4 bg-slate-50/70 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Examination</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-[4px] border border-slate-200 bg-white"
                >
                  {examOptions.length > 0 ? (
                    examOptions.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))
                  ) : (
                    <option value="">No exams created yet</option>
                  )}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-[4px] border border-slate-200 bg-white"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Social Science">Social Science</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Total Marks</label>
                <Input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Math.max(10, parseFloat(e.target.value) || 40))}
                  className="h-8 text-xs font-mono"
                  min="10"
                  max="100"
                />
              </div>
            </div>

            <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-4 shrink-0">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by name or roll..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-7 pl-8 pr-3 text-xs rounded-[4px] border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
              </div>
              <div className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">CBSE Grades:</span>{" "}
                A1 (&ge;91%) • A2 (&ge;81%) • B1 (&ge;71%) • C1 (&ge;51%)
              </div>
            </div>

            {actionResult?.error && (
              <div className="mx-6 mt-3 p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{actionResult.error}</span>
              </div>
            )}
            {actionResult?.success && (
              <div className="mx-6 mt-3 p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{actionResult.message}</span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-[4px]">Roll</th>
                    <th className="py-2.5 px-3">Admission No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3 text-center">Marks (/ {totalMarks})</th>
                    <th className="py-2.5 px-3 text-center">%</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3 rounded-r-[4px] text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => {
                    const score = scores[student.enrollmentId] ?? 0;
                    const evaluation = calculateSubjectGrade(score, totalMarks);

                    return (
                      <tr key={student.enrollmentId} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-mono font-medium text-slate-700">{student.rollNo}</td>
                        <td className="py-2 px-3 font-mono text-blue-700 font-semibold">{student.admissionNo}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{student.studentName}</td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max={totalMarks}
                            value={score}
                            onChange={(e) => handleScoreChange(student.enrollmentId, e.target.value)}
                            className="h-7 w-20 px-2 text-center font-mono font-bold text-slate-900 border border-slate-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-blue-700"
                          />
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-semibold text-slate-700">
                          {evaluation.percentage.toFixed(1)}%
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-[4px] font-bold text-[11px] ${
                              evaluation.grade === "A1"
                                ? "bg-emerald-100 text-emerald-800"
                                : evaluation.grade === "A2"
                                  ? "bg-teal-100 text-teal-800"
                                  : evaluation.grade === "B1" || evaluation.grade === "B2"
                                    ? "bg-blue-100 text-blue-800"
                                    : evaluation.grade === "C1" || evaluation.grade === "C2"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {evaluation.grade}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-slate-500 italic">{evaluation.remark}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50 shrink-0">
              <div className="text-xs text-slate-600">
                Evaluating <span className="font-semibold text-slate-900">{filteredStudents.length}</span> students for{" "}
                <span className="font-semibold text-blue-700">{selectedSubject}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveMarks}
                  disabled={loading || !selectedExam}
                  className="flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{loading ? "Saving..." : "Save & Publish Marks"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
