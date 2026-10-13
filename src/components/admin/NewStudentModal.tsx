"use client";

import { useState, useActionState } from "react";
import { createStudentDraftAction, StudentActionResponse } from "@/actions/student.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserPlus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  User, 
  Hash, 
  Mail,
  ShieldCheck
} from "lucide-react";

export function NewStudentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<StudentActionResponse | null, FormData>(
    createStudentDraftAction,
    null
  );

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)}>
        <UserPlus className="h-4 w-4 mr-1.5" /> New Student Admission (Step 4A)
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Step 4A: Create Student Identity
                  </h3>
                  <p className="text-xs text-slate-500">
                    Draft initial profile. Class Teacher assigns section next.
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
                    <p className="font-semibold">Admission Draft Created!</p>
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Admission Number *
                    </label>
                    <div className="relative">
                      <Hash className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        name="admissionNo"
                        required
                        defaultValue="ADM-1041"
                        placeholder="e.g. ADM-1041"
                        className="pl-9 font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      defaultValue="Male"
                      className="flex h-9 w-full rounded-[4px] border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-600 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      name="fullName"
                      required
                      placeholder="e.g. Aryan Malhotra"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Parent / Guardian Name
                    </label>
                    <Input
                      name="parentName"
                      placeholder="e.g. Rajesh Malhotra"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Parent Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        name="parentPhone"
                        required
                        defaultValue="+91 "
                        placeholder="+91 9876543210"
                        className="pl-9 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Parent Email (For Brevo receipts)
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      name="parentEmail"
                      type="email"
                      placeholder="parent@example.com"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="rounded-[4px] bg-blue-50/60 border border-blue-200 p-3 text-xs text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">3-Stage Distributed Pipeline:</p>
                    <p className="text-[11px] text-blue-800">
                      Submitting creates login credentials with status <span className="font-mono font-bold">PENDING_ACADEMIC</span>. The assigned Class Teacher assigns the Section & Roll number next.
                    </p>
                  </div>
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
                    {isPending ? "Creating Draft..." : "Create Admission Draft"}
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
