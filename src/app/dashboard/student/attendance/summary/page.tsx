import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const tabs = [
  { label: "Monthly Calendar", href: "/dashboard/student/attendance" },
  { label: "Summary Stats", href: "/dashboard/student/attendance/summary" },
  { label: "Holidays", href: "/dashboard/student/attendance/holidays" },
  { label: "Apply Leave", href: "/dashboard/student/attendance/leave" },
  { label: "Raise Dispute", href: "/dashboard/student/attendance/dispute" },
];

const monthlyData = [
  { month: "April 2026", working: 25, present: 24, absent: 1, late: 0, pct: 96 },
  { month: "May 2026", working: 22, present: 21, absent: 1, late: 0, pct: 95 },
  { month: "June 2026", working: 20, present: 19, absent: 0, late: 1, pct: 95 },
  { month: "July 2026", working: 24, present: 23, absent: 1, late: 0, pct: 96 },
  { month: "August 2026", working: 22, present: 20, absent: 2, late: 0, pct: 91 },
  { month: "September 2026", working: 21, present: 21, absent: 0, late: 0, pct: 100 },
];

export default function AttendanceSummaryPage() {
  const totalWorking = monthlyData.reduce((s, m) => s + m.working, 0);
  const totalPresent = monthlyData.reduce((s, m) => s + m.present, 0);
  const overallPct = Math.round((totalPresent / totalWorking) * 100);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance Summary</h1>
        <p className="text-sm text-slate-600 mt-1">Year-to-date attendance statistics for academic session 2026-2027.</p>
      </div>
      <TabNavigation tabs={tabs} />

      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Overall Attendance</p>
              <p className="text-3xl font-bold text-blue-700">{overallPct}%</p>
              <Progress value={overallPct} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Total Working Days</p>
              <p className="text-3xl font-bold text-slate-900">{totalWorking}</p>
              <p className="text-xs text-slate-500 mt-1">April - September 2026</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Days Present</p>
              <p className="text-3xl font-bold text-emerald-700">{totalPresent}</p>
              <p className="text-xs text-slate-500 mt-1">{totalWorking - totalPresent} absent/late days</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Breakdown</CardTitle>
            <CardDescription>Month-wise attendance for the current session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                    <th className="text-left py-2.5 px-3">Month</th>
                    <th className="text-center py-2.5 px-3">Working Days</th>
                    <th className="text-center py-2.5 px-3">Present</th>
                    <th className="text-center py-2.5 px-3">Absent</th>
                    <th className="text-center py-2.5 px-3">Late</th>
                    <th className="text-center py-2.5 px-3">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {monthlyData.map((m) => (
                    <tr key={m.month} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{m.month}</td>
                      <td className="text-center py-2.5 px-3 text-slate-600 font-mono">{m.working}</td>
                      <td className="text-center py-2.5 px-3 text-emerald-700 font-bold font-mono">{m.present}</td>
                      <td className="text-center py-2.5 px-3 text-rose-600 font-mono">{m.absent}</td>
                      <td className="text-center py-2.5 px-3 text-amber-600 font-mono">{m.late}</td>
                      <td className="text-center py-2.5 px-3">
                        <Badge variant={m.pct >= 90 ? "success" : "warning"} className="font-mono">{m.pct}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
