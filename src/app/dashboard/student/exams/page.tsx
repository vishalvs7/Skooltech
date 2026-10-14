import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle2,
  CalendarDays,
  Eye,
  Download,
  Printer,
  ArrowRight,
  Award,
} from "lucide-react";
import Link from "next/link";

const tabs = [
  { label: "All Exams", href: "/dashboard/student/exams" },
  { label: "Upcoming", href: "/dashboard/student/exams/upcoming" },
  { label: "Completed", href: "/dashboard/student/exams/completed" },
  { label: "Time Tables", href: "/dashboard/student/exams/time-tables" },
  { label: "Results", href: "/dashboard/student/exams/results" },
];

const exams = [
  {
    id: "ex-006",
    name: "Periodic Test 1 (PT-1)",
    type: "Unit Test",
    date: "May 15, 2026",
    status: "COMPLETED",
    score: "90.0%",
    grade: "A2",
  },
  {
    id: "ex-007",
    name: "Half Yearly Examination",
    type: "Half Yearly",
    date: "Sep 15 - Sep 30, 2026",
    status: "UPCOMING",
    subjects: 5,
  },
  {
    id: "ex-008",
    name: "Unit Test 2 (Algebra & Mechanics)",
    type: "Class Test",
    date: "Nov 10 - Nov 14, 2026",
    status: "UPCOMING",
    subjects: 3,
  },
  {
    id: "ex-009",
    name: "Annual Final Examination",
    type: "Annual",
    date: "Mar 1 - Mar 15, 2027",
    status: "UPCOMING",
    subjects: 5,
  },
];

export default function StudentExamsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Examinations</h1>
        <p className="text-sm text-slate-600 mt-1">View all exams for session 2026-2027 — upcoming schedules and completed results.</p>
      </div>
      <TabNavigation tabs={tabs} />

      <div className="space-y-4">
        {exams.map((exam) => (
          <Card key={exam.id} className={exam.status === "COMPLETED" ? "border-emerald-200" : "border-slate-200"}>
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-[4px] flex items-center justify-center shrink-0 ${
                  exam.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {exam.status === "COMPLETED" ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900">{exam.name}</h3>
                    <Badge variant={exam.status === "COMPLETED" ? "success" : "warning"} className="text-[10px]">
                      {exam.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{exam.type} • {exam.date}</p>
                  {exam.status === "COMPLETED" && (
                    <p className="text-xs text-emerald-700 font-medium mt-1">
                      Score: {exam.score} • Grade: {exam.grade}
                    </p>
                  )}
                  {exam.status === "UPCOMING" && (
                    <p className="text-xs text-slate-500 mt-1">
                      {exam.subjects} subjects • Time table available
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {exam.status === "COMPLETED" ? (
                  <>
                    <Link href={`/dashboard/student/exams/results?exam=${exam.id}`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                        <Eye className="h-3.5 w-3.5" /> View Result
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                      <Printer className="h-3.5 w-3.5" /> Print
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href={`/dashboard/student/exams/time-tables?exam=${exam.id}`}>
                      <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                        <CalendarDays className="h-3.5 w-3.5" /> View Time Table
                      </Button>
                    </Link>
                    <Link href={`/dashboard/student/exams/upcoming?exam=${exam.id}`}>
                      <Button size="sm" className="flex items-center gap-1.5 text-xs">
                        Details <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 text-blue-700 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">1</p>
            <p className="text-xs text-slate-500">Exams Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">3</p>
            <p className="text-xs text-slate-500">Upcoming Exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-700">90.0%</p>
            <p className="text-xs text-slate-500">Best Score (PT-1)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
