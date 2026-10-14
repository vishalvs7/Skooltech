import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Search, Download, FileText, Eye } from "lucide-react";

const tabs = [
  { label: "Audit Trail", href: "/dashboard/admin/audit" },
  { label: "Discrepancy Log", href: "/dashboard/admin/audit/discrepancies" },
  { label: "Compliance Reports", href: "/dashboard/admin/audit/compliance" },
];

const auditLogs = [
  { id: "1", action: "FEE_COLLECTED", user: "accounts_demo", role: "ACCOUNTS", entity: "RCP-2026-0001", date: "Apr 05, 2026 10:30 AM", details: "₹13,500 via UPI" },
  { id: "2", action: "FEE_COLLECTED", user: "accounts_demo", role: "ACCOUNTS", entity: "RCP-2026-0002", date: "Apr 05, 2026 11:15 AM", details: "₹13,500 via Cash" },
  { id: "3", action: "MARKS_UPDATED", user: "teacher_sharma", role: "TEACHER", entity: "PT-1 Mathematics", date: "May 18, 2026 02:30 PM", details: "50 results entered" },
  { id: "4", action: "ATTENDANCE_MARKED", user: "teacher_sharma", role: "TEACHER", entity: "2026-04-08 Class 5-A", date: "Apr 08, 2026 08:35 AM", details: "23/25 Present" },
  { id: "5", action: "LEAVE_APPROVED", user: "teacher_sharma", role: "TEACHER", entity: "LV-2026-0440", date: "Sep 11, 2026 04:00 PM", details: "Personal Leave approved" },
];

const getActionColor = (action: string) => {
  if (action.includes("FEE")) return "text-emerald-700";
  if (action.includes("LEAVE")) return "text-blue-700";
  if (action.includes("MARKS")) return "text-amber-700";
  return "text-slate-700";
};

export default function AdminAuditPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit & Compliance</h1>
          <p className="text-sm text-slate-600 mt-1">Immutable audit trail of all compliance-critical mutations.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-1.5">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>
      <TabNavigation tabs={tabs} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by action, user, or entity..." className="pl-9" />
        </div>
        <select className="h-9 rounded-[4px] border border-slate-200 bg-white px-3 text-sm focus:border-blue-600">
          <option>All Actions</option>
          <option>Fee Collections</option>
          <option>Attendance</option>
          <option>Exams & Marks</option>
          <option>Leave Decisions</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
                <th className="text-left py-3 px-4">Action</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Entity</th>
                <th className="text-left py-3 px-4">Details</th>
                <th className="text-left py-3 px-4">Timestamp</th>
                <th className="text-center py-3 px-4">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <span className={`font-semibold font-mono text-[11px] ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{log.user}</p>
                    <p className="text-[10px] text-slate-500">{log.role}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{log.entity}</td>
                  <td className="py-3 px-4 text-slate-600">{log.details}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">{log.date}</td>
                  <td className="py-3 px-4 text-center">
                    <Button size="sm" variant="ghost" className="h-7 px-2"><Eye className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
