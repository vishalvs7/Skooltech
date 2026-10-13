"use client";

import { useState, useTransition } from "react";
import { saveDailyAttendanceAction, AttendanceRecordInput, AttendanceActionResponse } from "@/actions/attendance.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  Save, 
  UserCheck
} from "lucide-react";

// Initial seed roster of 25 students for Class 5-A
const INITIAL_ROSTER: AttendanceRecordInput[] = [
  { enrollmentId: "enr-1", rollNo: "1", studentName: "Aarav Sharma", admissionNo: "ADM-1001", status: "PRESENT" },
  { enrollmentId: "enr-2", rollNo: "2", studentName: "Ananya Iyer", admissionNo: "ADM-1002", status: "PRESENT" },
  { enrollmentId: "enr-3", rollNo: "3", studentName: "Vihaan Patel", admissionNo: "ADM-1003", status: "PRESENT" },
  { enrollmentId: "enr-4", rollNo: "4", studentName: "Ishaan Gupta", admissionNo: "ADM-1004", status: "ABSENT", remarks: "Fever reported by parent" },
  { enrollmentId: "enr-5", rollNo: "5", studentName: "Saanvi Reddy", admissionNo: "ADM-1005", status: "PRESENT" },
  { enrollmentId: "enr-6", rollNo: "6", studentName: "Diya Mehta", admissionNo: "ADM-1006", status: "PRESENT" },
  { enrollmentId: "enr-7", rollNo: "7", studentName: "Aditya Choudhury", admissionNo: "ADM-1007", status: "PRESENT" },
  { enrollmentId: "enr-8", rollNo: "8", studentName: "Riya Kapoor", admissionNo: "ADM-1008", status: "ABSENT", remarks: "Doctor appointment" },
  { enrollmentId: "enr-9", rollNo: "9", studentName: "Arjun Nair", admissionNo: "ADM-1009", status: "PRESENT" },
  { enrollmentId: "enr-10", rollNo: "10", studentName: "Myra Bose", admissionNo: "ADM-1010", status: "PRESENT" },
  { enrollmentId: "enr-11", rollNo: "11", studentName: "Kabir Malhotra", admissionNo: "ADM-1011", status: "PRESENT" },
  { enrollmentId: "enr-12", rollNo: "12", studentName: "Avani Joshi", admissionNo: "ADM-1012", status: "PRESENT" },
  { enrollmentId: "enr-13", rollNo: "13", studentName: "Reyansh Singhania", admissionNo: "ADM-1013", status: "LATE", remarks: "School bus delayed" },
  { enrollmentId: "enr-14", rollNo: "14", studentName: "Anika Deshmukh", admissionNo: "ADM-1014", status: "PRESENT" },
  { enrollmentId: "enr-15", rollNo: "15", studentName: "Dhruv Rao", admissionNo: "ADM-1015", status: "PRESENT" },
  { enrollmentId: "enr-16", rollNo: "16", studentName: "Kiara Chatterjee", admissionNo: "ADM-1016", status: "PRESENT" },
  { enrollmentId: "enr-17", rollNo: "17", studentName: "Vivaan Saxena", admissionNo: "ADM-1017", status: "PRESENT" },
  { enrollmentId: "enr-18", rollNo: "18", studentName: "Ira Bhardwaj", admissionNo: "ADM-1018", status: "PRESENT" },
  { enrollmentId: "enr-19", rollNo: "19", studentName: "Atharv Kulkarni", admissionNo: "ADM-1019", status: "PRESENT" },
  { enrollmentId: "enr-20", rollNo: "20", studentName: "Prisha Aggarwal", admissionNo: "ADM-1020", status: "PRESENT" },
  { enrollmentId: "enr-21", rollNo: "21", studentName: "Advait Trivedi", admissionNo: "ADM-1021", status: "PRESENT" },
  { enrollmentId: "enr-22", rollNo: "22", studentName: "Navya Sengupta", admissionNo: "ADM-1022", status: "PRESENT" },
  { enrollmentId: "enr-23", rollNo: "23", studentName: "Samar Chauhan", admissionNo: "ADM-1023", status: "PRESENT" },
  { enrollmentId: "enr-24", rollNo: "24", studentName: "Tara Menon", admissionNo: "ADM-1024", status: "PRESENT" },
  { enrollmentId: "enr-25", rollNo: "25", studentName: "Shaurya Verma", admissionNo: "ADM-1025", status: "PRESENT" },
];

