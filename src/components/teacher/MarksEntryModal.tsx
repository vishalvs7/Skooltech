"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileSpreadsheet, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Calculator,
  Search
} from "lucide-react";
import { recordBatchMarksAction, type ExamActionResponse } from "@/actions/exam.actions";
import { calculateSubjectGrade } from "@/lib/grading-calculator";

interface StudentRosterItem {
  enrollmentId: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  obtainedMarks?: number;
  remarks?: string;
}

interface MarksEntryModalProps {
  examList?: Array<{ id: string; name: string }>;
  defaultExamId?: string;
}

const DEFAULT_CLASS_5A_ROSTER: StudentRosterItem[] = [
  { enrollmentId: "enr-1001", admissionNo: "ADM-1001", rollNo: "01", name: "Aarav Sharma", obtainedMarks: 38 },
  { enrollmentId: "enr-1002", admissionNo: "ADM-1002", rollNo: "02", name: "Ananya Iyer", obtainedMarks: 39 },
  { enrollmentId: "enr-1003", admissionNo: "ADM-1003", rollNo: "03", name: "Vihaan Patel", obtainedMarks: 36 },
  { enrollmentId: "enr-1004", admissionNo: "ADM-1004", rollNo: "04", name: "Ishaan Gupta", obtainedMarks: 32 },
  { enrollmentId: "enr-1005", admissionNo: "ADM-1005", rollNo: "05", name: "Saanvi Reddy", obtainedMarks: 40 },
  { enrollmentId: "enr-1006", admissionNo: "ADM-1006", rollNo: "06", name: "Diya Mehta", obtainedMarks: 35 },
  { enrollmentId: "enr-1007", admissionNo: "ADM-1007", rollNo: "07", name: "Aditya Choudhury", obtainedMarks: 31 },
  { enrollmentId: "enr-1008", admissionNo: "ADM-1008", rollNo: "08", name: "Riya Kapoor", obtainedMarks: 37 },
  { enrollmentId: "enr-1009", admissionNo: "ADM-1009", rollNo: "09", name: "Arjun Nair", obtainedMarks: 34 },
  { enrollmentId: "enr-1010", admissionNo: "ADM-1010", rollNo: "10", name: "Myra Bose", obtainedMarks: 38 },
  { enrollmentId: "enr-1011", admissionNo: "ADM-1011", rollNo: "11", name: "Kabir Malhotra", obtainedMarks: 29 },
  { enrollmentId: "enr-1012", admissionNo: "ADM-1012", rollNo: "12", name: "Avani Joshi", obtainedMarks: 36 },
  { enrollmentId: "enr-1013", admissionNo: "ADM-1013", rollNo: "13", name: "Reyansh Singhania", obtainedMarks: 33 },
  { enrollmentId: "enr-1014", admissionNo: "ADM-1014", rollNo: "14", name: "Anika Deshmukh", obtainedMarks: 37 },
  { enrollmentId: "enr-1015", admissionNo: "ADM-1015", rollNo: "15", name: "Dhruv Rao", obtainedMarks: 30 },
  { enrollmentId: "enr-1016", admissionNo: "ADM-1016", rollNo: "16", name: "Kiara Chatterjee", obtainedMarks: 39 },
  { enrollmentId: "enr-1017", admissionNo: "ADM-1017", rollNo: "17", name: "Vivaan Saxena", obtainedMarks: 34 },
  { enrollmentId: "enr-1018", admissionNo: "ADM-1018", rollNo: "18", name: "Ira Bhardwaj", obtainedMarks: 38 },
  { enrollmentId: "enr-1019", admissionNo: "ADM-1019", rollNo: "19", name: "Atharv Kulkarni", obtainedMarks: 35 },
  { enrollmentId: "enr-1020", admissionNo: "ADM-1020", rollNo: "20", name: "Prisha Aggarwal", obtainedMarks: 36 },
  { enrollmentId: "enr-1021", admissionNo: "ADM-1021", rollNo: "21", name: "Advait Trivedi", obtainedMarks: 31 },
  { enrollmentId: "enr-1022", admissionNo: "ADM-1022", rollNo: "22", name: "Navya Sengupta", obtainedMarks: 37 },
  { enrollmentId: "enr-1023", admissionNo: "ADM-1023", rollNo: "23", name: "Samar Chauhan", obtainedMarks: 28 },
  { enrollmentId: "enr-1024", admissionNo: "ADM-1024", rollNo: "24", name: "Tara Menon", obtainedMarks: 39 },
  { enrollmentId: "enr-1025", admissionNo: "ADM-1025", rollNo: "25", name: "Shaurya Verma", obtainedMarks: 33 },
];

