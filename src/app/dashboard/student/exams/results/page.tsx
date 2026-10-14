import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, Printer, Sparkles } from "lucide-react";

const tabs = [
  { label: "All Exams", href: "/dashboard/student/exams" },
  { label: "Upcoming", href: "/dashboard/student/exams/upcoming" },
  { label: "Completed", href: "/dashboard/student/exams/completed" },
  { label: "Time Tables", href: "/dashboard/student/exams/time-tables" },
  { label: "Results", href: "/dashboard/student/exams/results" },
];

const results = [
  {
    examName: "Periodic Test 1 (PT-1)",
    examType: "Unit Test",
    date: "May 15, 2026",
    subjects: [
      { subject: "Mathematics", total: 40, obtained: 38, pct: 95.0, grade: "A1", gp: 10.0 },
      { subject: "Science", total: 40, obtained: 36, pct: 90.0, grade: "A2", gp: 9.0 },
      { subject: "English Language & Literature", total: 40, obtained: 37, pct: 92.5, grade: "A1", gp: 10.0 },
      { subject: "Hindi", total: 40, obtained: 35, pct: 87.5, grade: "A2", gp: 9.0 },
      { subject: "Social Science", total: 40, obtained: 34, pct: 85.0, grade: "A2", gp: 9.0 },
    ],
    grandTotal: 200,
    grandObtained: 180,
    percentage: 90.0,
    overallGrade: "A2",
    cgpa10: 9.4,
    status: "PASSED",
  },
];

export default function ExamResultsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Exam Results</h1>
        <p className="text-sm text-slate-600 mt-1">Detailed results with CBSE grades, CGPA, and subject-wise performance.</p>
      </div>
      <TabNavigation tabs={tabs} />

      <div className="space-y-6">
        {results.map((result, i) => (
          <Card key={i} className="border-emerald-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600" />
                    {result.examName}
                  </CardTitle>
                  <CardDescription>{result.examType} • {result.date}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </Button>
                  <Button size="sm" className="flex items-center gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Score Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-[4px] border border-blue-100 mb-4">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Grand Total</p>
                  <p className="font-bold text-xl text-slate-900 font-mono">{result.grandObtained}/{result.grandTotal}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Percentage</p>
                  <p className="font-bold text-xl text-blue-700 font-mono">{result.percentage}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Overall Grade</p>
                  <p className="font-bold text-xl text-emerald-700">{result.overallGrade}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">CGPA (10.0)</p>
                  <p className="font-bold text-xl text-slate-900 font-mono">{result.cgpa10.toFixed(1)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Result</p>
                  <Badge variant="success" className="mt-1">{result.status}</Badge>
                </div>
              </div>

              {/* Subject Details */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                      <th className="text-left py-2.5 px-3">Subject</th>
                      <th className="text-center py-2.5 px-3">Max Marks</th>
                      <th className="text-center py-2.5 px-3">Marks Obtained</th>
                      <th className="text-center py-2.5 px-3">Percentage</th>
                      <th className="text-center py-2.5 px-3">CBSE Grade</th>
                      <th className="text-center py-2.5 px-3">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.subjects.map((sub) => (
                      <tr key={sub.subject} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{sub.subject}</td>
                        <td className="text-center py-2.5 px-3 font-mono text-slate-600">{sub.total}</td>
                        <td className="text-center py-2.5 px-3 font-mono font-bold text-blue-700">{sub.obtained}</td>
                        <td className="text-center py-2.5 px-3 font-mono text-slate-700">{sub.pct}%</td>
                        <td className="text-center py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-[4px] bg-blue-100 text-blue-800 font-bold text-[10px]">{sub.grade}</span>
                        </td>
                        <td className="text-center py-2.5 px-3 font-mono text-slate-800 font-semibold">{sub.gp.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Remark */}
              <div className="mt-4 p-3 rounded-[4px] bg-blue-50/50 border border-blue-100 text-xs">
                <span className="font-semibold text-blue-950">Class Teacher&apos;s Remark:</span>{" "}
                <span className="text-slate-700 italic">
                  &ldquo;Outstanding academic achievement. Excellent grasp of analytical concepts in Mathematics and Science.&rdquo;
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
