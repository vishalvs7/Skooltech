"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarCheck, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayStatus = "PRESENT" | "ABSENT" | "LATE" | "HOLIDAY" | "WEEKEND" | "FUTURE" | "EXCUSED";

function getStatusForDay(year: number, month: number, day: number): DayStatus {
  const date = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) return "FUTURE";
  const dow = date.getDay();
  if (dow === 0) return "HOLIDAY";

  // Holidays in 2026
  const holidayDates = [
    "2026-04-14", "2026-04-18", "2026-05-01", "2026-06-25",
    "2026-08-15", "2026-09-05", "2026-10-02", "2026-11-08",
  ];
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (holidayDates.includes(dateStr)) return "HOLIDAY";

  if (month === 3 && day >= 2) { // April 2026
    if (day === 4) return "ABSENT";
    if (day === 8) return "LATE";
    return "PRESENT";
  }
  if (month > 3) return "PRESENT";

  return "WEEKEND";
}

const STATUS_CONFIG: Record<DayStatus, { color: string; bg: string; label: string }> = {
  PRESENT: { color: "text-emerald-700", bg: "bg-emerald-100", label: "P" },
  ABSENT: { color: "text-rose-700", bg: "bg-rose-100", label: "A" },
  LATE: { color: "text-amber-700", bg: "bg-amber-100", label: "L" },
  EXCUSED: { color: "text-blue-700", bg: "bg-blue-100", label: "E" },
  HOLIDAY: { color: "text-slate-500", bg: "bg-slate-100", label: "H" },
  WEEKEND: { color: "text-slate-400", bg: "bg-slate-50", label: "" },
  FUTURE: { color: "text-slate-300", bg: "bg-white", label: "" },
};

export function StudentAttendanceView() {
  const [currentMonth, setCurrentMonth] = useState(3); // April 2026
  const [currentYear] = useState(2026);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  let present = 0, absent = 0, late = 0, holidays = 0;
  const grid = days.map((day) => {
    if (!day) return null;
    const status = getStatusForDay(currentYear, currentMonth, day);
    if (status === "PRESENT") present++;
    else if (status === "ABSENT") absent++;
    else if (status === "LATE") late++;
    else if (status === "HOLIDAY") holidays++;
    return { day, status };
  });

  const totalWorking = present + absent + late;
  const attendancePct = totalWorking > 0 ? Math.round((present / totalWorking) * 100) : 0;

  const prevMonth = () => setCurrentMonth((m) => Math.max(0, m - 1));
  const nextMonth = () => setCurrentMonth((m) => Math.min(11, m + 1));

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[4px] bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Present</p>
                <p className="font-bold text-lg text-emerald-700">{present} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[4px] bg-rose-100 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-rose-700" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Absent</p>
                <p className="font-bold text-lg text-rose-700">{absent} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[4px] bg-amber-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-700" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Late</p>
                <p className="font-bold text-lg text-amber-700">{late} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[4px] bg-blue-100 flex items-center justify-center">
                <CalendarCheck className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Attendance</p>
                <p className="font-bold text-lg text-blue-700">{attendancePct}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {MONTHS[currentMonth]} {currentYear}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevMonth} disabled={currentMonth === 0} aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth} disabled={currentMonth === 11} aria-label="Next month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-slate-500 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((cell, idx) => {
              if (!cell) return <div key={`empty-${idx}`} />;
              const cfg = STATUS_CONFIG[cell.status];
              return (
                <div
                  key={cell.day}
                  className={cn(
                    "aspect-square rounded-[4px] flex flex-col items-center justify-center text-xs font-medium transition-colors",
                    cfg.bg,
                    cfg.color,
                    cell.status === "FUTURE" && "opacity-40"
                  )}
                  title={`${cell.day} ${MONTHS[currentMonth]} — ${cell.status}`}
                >
                  <span className="font-bold">{cell.day}</span>
                  {cfg.label && <span className="text-[9px] font-bold">{cfg.label}</span>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-emerald-100" /> Present</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-rose-100" /> Absent</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-amber-100" /> Late</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[3px] bg-slate-100" /> Holiday</span>
          </div>
        </CardContent>
      </Card>

      {/* Dispute hint */}
      <Card className="border-amber-200 bg-amber-50/40">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Marked incorrectly?</p>
            <p className="text-xs text-amber-800 mt-0.5">
              If you were present but marked absent, raise a dispute from the{" "}
              <a href="/dashboard/student/attendance/dispute" className="underline font-medium">Raise Dispute</a> tab.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
