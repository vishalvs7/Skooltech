import { TabNavigation } from "@/components/shared/TabNavigation";
import { LeaveApplicationForm } from "@/components/student/LeaveApplicationForm";

const tabs = [
  { label: "My Applications", href: "/dashboard/student/leaves" },
  { label: "Apply New", href: "/dashboard/student/leaves/apply" },
  { label: "History", href: "/dashboard/student/leaves/history" },
];

export default function ApplyNewLeavePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Apply for Leave</h1>
        <p className="text-sm text-slate-600 mt-1">Submit a new leave application to your class teacher.</p>
      </div>
      <TabNavigation tabs={tabs} />
      <LeaveApplicationForm />
    </div>
  );
}
