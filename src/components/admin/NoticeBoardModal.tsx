"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar 
} from "lucide-react";
import { createNoticeAction, type NoticeActionResponse } from "@/actions/notice.actions";

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  targetRole: "ALL" | "TEACHER" | "STUDENT";
  date: string;
  author: string;
}

export const INITIAL_DEMO_NOTICES: NoticeItem[] = [
  {
    id: "not-01",
    title: "Welcome to Academic Session 2026-2027",
    content: "All classes have commenced as per regular timetable. School gates close promptly at 08:00 AM.",
    targetRole: "ALL",
    date: "April 1, 2026",
    author: "Principal Dr. S. K. Mahapatra",
  },
  {
    id: "not-02",
    title: "Periodic Test 1 (PT-1) Schedule & Guidelines",
    content: "PT-1 assessments will commence from May 15, 2026. Please check subject syllabus uploaded by Class Teachers.",
    targetRole: "STUDENT",
    date: "May 2, 2026",
    author: "Academic Coordinator",
  },
  {
    id: "not-03",
    title: "Staff Meeting: Term 1 Curriculum Review",
    content: "Mandatory faculty meeting on Friday at 03:30 PM in the Main Conference Hall to review lesson plans and attendance.",
    targetRole: "TEACHER",
    date: "May 8, 2026",
    author: "Vice Principal",
  },
];

export function NoticeBoardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<NoticeActionResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setState(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createNoticeAction(null, formData);
      setState(res);
      if (res.success) {
        setTimeout(() => {
          setIsOpen(false);
          setState(null);
        }, 1800);
      }
    } catch {
      setState({ success: false, error: "Network or server failure while broadcasting notice." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="font-medium flex items-center gap-1.5"
      >
        <Megaphone className="h-4 w-4" />
        <span>Publish Announcement</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg bg-white rounded-[4px] shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-blue-100 flex items-center justify-center text-blue-700">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Publish Notice</h3>
                  <p className="text-xs text-slate-500">School-Wide Broadcast Announcement</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-[4px] p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {state?.error && (
                <div className="p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              {state?.success && (
                <div className="p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{state.message}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Announcement Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  name="title"
                  placeholder="e.g. Annual Sports Day Registrations Open"
                  defaultValue="CBSE Regional Science Exhibition Schedule"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Target Audience <span className="text-rose-500">*</span>
                </label>
                <select
                  name="targetRole"
                  defaultValue="ALL"
                  className="w-full h-10 px-3 text-sm rounded-[4px] border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                >
                  <option value="ALL">All School Community (Teachers, Students & Parents)</option>
                  <option value="TEACHER">Faculty & Staff Only</option>
                  <option value="STUDENT">Students & Parents Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Notice Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="content"
                  rows={4}
                  placeholder="Compose notice announcement body..."
                  defaultValue="All students interested in participating in the upcoming CBSE Regional Science Exhibition must submit their project abstracts to the Science Department by Friday."
                  className="w-full p-2.5 text-xs rounded-[4px] border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-700 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={loading} className="flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  <span>{loading ? "Publishing..." : "Broadcast Notice"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function NoticeFeedList({ notices = INITIAL_DEMO_NOTICES }: { notices?: NoticeItem[] }) {
  return (
    <div className="space-y-3">
      {notices.map((n) => (
        <div
          key={n.id}
          className="p-4 rounded-[4px] border border-slate-200 bg-white hover:border-slate-300 transition text-xs space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
              <div className="flex items-center gap-2 mt-1 text-slate-500 text-[11px]">
                <Calendar className="h-3 w-3 text-slate-400" />
                <span>{n.date}</span>
                <span>•</span>
                <span>By {n.author}</span>
              </div>
            </div>
            <Badge
              variant={n.targetRole === "ALL" ? "default" : n.targetRole === "TEACHER" ? "secondary" : "outline"}
              className="text-[10px]"
            >
              Audience: {n.targetRole}
            </Badge>
          </div>
          <p className="text-slate-700 leading-relaxed">{n.content}</p>
        </div>
      ))}
    </div>
  );
}
