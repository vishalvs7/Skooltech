import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone, Send, Mail, MessageSquare, Eye } from "lucide-react";
import { NoticeBoardModal } from "@/components/admin/NoticeBoardModal";

const tabs = [
  { label: "Notices", href: "/dashboard/admin/communications" },
  { label: "Circulars", href: "/dashboard/admin/communications/circulars" },
  { label: "SMS/Email Logs", href: "/dashboard/admin/communications/logs" },
];

const notices = [
  { id: "1", title: "Welcome to Academic Session 2026-2027", target: "ALL", date: "Apr 01, 2026", createdBy: "teacher_sharma", status: "Published" },
  { id: "2", title: "PT-1 Schedule Announced", target: "STUDENT", date: "May 10, 2026", createdBy: "teacher_sharma", status: "Published" },
  { id: "3", title: "Fee Payment Reminder — Q2", target: "STUDENT", date: "Jul 05, 2026", createdBy: "accounts_demo", status: "Published" },
  { id: "4", title: "Staff Meeting — September", target: "TEACHER", date: "Sep 01, 2026", createdBy: "admin_demo", status: "Draft" },
];

export default function AdminCommunicationsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Communications</h1>
          <p className="text-sm text-slate-600 mt-1">School notices, circulars, and messaging logs.</p>
        </div>
        <NoticeBoardModal />
      </div>
      <TabNavigation tabs={tabs} />

      <div className="space-y-3">
        {notices.map((n) => (
          <Card key={n.id}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-[4px] bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">{n.title}</h3>
                  <p className="text-xs text-slate-500">{n.date} • By: {n.createdBy}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={n.target === "ALL" ? "default" : n.target === "STUDENT" ? "success" : "secondary"} className="text-[10px]">
                  {n.target}
                </Badge>
                <Badge variant={n.status === "Published" ? "success" : "warning"} className="text-[10px]">
                  {n.status}
                </Badge>
                <Button size="sm" variant="ghost" className="h-7 px-2"><Eye className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
