"use client";

import { useState, useActionState } from "react";
import { promoteClassStudentsAction, StudentActionResponse } from "@/actions/student.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRightLeft, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Users, 
  CheckSquare, 
  Square
} from "lucide-react";

export function RolloverWizardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
  ]); // 23 of 25 checked by default

  const [state, formAction, isPending] = useActionState<StudentActionResponse | null, FormData>(
    promoteClassStudentsAction,
    null
  );

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const sampleRoster = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    roll: i + 1,
    name: i === 3 ? "Ishaan Gupta (Transfer)" : (i === 11 ? "Avani Joshi (Repeat)" : `Student Roll #${i + 1}`),
    admissionNo: `ADM-${1001 + i}`,
  }));

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <ArrowRightLeft className="h-4 w-4 mr-1.5" /> End-of-Year Rollover Wizard
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Academic Session Rollover & Promotion Wizard
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bulk promote active classes into the new session without data duplication.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {state?.success && (
                <div className="mb-4 p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Class Promotion Completed!</p>
                    <p>{state.message}</p>
                  </div>
                </div>
              )}

              {state?.error && (
                <div className="mb-4 p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{state.error}</span>
                </div>
              )}

              <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-[4px] border border-slate-200 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">From Class / Session</span>
                    <input type="hidden" name="fromClass" value="Class 5-A (2026-2027)" />
                    <span className="font-bold text-slate-900">Class 5-A</span>
                    <span className="text-slate-500 block text-[11px]">Session 2026-2027</span>
                  </div>

                  <div className="text-center flex flex-col items-center justify-center">
                    <ArrowRightLeft className="h-4 w-4 text-blue-700" />
                    <span className="text-[10px] text-slate-400 uppercase mt-0.5 font-semibold">Promote to</span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 block mb-1">Target Class / Session</span>
                    <input type="hidden" name="toClass" value="Class 6-A" />
                    <input type="hidden" name="nextSessionName" value="2027-2028" />
                    <span className="font-bold text-blue-700">Class 6-A</span>
                    <span className="text-slate-500 block text-[11px]">Session 2027-2028</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Student Promotion Roster ({selectedStudents.length} Selected of 25)
                    </span>
                    <span className="text-xs text-slate-500">
                      Uncheck students who transferred or will repeat
                    </span>
                  </div>

                  <div className="max-h-52 overflow-y-auto rounded-[4px] border border-slate-200 divide-y divide-slate-100 text-xs">
                    {sampleRoster.map((s) => {
                      const isChecked = selectedStudents.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => toggleStudent(s.id)}
                          className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                            isChecked ? "bg-white hover:bg-slate-50" : "bg-rose-50/50 hover:bg-rose-50 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isChecked ? (
                              <CheckSquare className="h-4 w-4 text-blue-700 shrink-0" />
                            ) : (
                              <Square className="h-4 w-4 text-slate-300 shrink-0" />
                            )}
                            <span className={isChecked ? "font-semibold text-slate-800" : "line-through text-slate-400"}>
                              #{s.roll} {s.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-slate-500">{s.admissionNo}</span>
                            {isChecked ? (
                              <Badge variant="success" className="text-[10px] py-0">Promote</Badge>
                            ) : (
                              <Badge variant="danger" className="text-[10px] py-0">Alumni</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <input type="hidden" name="promotedCount" value={selectedStudents.length} />
                <input type="hidden" name="leftCount" value={25 - selectedStudents.length} />

                <div className="p-3 bg-blue-50/60 rounded-[4px] border border-blue-200 text-xs text-blue-900">
                  <p className="font-semibold">Rollover Guarantee:</p>
                  <p className="text-[11px] text-blue-800">
                    • Selected students will be enrolled into Class 6-A for Session 2027-2028 under their permanent Admission IDs.<br />
                    • Unselected students ({25 - selectedStudents.length}) will be permanently preserved as <span className="font-bold">ALUMNI</span> with complete historical transcripts intact.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Promoting Students..." : `Promote ${selectedStudents.length} Students to Class 6-A`}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
