import { getSession } from "@/lib/auth";
import { assignAcademicPlacementAction } from "@/actions/student.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Clock, Check, UserPlus, ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { AttendanceRollCall } from "@/components/attendance/AttendanceRollCall";
import { CreateExamModal } from "@/components/teacher/CreateExamModal";
import { MarksEntryModal } from "@/components/teacher/MarksEntryModal";
import { LeaveReviewModal } from "@/components/teacher/LeaveReviewModal";

export default async function TeacherDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs uppercase font-medium">Teacher Portal</Badge>
            <span className="text-xs text-slate-500 font-mono">Assigned Section: Class 5-A</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {session?.username}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Your daily hub for morning roll-call, admissions placement, and CBSE exam grading.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CreateExamModal />
          <MarksEntryModal />
        </div>
      </div>

      {/* "My Class" Section Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase text-blue-900">My Class</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-900 flex items-center justify-between">
              Class 5-A
              <Users className="h-5 w-5 text-blue-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600">25 Enrolled Students (Roll 1 - 25)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Today&apos;s Attendance</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700 flex items-center justify-between">
              23 / 25
              <Check className="h-5 w-5 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">2 Absent today (Notification sent via Brevo)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Pending Admissions</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center justify-between">
              1 Queue
              <UserPlus className="h-5 w-5 text-blue-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Step 4B: Awaiting academic placement</p>
          </CardContent>
        </Card>
      </div>

      {/* Step 4B: Pending Admissions Placement Queue */}
      <Card className="border-blue-200 bg-blue-50/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span>Pending Admissions Queue (Step 4B)</span>
                <Badge variant="default" className="text-[10px]">Action Required</Badge>
              </CardTitle>
              <CardDescription>
                Assign class section and roll number for newly admitted student drafts created by Admin.
              </CardDescription>
            </div>
            <Badge variant="secondary">1 Awaiting Assignment</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-[4px] border border-slate-200 bg-white overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-2 font-semibold text-slate-700 grid grid-cols-5 border-b border-slate-200">
              <span>Admission No</span>
              <span>Student Full Name</span>
              <span>Parent Details</span>
              <span>Current Status</span>
              <span>Academic Assignment</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 items-center">
              <span className="font-mono font-semibold text-blue-700">ADM-2026-091</span>
              <span className="font-semibold text-slate-900">Rohan Singhania</span>
              <span className="text-slate-600">Vikram Singhania (+91 98222 33441)</span>
              <span>
                <Badge variant="default" className="text-[10px]">PENDING_ACADEMIC</Badge>
              </span>
              <div>
                <form
                  action={async (formData) => {
                    "use server";
                    await assignAcademicPlacementAction(formData);
                  }}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="studentId" value="ADM-2026-091" />
                  <input type="hidden" name="sectionId" value="section-5a" />
                  <input
                    name="rollNo"
                    defaultValue="26"
                    placeholder="Roll #"
                    className="h-7 w-16 px-2 text-xs rounded-[4px] border border-slate-200 font-mono text-center"
                    required
                  />
                  <Button size="sm" type="submit" className="h-7 text-xs px-2.5">
                    Assign to 5-A <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 8: Student Leave Approvals Hub */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Student Leave Requests (Step 8)</span>
            <Badge variant="outline" className="text-xs">Class 5-A Hub</Badge>
          </CardTitle>
          <CardDescription>
            Review pending student leave applications, verify medical certificates, and grant authorized absences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeaveReviewModal />
        </CardContent>
      </Card>

      {/* Step 7: Examination & Marks Evaluation Hub */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-700" />
                <span>Class 5-A Examinations & Grading Hub (Step 7)</span>
                <Badge variant="default" className="text-[10px]">CBSE 9-Point Scale</Badge>
              </CardTitle>
              <CardDescription>
                Schedule spontaneous tests, evaluate raw marks matrix, and calculate student percentiles and CGPA.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <CreateExamModal />
              <MarksEntryModal />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-[4px] border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Periodic Test 1 (PT-1)</h4>
                  <p className="text-xs text-slate-500">Unit Test • Commenced May 15, 2026</p>
                </div>
                <Badge variant="success" className="text-[10px]">Published</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-[4px] border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Subjects</span>
                  <span className="font-bold text-slate-900">5 / 5</span>
                </div>
                <div className="bg-white p-2 rounded-[4px] border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Evaluated</span>
                  <span className="font-bold text-emerald-700">25 Students</span>
                </div>
                <div className="bg-white p-2 rounded-[4px] border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Class Avg</span>
                  <span className="font-bold text-blue-700">88.4%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[4px] border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Unit Test 2 (Algebra & Mechanics)</h4>
                  <p className="text-xs text-slate-500">Class Test • Scheduled for Upcoming Week</p>
                </div>
                <Badge variant="outline" className="text-[10px]">Draft / Open</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-[4px] border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Max Marks</span>
                  <span className="font-bold text-slate-900">40 Marks</span>
                </div>
                <div className="bg-white p-2 rounded-[4px] border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Status</span>
                  <span className="font-bold text-amber-700">Awaiting Marks</span>
                </div>
                <div className="bg-white p-2 rounded-[4px] border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">Target</span>
                  <span className="font-bold text-slate-700">Class 5-A</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Morning Roll-Call Ledger (Step 5) */}
      <AttendanceRollCall />
    </div>
  );
}
