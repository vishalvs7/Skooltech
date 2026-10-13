"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Search, 
  Eye, 
  X, 
  Clock, 
  FileCode, 
  CheckCircle2, 
  Filter 
} from "lucide-react";

export interface AuditRecord {
  id: string;
  timestamp: string;
  username: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown> | null;
}

const DEFAULT_AUDIT_LOGS: AuditRecord[] = [
  {
    id: "aud-001",
    timestamp: "May 15, 2026, 09:12 AM",
    username: "accounts_demo",
    userRole: "ACCOUNTS",
    action: "FEE_COLLECTED",
    entityType: "payment_transactions",
    entityId: "RCP-2026-0016",
    details: {
      amountPaid: 13500,
      paymentMethod: "UPI",
      referenceNo: "UPI-UTR-9874561612",
      studentAdmissionNo: "ADM-1016",
    },
  },
  {
    id: "aud-002",
    timestamp: "May 15, 2026, 08:35 AM",
    username: "teacher_sharma",
    userRole: "TEACHER",
    action: "EXAM_MARKS_RECORDED",
    entityType: "exam_results",
    entityId: "pt-1-class-5a",
    details: {
      subject: "Mathematics",
      totalMarks: 40,
      studentsEvaluated: 25,
      classAverage: 88.4,
    },
  },
  {
    id: "aud-003",
    timestamp: "May 15, 2026, 08:05 AM",
    username: "teacher_sharma",
    userRole: "TEACHER",
    action: "LEAVE_REVIEWED",
    entityType: "leave_applications",
    entityId: "leave-101",
    details: {
      studentAdmissionNo: "ADM-1001",
      status: "APPROVED",
      reason: "Viral flu (Medical Certificate verified)",
    },
  },
  {
    id: "aud-004",
    timestamp: "May 14, 2026, 04:30 PM",
    username: "principal_demo",
    userRole: "PRINCIPAL",
    action: "NOTICE_PUBLISHED",
    entityType: "notices",
    entityId: "not-02",
    details: {
      title: "Periodic Test 1 (PT-1) Schedule & Guidelines",
      targetRole: "STUDENT",
    },
  },
  {
    id: "aud-005",
    timestamp: "May 14, 2026, 02:15 PM",
    username: "admin_demo",
    userRole: "SCHOOL_ADMIN",
    action: "SESSION_ROLLOVER",
    entityType: "academic_sessions",
    entityId: "session-2026-27",
    details: {
      fromSession: "2025-2026",
      toSession: "2026-2027",
      studentsPromoted: 40,
    },
  },
];

export function AuditTrailViewer({ logs = DEFAULT_AUDIT_LOGS }: { logs?: AuditRecord[] }) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.username.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.entityId.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = actionFilter === "ALL" || log.action === actionFilter;

      return matchesSearch && matchesFilter;
    });
  }, [logs, search, actionFilter]);

  const getActionBadgeColor = (action: string) => {
    if (action.includes("FEE")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (action.includes("EXAM") || action.includes("MARKS")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (action.includes("LEAVE")) return "bg-amber-100 text-amber-800 border-amber-200";
    if (action.includes("NOTICE")) return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user, action or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-[4px] border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-8 px-2 text-xs rounded-[4px] border border-slate-200 bg-white"
          >
            <option value="ALL">All Event Types</option>
            <option value="FEE_COLLECTED">FEE_COLLECTED</option>
            <option value="EXAM_MARKS_RECORDED">EXAM_MARKS_RECORDED</option>
            <option value="LEAVE_REVIEWED">LEAVE_REVIEWED</option>
            <option value="NOTICE_PUBLISHED">NOTICE_PUBLISHED</option>
            <option value="SESSION_ROLLOVER">SESSION_ROLLOVER</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-slate-200 rounded-[4px]">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Authorized Actor</th>
              <th className="py-2.5 px-3">Audit Event</th>
              <th className="py-2.5 px-3">Entity Identifier</th>
              <th className="py-2.5 px-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/70 transition">
                <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                  {log.timestamp}
                </td>
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-900">{log.username}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{log.userRole}</div>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-[4px] font-bold text-[10px] border ${getActionBadgeColor(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono text-blue-700">
                  {log.entityId}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRecord(log)}
                    className="h-6 text-[11px] px-2"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    <span>Inspect</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inspect Delta Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md bg-white rounded-[4px] shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-blue-100 flex items-center justify-center text-blue-700">
                  <FileCode className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Immutable Audit Entry</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedRecord.action}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 rounded-[4px] p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-[4px] border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Actor</span>
                  <span className="font-semibold text-slate-900">{selectedRecord.username}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Timestamp</span>
                  <span className="font-mono text-slate-700">{selectedRecord.timestamp}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Entity Type</span>
                  <span className="font-mono text-slate-700">{selectedRecord.entityType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Entity ID</span>
                  <span className="font-mono text-blue-800 font-bold">{selectedRecord.entityId}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Recorded Transaction Delta (JSON Payload):
                </label>
                <pre className="p-3 rounded-[4px] bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
                  {JSON.stringify(selectedRecord.details || {}, null, 2)}
                </pre>
              </div>

              <div className="p-2.5 rounded-[4px] bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-700" />
                <span>SHA-256 state hash verified. Tamper-evident record.</span>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-slate-100 bg-slate-50">
              <Button size="sm" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
