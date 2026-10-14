import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye, Printer, Download } from "lucide-react";
import Link from "next/link";

const tabs = [
  { label: "All Exams", href: "/dashboard/student/exams" },
  { label: "Upcoming", href: "/dashboard/student/exams/upcoming" },
  { label: "Completed", href: "/dashboard/student/exams/completed" },
  { label: "Time Tables", href: "/dashboard/student/exams/time-tables" },
  { label: "Results", href: "/dashboard/student/exams/results" },
];

const completedExams = [
  {
    id: "ex-006",
    name: "Periodic Test 1 (PT-1)",
    type: "Unit Test",
    date: "May 15, 2026",
    score: 180,
    maxScore: 200,
    percentage: 90.0,
    grade: "A2",
    gradePoint: 9.0,
    subjects: [
      { subject: "Mathematics", total: 40, obtained: 38, pct: 95.0, grade: "A1" },
      { subject: "Science", total: 40, obtained: 36, pct: 90.0, grade: "A2" },
      { subject: "English", total: 40, obtained: 37, pct: 92.5, grade: "A1" },
      { subject: "Hindi", total: 40, obtained: 35, pct: 87.5, grade: "A2" },
      { subject: "Social Science", total: 40, obtained: 34, pct: 85.0, grade: "A2" },
    ],
    status: "PASSED",
  },
];

export default function CompletedExamsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Completed Examinations</h1>
        <p className="text-sm text-slate-600 mt-1">View results of exams you have already taken this session.</p>
      </div>
      <TabNavigation tabs={tabs} />

      <div className="space-y-4">
        {completedExams.map((exam) => (
          <Card key={exam.id} className="border-emerald-200">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-[4px] bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{exam.name}</h3>
                      <Badge variant="success" className="text-[10px]">Completed</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{exam.type} • {exam.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/student/exams/results?exam=${exam.id}`}>
                    <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                      <Eye className="h-3.5 w-3.5" /> View Full Result
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </Button>
                </div>
              </div>

              {/* Score Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-slate-50 rounded-[4px] text-center">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Score</p>
                  <p className="font-bold text-slate-900 font-mono">{exam.score} / {exam.maxScore}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Percentage</p>
                  <p className="font-bold text-blue-700 font-mono">{exam.percentage}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">CBSE Grade</p>
                  <p className="font-bold text-emerald-700">{exam.grade}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Grade Point</p>
                  <p className="font-bold text-slate-900 font-mono">{exam.gradePoint.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Result</p>
                  <Badge variant="success" className="text-[10px]">{exam.status}</Badge>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] border-b border-slate-200">
                      <th className="text-left py-2 px-3">Subject</th>
                      <th className="text-center py-2 px-3">Max Marks</th>
                      <th className="text-center py-2 px-3">Marks Obtained</th>
                      <th className="text-center py-2 px-3">Percentage</th>
                      <th className="text-center py-2 px-3">CBSE Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {exam.subjects.map((sub) => (
                      <tr key={sub.subject}>
                        <td className="py-2 px-3 font-semibold text-slate-900">{sub.subject}</td>
                        <td className="text-center py-2 px-3 font-mono text-slate-600">{sub.total}</td>
                        <td className="text-center py-2 px-3 font-mono font-bold text-blue-700">{sub.obtained}</td>
                        <td className="text-center py-2 px-3 font-mono text-slate-700">{sub.pct}%</td>
                        <td className="text-center py-2 px-3">
                          <span className="px-2 py-0.5 rounded-[4px] bg-blue-100 text-blue-800 font-bold text-[10px]">{sub.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
