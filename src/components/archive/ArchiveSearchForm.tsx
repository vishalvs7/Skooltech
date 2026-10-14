"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, GraduationCap, UserSearch } from "lucide-react";

interface ClassOption {
  id: string;
  name: string;
  sectionCount: number;
}

interface SessionOption {
  id: string;
  name: string;
  isCurrent: boolean;
}

interface ArchiveSearchFormProps {
  classes: ClassOption[];
  sessions: SessionOption[];
  initialMode: "student" | "class";
  initialQ: string;
  initialClassId: string;
  initialSessionId: string;
}

export function ArchiveSearchForm({
  classes,
  sessions,
  initialMode,
  initialQ,
  initialClassId,
  initialSessionId,
}: ArchiveSearchFormProps) {
  const [mode, setMode] = useState<"student" | "class">(initialMode);

  return (
    <form action="/dashboard/archive" method="get" className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("student")}
          className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-sm font-medium border transition-colors ${
            mode === "student"
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          <UserSearch className="h-4 w-4" /> Student
        </button>
        <button
          type="button"
          onClick={() => setMode("class")}
          className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-sm font-medium border transition-colors ${
            mode === "class"
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Class
        </button>
      </div>

      <input type="hidden" name="mode" value={mode} />

      {mode === "student" ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              name="q"
              defaultValue={initialQ}
              placeholder="Student name or admission number (e.g. Aarav or ADM-1001)"
              className="pl-9"
              autoComplete="off"
            />
          </div>
          <Button type="submit">
            <Search className="h-4 w-4 mr-1.5" /> Search
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            name="cls"
            defaultValue={initialClassId}
            className="flex h-9 w-full sm:w-56 rounded-[4px] border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
          >
            <option value="">Select class…</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.sectionCount} {c.sectionCount === 1 ? "section" : "sections"})
              </option>
            ))}
          </select>
          <select
            name="sid"
            defaultValue={initialSessionId}
            className="flex h-9 w-full sm:w-52 rounded-[4px] border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
          >
            <option value="">All sessions (full history)</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.isCurrent ? " (current)" : ""}
              </option>
            ))}
          </select>
          <Button type="submit">
            <Search className="h-4 w-4 mr-1.5" /> Search Class
          </Button>
        </div>
      )}

      <p className="text-xs text-slate-500">
        {mode === "student"
          ? "Type a full or partial student name, or an admission number — exact admission matches open directly. Works for alumni too."
          : "Class search scans the entire school history, including students who have since passed out (Alumni)."}
      </p>
    </form>
  );
}
