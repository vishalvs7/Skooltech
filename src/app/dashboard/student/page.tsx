import { getSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, FileCheck, IndianRupee, FileText, ArrowRight, Award } from "lucide-react";
import { ReportCardModal } from "@/components/student/ReportCardModal";
import { LeaveApplicationModal } from "@/components/student/LeaveApplicationModal";
import { OnlineFeePaymentModal } from "@/components/student/OnlineFeePaymentModal";

export default async function StudentDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs uppercase font-medium">Student & Parent Portal</Badge>
            <span className="text-xs text-slate-500 font-mono">Admission No: {session?.username}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome, Aarav Sharma
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Class 5 - Section A • Roll No: 1 • Academic Year 2026-2027
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <OnlineFeePaymentModal
            admissionNo={session?.username || "ADM-1001"}
            studentName="Aarav Sharma"
          />
          <ReportCardModal
            studentName="Aarav Sharma"
            admissionNo={session?.username || "ADM-1001"}
            rollNo="01"
            className="Class 5"
            sectionName="A"
            academicSession="2026-2027"
          />
          <LeaveApplicationModal
            studentAdmissionNo={session?.username || "ADM-1001"}
            studentName="Aarav Sharma"
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Attendance Rate</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700 flex items-center justify-between">
              96.0%
              <CalendarCheck className="h-5 w-5 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">24 Present / 1 Absent / 25 Working Days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Fee Status</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700 flex items-center justify-between">
              Paid (Q1)
              <IndianRupee className="h-5 w-5 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Receipt No: RCP-2026-0001 (UPI)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Academic Performance</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center justify-between">
              88.4%
              <FileCheck className="h-5 w-5 text-blue-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Periodic Test 1 (PT-1) Overall Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Examination Scorecard Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-blue-700" />
                <span>Periodic Assessment 1 (PT-1) Official Scorecard</span>
                <Badge variant="default" className="text-[10px]">CBSE 9-Point Scale</Badge>
              </CardTitle>
              <CardDescription>
                Subject scores evaluated by Class & Subject Teachers with automatic CBSE percentile and grade allocation.
              </CardDescription>
            </div>
            <ReportCardModal
              studentName="Aarav Sharma"
              admissionNo={session?.username || "ADM-1001"}
              rollNo="01"
              className="Class 5"
              sectionName="A"
              academicSession="2026-2027"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-[4px] border border-slate-200 overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-2.5 font-semibold text-slate-700 grid grid-cols-5 border-b border-slate-200 uppercase text-[11px]">
              <span>Subject</span>
              <span className="text-center">Max Marks</span>
              <span className="text-center">Marks Obtained</span>
              <span className="text-center">CBSE Grade</span>
              <span className="text-right">Remark</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center">
              <span className="font-semibold text-slate-900">Mathematics</span>
              <span className="text-center text-slate-600 font-mono">40</span>
              <span className="text-center font-bold text-blue-700 font-mono">38</span>
              <span className="text-center">
                <span className="px-2 py-0.5 rounded-[4px] bg-emerald-100 text-emerald-800 font-bold text-[11px]">A1 (95.0%)</span>
              </span>
              <span className="text-right text-slate-500 italic">Outstanding</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center">
              <span className="font-semibold text-slate-900">Science</span>
              <span className="text-center text-slate-600 font-mono">40</span>
              <span className="text-center font-bold text-blue-700 font-mono">36</span>
              <span className="text-center">
                <span className="px-2 py-0.5 rounded-[4px] bg-teal-100 text-teal-800 font-bold text-[11px]">A2 (90.0%)</span>
              </span>
              <span className="text-right text-slate-500 italic">Excellent</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center">
              <span className="font-semibold text-slate-900">English Language</span>
              <span className="text-center text-slate-600 font-mono">40</span>
              <span className="text-center font-bold text-blue-700 font-mono">37</span>
              <span className="text-center">
                <span className="px-2 py-0.5 rounded-[4px] bg-emerald-100 text-emerald-800 font-bold text-[11px]">A1 (92.5%)</span>
              </span>
              <span className="text-right text-slate-500 italic">Outstanding</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center">
              <span className="font-semibold text-slate-900">Hindi</span>
              <span className="text-center text-slate-600 font-mono">40</span>
              <span className="text-center font-bold text-blue-700 font-mono">35</span>
              <span className="text-center">
                <span className="px-2 py-0.5 rounded-[4px] bg-teal-100 text-teal-800 font-bold text-[11px]">A2 (87.5%)</span>
              </span>
              <span className="text-right text-slate-500 italic">Very Good</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 items-center">
              <span className="font-semibold text-slate-900">Social Science</span>
              <span className="text-center text-slate-600 font-mono">40</span>
              <span className="text-center font-bold text-blue-700 font-mono">34</span>
              <span className="text-center">
                <span className="px-2 py-0.5 rounded-[4px] bg-teal-100 text-teal-800 font-bold text-[11px]">A2 (85.0%)</span>
              </span>
              <span className="text-right text-slate-500 italic">Good</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-[4px] bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Grand Total</span>
                <span className="font-bold text-blue-950 font-mono">180 / 200 (90.0%)</span>
              </div>
              <div className="border-l border-blue-200 pl-4">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">CBSE Grade</span>
                <span className="font-bold text-emerald-800">A2 (Distinction)</span>
              </div>
              <div className="border-l border-blue-200 pl-4">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Result</span>
                <span className="font-bold text-emerald-700">PASSED / PROMOTED</span>
              </div>
            </div>
            <div className="text-slate-500 text-[11px]">
              Class Teacher: <span className="font-medium text-slate-700">Mr. Rajesh Sharma</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
