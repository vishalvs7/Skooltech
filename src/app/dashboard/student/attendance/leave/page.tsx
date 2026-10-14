import { TabNavigation } from "@/components/shared/TabNavigation";
import { LeaveApplicationForm } from "@/components/student/LeaveApplicationForm";

const tabs = [
  { label: "Monthly Calendar", href: "/dashboard/student/attendance" },
  { label: "Summary Stats", href: "/dashboard/student/attendance/summary" },
  { label: "Holidays", href: "/dashboard/student/attendance/holidays" },
  { label: "Apply Leave", href: "/dashboard/student/attendance/leave" },
  { label: "Raise Dispute", href: "/dashboard/student/attendance/dispute" },
];

export default function ApplyLeavePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Apply for Leave</h1>
        <p className="text-sm text-slate-600 mt-1">Submit a leave application. Your class teacher will review it.</p>
      </div>
      <TabNavigation tabs={tabs} />
      <LeaveApplicationForm />
    </div>
  );
}