export function AttendanceRollCall() {
  const [dateStr, setDateStr] = useState("2026-10-13");
  const [records, setRecords] = useState<AttendanceRecordInput[]>(INITIAL_ROSTER);
  const [response, setResponse] = useState<AttendanceActionResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  const markAllPresent = () => {
    setRecords((prev) =>
      prev.map((student) => ({
        ...student,
        status: "PRESENT",
        remarks: undefined,
      }))
    );
  };

  const updateStatus = (index: number, status: "PRESENT" | "ABSENT" | "LATE") => {
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
      updated[index] = {
        ...updated[index],
        remarks,
      };
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

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" className="text-xs uppercase">Daily Morning Roll-Call</Badge>
              <span className="text-xs text-slate-500 font-mono">Class 5 - Section A</span>
            </div>
            <CardTitle className="text-lg">Class 5-A Attendance Ledger</CardTitle>
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

        {/* Live Stat Bar */}
        <div className="mt-4 grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-[4px] border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-800">Present: {presentCount}</span>
            <span className="text-slate-500">({Math.round((presentCount / records.length) * 100)}%)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="font-semibold text-slate-800">Absent: {absentCount}</span>
            <span className="text-slate-500">(Brevo alert queued)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="font-semibold text-slate-800">Late: {lateCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {response?.success && (
          <div className="mb-4 p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Attendance Saved Successfully!</p>
              <p>{response.message}</p>
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
            {records.map((student, idx) => (
              <div
                key={student.enrollmentId}
                className={`px-4 py-2.5 grid grid-cols-12 items-center transition-colors ${
                  student.status === "ABSENT" ? "bg-rose-50/40" : (student.status === "LATE" ? "bg-amber-50/30" : "hover:bg-slate-50/60")
                }`}
              >
                {/* Roll No */}
                <span className="col-span-1 font-mono font-bold text-slate-700">
                  #{student.rollNo}
                </span>

                {/* Name & Admission */}
                <div className="col-span-4">
                  <p className="font-semibold text-slate-900 leading-tight">
                    {student.studentName}
                  </p>
                  <p className="font-mono text-[11px] text-slate-500">
                    {student.admissionNo}
                  </p>
                </div>

                {/* 3-State Quick Toggles */}
                <div className="col-span-3 flex justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateStatus(idx, "PRESENT")}
                    className={`h-7 px-2.5 rounded-[4px] font-semibold text-xs transition-colors flex items-center gap-1 ${
                      student.status === "PRESENT"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" /> P
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(idx, "ABSENT")}
                    className={`h-7 px-2.5 rounded-[4px] font-semibold text-xs transition-colors flex items-center gap-1 ${
                      student.status === "ABSENT"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <XCircle className="h-3 w-3" /> A
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus(idx, "LATE")}
                    className={`h-7 px-2.5 rounded-[4px] font-semibold text-xs transition-colors flex items-center gap-1 ${
                      student.status === "LATE"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Clock className="h-3 w-3" /> L
                  </button>
                </div>

                {/* Remarks Field */}
                <div className="col-span-4">
                  {student.status !== "PRESENT" ? (
                    <input
                      type="text"
                      placeholder="e.g. Fever reported, bus delay..."
                      value={student.remarks || ""}
                      onChange={(e) => updateRemarks(idx, e.target.value)}
                      className="h-7 w-full rounded-[4px] border border-slate-200 px-2 text-xs focus:border-blue-600 focus:outline-none bg-white"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Present in class</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Submission locks the roll-call for {dateStr}. Discrepancies are synced with gate biometrics.
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
