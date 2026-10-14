import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, Printer } from "lucide-react";

const tabs = [
  { label: "All Exams", href: "/dashboard/student/exams" },
  { label: "Upcoming", href: "/dashboard/student/exams/upcoming" },
  { label: "Completed", href: "/dashboard/student/exams/completed" },
  { label: "Time Tables", href: "/dashboard/student/exams/time-tables" },
  { label: "Results", href: "/dashboard/student/exams/results" },
];

const timeTables = [
  {
    id: "tt-007",
    examName: "Half Yearly Examination 2026",
    className: "Class 5 - Section A",
    schedule: [
      { date: "Sep 15, 2026", day: "Tuesday", subject: "Mathematics", maxMarks: 80, time: "09:00 AM - 12:00 PM" },
      { date: "Sep 17, 2026", day: "Thursday", subject: "Science", maxMarks: 80, time: "09:00 AM - 12:00 PM" },
      { date: "Sep 21, 2026", day: "Monday", subject: "English Language & Literature", maxMarks: 80, time: "09:00 AM - 12:00 PM" },
      { date: "Sep 24, 2026", day: "Thursday", subject: "Hindi", maxMarks: 80, time: "09:00 AM - 12:00 PM" },
      { date: "Sep 28, 2026", day: "Monday", subject: "Social Science", maxMarks: 80, time: "09:00 AM - 12:00 PM" },
    ],
  },
  {
    id: "tt-008",
    examName: "Unit Test 2 (Algebra & Mechanics)",
    className: "Class 5 - Section A",
    schedule: [
      { date: "Nov 10, 2026", day: "Tuesday", subject: "Mathematics", maxMarks: 40, time: "10:00 AM - 11:30 AM" },
      { date: "Nov 12, 2026", day: "Thursday", subject: "Science", maxMarks: 40, time: "10:00 AM - 11:30 AM" },
      { date: "Nov 14, 2026", day: "Saturday", subject: "English", maxMarks: 40, time: "10:00 AM - 11:30 AM" },
    ],
  },
];

export default function TimeTablesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Exam Time Tables</h1>
        <p className="text-sm text-slate-600 mt-1">Download official time tables for upcoming examinations.</p>
      </div>
      <TabNavigation tabs={tabs} />

      <div className="space-y-6">
        {timeTables.map((tt) => (
          <Card key={tt.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-700" />
                    {tt.examName}
                  </CardTitle>
                  <CardDescription>{tt.className} • {tt.schedule.length} Exam Days</CardDescription>
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
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                      <th className="text-center py-2.5 px-3">S.No</th>
                      <th className="text-left py-2.5 px-3">Date</th>
                      <th className="text-left py-2.5 px-3">Day</th>
                      <th className="text-left py-2.5 px-3">Subject</th>
                      <th className="text-center py-2.5 px-3">Max Marks</th>
                      <th className="text-center py-2.5 px-3">Timing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tt.schedule.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="text-center py-2.5 px-3 font-mono text-slate-500">{i + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{row.date}</td>
                        <td className="py-2.5 px-3 text-slate-600">{row.day}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{row.subject}</td>
                        <td className="text-center py-2.5 px-3 font-mono text-slate-700">{row.maxMarks}</td>
                        <td className="text-center py-2.5 px-3 font-mono text-slate-600">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="mt-4 p-3 rounded-[4px] bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <p className="font-semibold mb-1">Instructions:</p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                  <li>Report to exam hall 15 minutes before scheduled time.</li>
                  <li>Carry school ID card and admit card mandatorily.</li>
                  <li>Electronic devices strictly prohibited.</li>
                  <li>Bring own geometry box, pens, and pencils.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
