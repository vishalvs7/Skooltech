import Link from "next/link";
import { archiveContext, requireArchiveStudent, studentPlacement, STATUS_BADGE } from "@/lib/archive";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { TabNavigation } from "@/components/shared/TabNavigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserRound } from "lucide-react";

export default async function ArchiveStudentLayout({
  children,
  params,
}: LayoutProps<"/dashboard/archive/[studentId]">) {
  const ctx = await archiveContext();
  if (!ctx.dbReady) return <DatabaseSetupNotice />;

  const { studentId } = await params;
  const student = await requireArchiveStudent(ctx.session.schoolId, studentId);
  const base = `/dashboard/archive/${student.id}`;
  const placement = studentPlacement(student);

  const tabs = [
    { label: "Profile", href: `${base}/profile` },
    { label: "Sessions", href: `${base}/sessions` },
    { label: "Attendance", href: `${base}/attendance` },
    { label: "Fees", href: `${base}/fees` },
    { label: "Exams", href: `${base}/exams` },
    { label: "Transport", href: `${base}/transport` },
  ];

  return (
    <div className="max-w-6xl">
      <Link
        href="/dashboard/archive"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-700 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Archive Search
      </Link>

      <div className="flex flex-wrap items-center gap-4 mb-5">
        <div className="h-12 w-12 rounded-[4px] bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
          <UserRound className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
              {student.fullName}
            </h1>
            <Badge variant={STATUS_BADGE[student.status] || "outline"}>
              {student.status.replace(/_/g, " ")}
            </Badge>
            {(placement === "ALUMNI" || placement === "WITHDRAWN") && (
              <Badge variant="secondary">{placement}</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            <span className="font-mono font-semibold text-blue-700">{student.admissionNo}</span>
            {placement !== "ALUMNI" && placement !== "WITHDRAWN" && (
              <> &middot; {placement} &middot; {student.enrollments[0]?.session.name || "No session"}</>
            )}
            {student.enrollments.length > 0 && (
              <> &middot; {student.enrollments.length} session{student.enrollments.length !== 1 ? "s" : ""} on record</>
            )}
          </p>
        </div>
      </div>

      <TabNavigation tabs={tabs} />
      {children}
    </div>
  );
}
