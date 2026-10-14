"use client";

import { useState, useTransition } from "react";
import { saveDailyAttendanceAction, AttendanceActionResponse } from "@/actions/attendance.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Sparkles,
  Save,
} from "lucide-react";

export interface RosterStudent {
  enrollmentId: string;
  rollNo: string;
  studentName: string;
  admissionNo: string;
}

interface AttendanceRollCallProps {
  roster: RosterStudent[];
  classLabel?: string;
}

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

interface RollCallRecord {
  enrollmentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export function AttendanceRollCall({ roster, classLabel = "Class" }: AttendanceRollCallProps) {
  const today = new Date().toISOString().split("T")[0];
  const [dateStr, setDateStr] = useState(today);
  const [records, setRecords] = useState<RollCallRecord[]>(
    roster.map((s) => ({ enrollmentId: s.enrollmentId, status: "PRESENT" as AttendanceStatus }))
  );
  const [response, setResponse] = useState<AttendanceActionResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const markAllPresent = () => {
    setRecords((prev) =>
      prev.map((r) => ({ ...r, status: "PRESENT" as AttendanceStatus, remarks: undefined }))
    );
  };

  const updateStatus = (index: number, status: AttendanceStatus) => {
    setRecords((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        status,
        remarks: status === "PRESENT" ? undefined : updated[index].remarks,
      };
      return updated;
    });
  };

  const updateRemarks = (index: number, remarks: string) => {
    setRecords((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], remarks };
      return updated;
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await saveDailyAttendanceAction(dateStr, records);
      setResponse(res);
    });
  };

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const lateCount = records.filter((r) => r.status === "LATE").length;

  if (roster.length === 0) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-8 text-center text-sm text-slate-500">
          No students enrolled in your class yet. Roster will appear once students are placed.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" className="text-xs uppercase">Daily Morning Roll-Call</Badge>
              <span className="text-xs text-slate-500 font-mono">{classLabel}</span>
            </div>
            <CardTitle className="text-lg">Attendance Ledger</CardTitle>
            <CardDescription>
              Complete morning roll call in under 30 seconds with 1-click &quot;Mark All Present&quot;.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-slate-200 bg-white text-xs font-mono">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="bg-transparent focus:outline-none"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={markAllPresent}
              className="text-emerald-700 border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Mark All Present
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-[4px] border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-800">Present: {presentCount}</span>
            <span className="text-slate-500">({Math.round((presentCount / records.length) * 100)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="font-semibold text-slate-800">Absent: {absentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="font-semibold text-slate-800">Late: {lateCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {response && (
          <div
            className={`mb-4 p-3 rounded-[4px] border text-xs flex items-start gap-2 ${
              response.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {response.success ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{response.success ? "Attendance Saved" : "Error"}</p>
              <p>{response.message || response.error}</p>
            </div>
          </div>
        )}

        <div className="rounded-[4px] border border-slate-200 overflow-hidden text-xs">
          <div className="bg-slate-50 px-4 py-2 font-semibold text-slate-700 grid grid-cols-12 border-b border-slate-200">
            <span className="col-span-1">Roll</span>
            <span className="col-span-4">Student Name & Admission No</span>
            <span className="col-span-3 text-center">Status Toggle</span>
            <span className="col-span-4">Remarks (if Absent / Late)</span>
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
            {roster.map((student, idx) => {
              const record = records[idx];
              return (
                <div
                  key={student.enrollmentId}
                  className={`px-4 py-2.5 grid grid-cols-12 items-center transition-colors ${
                    record.status === "ABSENT"
                      ? "bg-rose-50/40"
                      : record.status === "LATE"
                        ? "bg-amber-50/30"
                        : "hover:bg-slate-50/60"
                  }`}
                >
                  <span className="col-span-1 font-mono font-bold text-slate-700">
                    #{student.rollNo}
                  </span>

                  <div className="col-span-4">
                    <p className="font-semibold text-slate-900 leading-tight">
                      {student.studentName}
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      {student.admissionNo}
                    </p>
                  </div>

                  <div className="col-span-3 flex justify-center gap-1">
                    {(["PRESENT", "ABSENT", "LATE"] as const).map((status) => {
                      const config = {
                        PRESENT: { icon: CheckCircle2, label: "P", active: "bg-emerald-600 text-white shadow-xs" },
                        ABSENT: { icon: XCircle, label: "A", active: "bg-rose-600 text-white shadow-xs" },
                        LATE: { icon: Clock, label: "L", active: "bg-amber-500 text-white shadow-xs" },
                      }[status];
                      const Icon = config.icon;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateStatus(idx, status)}
                          className={`h-7 px-2.5 rounded-[4px] font-semibold text-xs transition-colors flex items-center gap-1 ${
                            record.status === status
                              ? config.active
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <Icon className="h-3 w-3" /> {config.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="col-span-4">
                    {record.status !== "PRESENT" ? (
                      <input
                        type="text"
                        placeholder="e.g. Fever reported, bus delay..."
                        value={record.remarks || ""}
                        onChange={(e) => updateRemarks(idx, e.target.value)}
                        className="h-7 w-full rounded-[4px] border border-slate-200 px-2 text-xs focus:border-blue-600 focus:outline-none bg-white"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Present in class</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Submission locks the roll-call for {dateStr}.
          </p>

          <Button
            onClick={handleSave}
            disabled={isPending}
            className="px-6"
            size="sm"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {isPending ? "Submitting Ledger..." : "Save Today's Attendance"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