export function MarksEntryModal({ examList, defaultExamId }: MarksEntryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(defaultExamId || "pt-1");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [totalMarks, setTotalMarks] = useState<number>(40);
  const [searchQuery, setSearchQuery] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    DEFAULT_CLASS_5A_ROSTER.forEach((s) => {
      initial[s.admissionNo] = s.obtainedMarks || 35;
    });
    return initial;
  });

  const [loading, setLoading] = useState(false);
  const [actionResult, setActionResult] = useState<ExamActionResponse | null>(null);

  const filteredStudents = useMemo(() => {
    return DEFAULT_CLASS_5A_ROSTER.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleScoreChange = (admissionNo: string, val: string) => {
    const num = parseFloat(val);
    setScores((prev) => ({
      ...prev,
      [admissionNo]: isNaN(num) ? 0 : Math.min(Math.max(0, num), totalMarks),
    }));
  };

  const handleAutofillHighScores = () => {
    const updated: Record<string, number> = {};
    DEFAULT_CLASS_5A_ROSTER.forEach((s) => {
      // Generate scores between 80% and 98% of totalMarks
      const randomPct = 0.75 + Math.random() * 0.23;
      updated[s.admissionNo] = Math.round(totalMarks * randomPct);
    });
    setScores(updated);
  };

  const handleSaveMarks = async () => {
    setLoading(true);
    setActionResult(null);

    const marksData = DEFAULT_CLASS_5A_ROSTER.map((s) => ({
      enrollmentId: s.enrollmentId,
      obtainedMarks: scores[s.admissionNo] ?? 0,
      remarks: (scores[s.admissionNo] ?? 0) >= totalMarks * 0.9 ? "Outstanding" : "Good",
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
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-blue-100 flex items-center justify-center text-blue-700">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Spontaneous Marks Entry Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Class 5-A • CBSE 9-Point Scale Live Calculation
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

            {/* Controls Bar */}
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 shrink-0 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Examination</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-[4px] border border-slate-200 bg-white"
                >
                  {examList && examList.length > 0 ? (
                    examList.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="pt-1">Periodic Test 1 (PT-1)</option>
                      <option value="unit-test-2">Unit Test 2</option>
                      <option value="mid-term">Half-Yearly Examination</option>
                    </>
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

              <div className="flex items-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutofillHighScores}
                  className="h-8 text-xs w-full flex items-center justify-center gap-1 text-blue-700 border-blue-200 bg-blue-50/50 hover:bg-blue-100/50"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Autofill Sample</span>
                </Button>
              </div>
            </div>

            {/* Quick Search and Status Alert */}
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

              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span className="font-semibold text-slate-700">Grading System:</span>
                <span className="text-emerald-700 font-medium">A1 (&ge;91%)</span>
                <span>•</span>
                <span className="text-blue-700 font-medium">A2 (&ge;81%)</span>
                <span>•</span>
                <span className="text-indigo-700 font-medium">B1 (&ge;71%)</span>
                <span>•</span>
                <span className="text-amber-700 font-medium">C1 (&ge;51%)</span>
              </div>
            </div>

            {/* Feedback Notifications */}
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

            {/* Student Marks Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-[4px]">Roll</th>
                    <th className="py-2.5 px-3">Admission No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3 text-center">Marks Obtained (/ {totalMarks})</th>
                    <th className="py-2.5 px-3 text-center">Percentage</th>
                    <th className="py-2.5 px-3 text-center">CBSE Grade</th>
                    <th className="py-2.5 px-3 rounded-r-[4px] text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => {
                    const score = scores[student.admissionNo] ?? 0;
                    const evaluation = calculateSubjectGrade(score, totalMarks);

                    return (
                      <tr key={student.admissionNo} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-mono font-medium text-slate-700">
                          {student.rollNo}
                        </td>
                        <td className="py-2 px-3 font-mono text-blue-700 font-semibold">
                          {student.admissionNo}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-900">
                          {student.name}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max={totalMarks}
                            value={score}
                            onChange={(e) => handleScoreChange(student.admissionNo, e.target.value)}
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
                        <td className="py-2 px-3 text-right text-slate-500 italic">
                          {evaluation.remark}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50 shrink-0">
              <div className="text-xs text-slate-600">
                Evaluating <span className="font-semibold text-slate-900">{filteredStudents.length}</span> students for{" "}
                <span className="font-semibold text-blue-700">{selectedSubject}</span>
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
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveMarks}
                  disabled={loading}
                  className="flex items-center gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{loading ? "Saving Batch..." : "Save & Publish Marks"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
