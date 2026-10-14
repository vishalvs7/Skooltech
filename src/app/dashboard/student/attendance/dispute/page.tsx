import { TabNavigation } from "@/components/shared/TabNavigation";
import { AttendanceDisputeForm } from "@/components/student/AttendanceDisputeForm";

const tabs = [
  { label: "Monthly Calendar", href: "/dashboard/student/attendance" },
  { label: "Summary Stats", href: "/dashboard/student/attendance/summary" },
  { label: "Holidays", href: "/dashboard/student/attendance/holidays" },
  { label: "Apply Leave", href: "/dashboard/student/attendance/leave" },
  { label: "Raise Dispute", href: "/dashboard/student/attendance/dispute" },
];

export default function AttendanceDisputePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Raise Attendance Dispute</h1>
        <p className="text-sm text-slate-600 mt-1">If you were present but marked absent, submit a dispute for correction.</p>
      </div>
      <TabNavigation tabs={tabs} />
      <AttendanceDisputeForm />
    </div>
  );
}
