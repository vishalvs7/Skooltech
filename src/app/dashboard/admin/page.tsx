import { getSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  GraduationCap, 
  CalendarDays, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileCheck
} from "lucide-react";
import { NewStudentModal } from "@/components/admin/NewStudentModal";
import { RolloverWizardModal } from "@/components/admin/RolloverWizardModal";
import { NoticeBoardModal, NoticeFeedList } from "@/components/admin/NoticeBoardModal";

export default async function AdminDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Modals */}
      <div className="bg-white border border-slate-200 rounded-[4px] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs uppercase">School Admin Portal</Badge>
            <span className="text-xs text-slate-500 font-mono">Academic Session 2026-2027</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {session?.username}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Manage school settings, 3-step student onboarding pipeline, and academic session rollovers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NoticeBoardModal />
          <RolloverWizardModal />
          <NewStudentModal />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Total Enrolled</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-between">
              40 Students
              <GraduationCap className="h-5 w-5 text-blue-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Across Class 5-A, 5-B, 6-A</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Staff Accounts</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-between">
              5 Staff
              <Users className="h-5 w-5 text-slate-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">1 Admin, 1 Principal, 1 Accounts, 2 Teachers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Academic Session</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-between">
              2026-2027
              <CalendarDays className="h-5 w-5 text-emerald-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success" className="text-[10px]">Active (April - March)</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase">Data Isolation</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-between">
              Postgres RLS
              <ShieldCheck className="h-5 w-5 text-blue-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600 font-semibold">Active & Secured</p>
          </CardContent>
        </Card>
      </div>

      {/* 3-Step Staged Onboarding Roadmap Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Staged 3-Step Student Onboarding Status</span>
            <Badge variant="secondary">Step 4 Core Pipeline</Badge>
          </CardTitle>
          <CardDescription>
            Distributed data entry pipeline distributing workload across Admin, Class Teachers, and Accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-[4px] border border-blue-200 bg-blue-50/40">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-blue-900">1. Admin Desk</span>
                <Badge variant="default" className="text-[10px]">Step 4A Active</Badge>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Generates immutable Admission Number, Student Name, and temporary credentials.
              </p>
              <div className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-blue-700" />
                Status: PENDING_ACADEMIC
              </div>
            </div>

            <div className="p-4 rounded-[4px] border border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-800">2. Class Teacher Desk</span>
                <Badge variant="secondary" className="text-[10px]">Step 4B</Badge>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Teacher places student into their Section with assigned Roll Number.
              </p>
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-slate-500" />
                Status: PENDING_FEE
              </div>
            </div>

            <div className="p-4 rounded-[4px] border border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-800">3. Accounts Desk</span>
                <Badge variant="secondary" className="text-[10px]">Step 4C</Badge>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Accountant assigns fee structure package (Monthly/Quarterly).
              </p>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Status: ACTIVE
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Directory Table with Lifecycle Badges */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Student Directory & Lifecycle State</CardTitle>
              <CardDescription>
                Live tracking of active enrollments and in-progress onboarding drafts.
              </CardDescription>
            </div>
            <Badge variant="secondary">Total: 40 Enrolled + 2 Drafts</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-[4px] border border-slate-200 overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-2 font-semibold text-slate-700 grid grid-cols-5 border-b border-slate-200">
              <span>Admission No</span>
              <span>Student Full Name</span>
              <span>Class & Section</span>
              <span>Parent Contact</span>
              <span>Lifecycle Status</span>
            </div>
            {/* Draft Student */}
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center bg-blue-50/20">
              <span className="font-mono font-semibold text-blue-700">ADM-2026-091</span>
              <span className="font-semibold text-slate-900">Rohan Singhania</span>
              <span className="text-slate-400 italic">Unassigned (Teacher queue)</span>
              <span className="text-slate-600 font-mono">+91 98222 33441</span>
              <span>
                <Badge variant="default" className="text-[10px]">PENDING_ACADEMIC</Badge>
              </span>
            </div>
            {/* Placed Student */}
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center bg-amber-50/20">
              <span className="font-mono font-semibold text-blue-700">ADM-2026-092</span>
              <span className="font-semibold text-slate-900">Pooja Malhotra</span>
              <span className="text-slate-800 font-medium">Class 5 - Sec A (#26)</span>
              <span className="text-slate-600 font-mono">+91 98222 33442</span>
              <span>
                <Badge variant="warning" className="text-[10px]">PENDING_FEE</Badge>
              </span>
            </div>
            {/* Active Students */}
            <div className="px-4 py-3 grid grid-cols-5 border-b border-slate-100 items-center">
              <span className="font-mono font-semibold text-slate-700">ADM-1001</span>
              <span className="font-semibold text-slate-900">Aarav Sharma</span>
              <span className="text-slate-800 font-medium">Class 5 - Sec A (#1)</span>
              <span className="text-slate-600 font-mono">+91 98123 45671</span>
              <span>
                <Badge variant="success" className="text-[10px]">ACTIVE</Badge>
              </span>
            </div>
            <div className="px-4 py-3 grid grid-cols-5 items-center">
              <span className="font-mono font-semibold text-slate-700">ADM-1002</span>
              <span className="font-semibold text-slate-900">Ananya Iyer</span>
              <span className="text-slate-800 font-medium">Class 5 - Sec A (#2)</span>
              <span className="text-slate-600 font-mono">+91 98123 45672</span>
              <span>
                <Badge variant="success" className="text-[10px]">ACTIVE</Badge>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 8: School Notice Board & Announcements Hub */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span>School Notice Board & Broadcast Announcements (Step 8)</span>
                <Badge variant="default" className="text-[10px]">Multi-Role Broadcast</Badge>
              </CardTitle>
              <CardDescription>
                Publish official school circulars targeted to Teachers, Students, or the entire school community.
              </CardDescription>
            </div>
            <NoticeBoardModal />
          </div>
        </CardHeader>
        <CardContent>
          <NoticeFeedList />
        </CardContent>
      </Card>
    </div>
  );
}
