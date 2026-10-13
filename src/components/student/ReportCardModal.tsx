"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Printer, 
  X, 
  Award, 
  CheckCircle2, 
  Calendar, 
  School as SchoolIcon,
  Sparkles
} from "lucide-react";
import { evaluateReportCard, type ReportCardEvaluation } from "@/lib/grading-calculator";

interface ReportCardModalProps {
  studentName?: string;
  admissionNo?: string;
  rollNo?: string;
  className?: string;
  sectionName?: string;
  academicSession?: string;
  affiliationNo?: string;
}

const DEFAULT_SUBJECT_SCORES = [
  { subject: "Mathematics", totalMarks: 40, obtainedMarks: 38, remarks: "Outstanding analytical skill" },
  { subject: "Science", totalMarks: 40, obtainedMarks: 36, remarks: "Good conceptual clarity" },
  { subject: "English Language & Literature", totalMarks: 40, obtainedMarks: 37, remarks: "Expressive vocabulary" },
  { subject: "Hindi", totalMarks: 40, obtainedMarks: 35, remarks: "Neat handwriting and grammar" },
  { subject: "Social Science", totalMarks: 40, obtainedMarks: 34, remarks: "Consistent participation" },
];

export function ReportCardModal({
  studentName = "Aarav Sharma",
  admissionNo = "ADM-1001",
  rollNo = "01",
  className = "Class 5",
  sectionName = "A",
  academicSession = "2026-2027",
  affiliationNo = "CBSE/AFF/2026/9821",
}: ReportCardModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [gradingScale, setGradingScale] = useState<"PERCENTAGE" | "CGPA_10" | "CGPA_5">("PERCENTAGE");

  const evaluation: ReportCardEvaluation = evaluateReportCard(DEFAULT_SUBJECT_SCORES, gradingScale);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="font-medium flex items-center gap-1.5"
      >
        <Award className="h-4 w-4" />
        <span>View Official Report Card</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-[4px] shadow-2xl border border-slate-300 my-8 overflow-hidden">
            {/* Top Toolbar (Non-printable) */}
            <div className="print:hidden flex items-center justify-between border-b border-slate-200 px-6 py-3 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Display Scale:</span>
                <div className="flex rounded-[4px] border border-slate-200 overflow-hidden bg-white text-xs">
                  <button
                    type="button"
                    onClick={() => setGradingScale("PERCENTAGE")}
                    className={`px-2.5 py-1 font-medium transition ${
                      gradingScale === "PERCENTAGE" ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGradingScale("CGPA_10")}
                    className={`px-2.5 py-1 font-medium border-l border-slate-200 transition ${
                      gradingScale === "CGPA_10" ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    CGPA (10.0)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGradingScale("CGPA_5")}
                    className={`px-2.5 py-1 font-medium border-l border-slate-200 transition ${
                      gradingScale === "CGPA_5" ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    GPA (5.0)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                  className="h-8 text-xs flex items-center gap-1 text-slate-700"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print A4</span>
                </Button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 rounded-[4px] p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Report Card Content */}
            <div id="printable-report-card" className="p-8 space-y-6 bg-white text-slate-900">
              {/* School Header */}
              <div className="text-center border-b-2 border-blue-900 pb-5">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-[4px] bg-blue-700 text-white mb-2 shadow-sm">
                  <SchoolIcon className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-blue-950 uppercase">
                  Delhi Public Heritage School
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Affiliated to Central Board of Secondary Education (CBSE), New Delhi
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Affiliation No: {affiliationNo} • School Code: DEMO01 • Sector 14, Dwarka, New Delhi - 110078
                </p>
                <div className="inline-block mt-3 px-3 py-1 bg-blue-50 border border-blue-200 rounded-[4px] text-blue-900 font-bold text-xs uppercase tracking-wide">
                  Periodic Progress Report • Academic Session {academicSession}
                </div>
              </div>

              {/* Student Bio Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[4px] bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Student Name</span>
                  <span className="font-bold text-slate-900 text-sm">{studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Admission No</span>
                  <span className="font-bold text-blue-800 font-mono text-sm">{admissionNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Class & Section</span>
                  <span className="font-bold text-slate-900">{className} - {sectionName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Roll Number</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{rollNo}</span>
                </div>
              </div>

              {/* Examination Title */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase">
                    Periodic Assessment 1 (PT-1)
                  </h3>
                  <p className="text-[11px] text-slate-500">Evaluation as per CBSE Uniform System of Assessment</p>
                </div>
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-800 font-mono">
                  Scale: {gradingScale === "PERCENTAGE" ? "Percentage" : gradingScale === "CGPA_10" ? "10-Pt CGPA" : "5-Pt GPA"}
                </Badge>
              </div>

              {/* Subject Scores Table */}
              <div className="overflow-hidden border border-slate-200 rounded-[4px]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3 text-center">Max Marks</th>
                      <th className="py-2.5 px-3 text-center">Marks Obtained</th>
                      <th className="py-2.5 px-3 text-center">Percentage</th>
                      <th className="py-2.5 px-3 text-center">CBSE Grade</th>
                      <th className="py-2.5 px-3 text-center">Grade Point</th>
                      <th className="py-2.5 px-3 text-right">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {evaluation.subjects.map((sub) => (
                      <tr key={sub.subject} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{sub.subject}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">{sub.totalMarks}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-800">
                          {sub.obtainedMarks}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                          {sub.percentage.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-[4px] font-bold text-[11px] bg-blue-100 text-blue-800">
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-800">
                          {gradingScale === "CGPA_5" ? sub.gradePoint5.toFixed(1) : sub.gradePoint10.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 italic">{sub.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Table Total Row */}
                  <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200 text-slate-900">
                    <tr>
                      <td className="py-2.5 px-3 uppercase">Grand Total</td>
                      <td className="py-2.5 px-3 text-center font-mono">{evaluation.grandTotalMarks}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-blue-900 text-sm">
                        {evaluation.grandObtainedMarks}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-sm text-blue-900">
                        {evaluation.overallPercentage.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-[4px] bg-blue-900 text-white font-bold">
                          {evaluation.overallGrade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-sm">
                        {gradingScale === "CGPA_5" ? evaluation.cgpa5.toFixed(1) : evaluation.cgpa10.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-700">PASSED</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Performance Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-[4px] bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Overall Score</span>
                  <div className="text-xl font-bold text-blue-900 mt-0.5 flex items-center justify-between">
                    <span>{evaluation.displayScore}</span>
                    <Sparkles className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Grade: {evaluation.overallGrade} (Distinction)</p>
                </div>

                <div className="p-3.5 rounded-[4px] bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Attendance Rate</span>
                  <div className="text-xl font-bold text-emerald-700 mt-0.5 flex items-center justify-between">
                    <span>96.0%</span>
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">24 Present / 25 Total Working Days</p>
                </div>

                <div className="p-3.5 rounded-[4px] bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">Academic Status</span>
                  <div className="text-xl font-bold text-emerald-700 mt-0.5 flex items-center justify-between">
                    <span>PASSED</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Promoted to next evaluation term</p>
                </div>
              </div>

              {/* Teacher Remarks Box */}
              <div className="p-3.5 rounded-[4px] border border-blue-100 bg-blue-50/40 text-xs">
                <span className="font-semibold text-blue-950 block mb-1">Class Teacher Remarks:</span>
                <p className="text-slate-700 italic">
                  &ldquo;{evaluation.overallRemark} Aarav exhibits keen interest in science and analytical reasoning. Highly regular and disciplined.&rdquo;
                </p>
              </div>

              {/* Signatures Strip */}
              <div className="pt-8 grid grid-cols-3 text-center text-xs">
                <div>
                  <div className="border-b border-slate-400 w-36 mx-auto mb-1.5 h-6"></div>
                  <span className="font-semibold text-slate-800 block">Mr. Rajesh Sharma</span>
                  <span className="text-slate-500 text-[10px]">Class Teacher Signature</span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="h-10 w-24 rounded-[4px] border border-dashed border-slate-300 flex items-center justify-center text-[10px] font-mono text-slate-400">
                    [ SCHOOL SEAL ]
                  </div>
                  <span className="text-slate-500 text-[10px] mt-1">Official Stamp</span>
                </div>

                <div>
                  <div className="border-b border-slate-400 w-36 mx-auto mb-1.5 h-6"></div>
                  <span className="font-semibold text-slate-800 block">Dr. S. K. Mahapatra</span>
                  <span className="text-slate-500 text-[10px]">Principal Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
