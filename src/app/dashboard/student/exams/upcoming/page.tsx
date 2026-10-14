import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CalendarDays, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

const tabs = [
  { label: "All Exams", href: "/dashboard/student/exams" },
  { label: "Upcoming", href: "/dashboard/student/exams/upcoming" },
  { label: "Completed", href: "/dashboard/student/exams/completed" },
  { label: "Time Tables", href: "/dashboard/student/exams/time-tables" },
  { label: "Results", href: "/dashboard/student/exams/results" },
];

const upcomingExams = [
  {
    id: "ex-007",
    name: "Half Yearly Examination",
    type: "Half Yearly",
    startDate: "Sep 15, 2026",
    endDate: "Sep 30, 2026",
    subjects: [
      { name: "Mathematics", date: "Sep 15", maxMarks: 80, time: "09:00 - 12:00" },
      { name: "Science", date: "Sep 17", maxMarks: 80, time: "09:00 - 12:00" },
      { name: "English Language & Literature", date: "Sep 21", maxMarks: 80, time: "09:00 - 12:00" },
      { name: "Hindi", date: "Sep 24", maxMarks: 80, time: "09:00 - 12:00" },
      { name: "Social Science", date: "Sep 28", maxMarks: 80, time: "09:00 - 12:00" },
    ],
  },
  {
    id: "ex-008",
    name: "Unit Test 2 (Algebra & Mechanics)",
    type: "Class Test",
    startDate: "Nov 10, 2026",
    endDate: "Nov 14, 2026",
    subjects: [
      { name: "Mathematics", date: "Nov 10", maxMarks: 40, time: "10:00 - 11:30" },
      { name: "Science", date: "Nov 12", maxMarks: 40, time: "10:00 - 11:30" },
      { name: "English", date: "Nov 14", maxMarks: 40, time: "10:00 - 11:30" },
    ],
  },
];

export default function UpcomingExamsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Upcoming Examinations</h1>
        <p className="text-sm text-slate-600 mt-1">Scheduled exams with detailed time tables and syllabus coverage.</p>
      </div>
      <TabNavigation tabs={tabs} />

      <div className="space-y-6">
        {upcomingExams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-700" />
                    {exam.name}
                  </CardTitle>
                  <CardDescription>
                    {exam.type} • {exam.startDate} to {exam.endDate} • {exam.subjects.length} subjects
                  </CardDescription>
                </div>
                <Badge variant="warning">Upcoming</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                      <th className="text-left py-2.5 px-3">Subject</th>
                      <th className="text-center py-2.5 px-3">Exam Date</th>
                      <th className="text-center py-2.5 px-3">Max Marks</th>
                      <th className="text-center py-2.5 px-3">Timing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {exam.subjects.map((sub) => (
                      <tr key={sub.name} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{sub.name}</td>
                        <td className="text-center py-2.5 px-3 text-slate-600">{sub.date}</td>
                        <td className="text-center py-2.5 px-3 font-mono text-slate-700">{sub.maxMarks}</td>
                        <td className="text-center py-2.5 px-3 text-slate-600 font-mono">{sub.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Link href="/dashboard/student/exams/time-tables">
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                    <CalendarDays className="h-3.5 w-3.5" /> Download Full Time Table
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
