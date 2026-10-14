import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function StudentProfilePage() {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const student = await prisma.student.findFirst({
    where: { userId: session.userId, schoolId: session.schoolId },
    include: { enrollments: { orderBy: { createdAt: "desc" }, take: 1, include: { section: { include: { class: true } } } } },
  });

  if (!student) {
    return <Card><CardContent className="p-8 text-center text-slate-500 text-sm">Student profile not found.</CardContent></Card>;
  }

  const e = student.enrollments[0];
  const cls = e?.section?.class?.name || "—";
  const section = e?.section?.name || "";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-600 mt-1">Your personal and academic information</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-xs text-slate-500">Full Name</span><span className="text-sm font-medium text-slate-900">{student.fullName}</span></div>
            <div className="flex justify-between"><span className="text-xs text-slate-500">Admission No</span><span className="text-sm font-mono font-semibold text-blue-700">{student.admissionNo}</span></div>
            <div className="flex justify-between"><span className="text-xs text-slate-500">Date of Birth</span><span className="text-sm text-slate-900">{student.dob ? new Date(student.dob).toLocaleDateString("en-IN") : "—"}</span></div>
            <div className="flex justify-between"><span className="text-xs text-slate-500">Gender</span><span className="text-sm text-slate-900">{student.gender || "—"}</span></div>
            <div className="flex justify-between"><span className="text-xs text-slate-500">Status</span><Badge variant="outline">{student.status}</Badge></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Academic Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between"><span className="text-xs text-slate-500">Class</span><span className="text-sm font-medium text-slate-900">{cls}{section ? ` - ${section}` : ""}</span></div>
            <div className="flex justify-between"><span className="text-xs text-slate-500">Roll No</span><span className="text-sm text-slate-900">{e?.rollNo || "—"}</span></div>
            <div className="flex justify-between"><span className="text-xs text-slate-500">Parent/Guardian</span><span className="text-sm text-slate-900">{student.parentName || "—"}</span></div>
            <div className="flex justify-between"><span className="text-xs text-slate-500">Parent Phone</span><span className="text-sm text-slate-900">{student.parentPhone || "—"}</span></div>
            <div className="flex justify-between"><span className="text-xs text-slate-500">Parent Email</span><span className="text-sm text-slate-900">{student.parentEmail || "—"}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
