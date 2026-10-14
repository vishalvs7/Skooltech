"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createStudentDraftAction, StudentActionResponse } from "@/actions/student.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, ArrowLeft, Info } from "lucide-react";

interface SectionOption {
  id: string;
  name: string;
  className: string;
  label: string;
}

function fieldLabel(text: string, required = false) {
  return (
    <span className="block text-xs font-medium text-slate-700 mb-1.5">
      {text}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </span>
  );
}

const selectClass =
  "flex h-9 w-full rounded-[4px] border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-600 focus:outline-none";

export function NewAdmissionForm({ sections }: { sections: SectionOption[] }) {
  const [state, formAction, isPending] = useActionState<StudentActionResponse | null, FormData>(
    createStudentDraftAction,
    null
  );
  const [placed, setPlaced] = useState(false);

  return (
    <div>
      <Link
        href="/dashboard/admin/students"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to students
      </Link>

      {state?.success && (
        <div className="mb-6 p-4 rounded-[4px] bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Admission created</p>
            <p>{state.message}</p>
          </div>
        </div>
      )}
      {state?.error && (
        <div className="mb-6 p-4 rounded-[4px] bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student details</CardTitle>
          <CardDescription>
            The admission number is generated automatically. Set a temporary login password for
            the student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {fieldLabel("Full name", true)}
                <Input name="fullName" placeholder="e.g. Aryan Malhotra" required maxLength={100} />
              </div>
              <div>
                {fieldLabel("Gender")}
                <select name="gender" defaultValue="" className={selectClass}>
                  <option value="">Select…</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                {fieldLabel("Date of birth")}
                <Input name="dob" type="date" />
              </div>
              <div>
                {fieldLabel("Address")}
                <Input name="address" placeholder="e.g. 12 MG Road, Bengaluru" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {fieldLabel("Guardian name")}
                <Input name="parentName" placeholder="e.g. Rajesh Malhotra" maxLength={100} />
              </div>
              <div>
                {fieldLabel("Guardian phone", true)}
                <Input name="parentPhone" placeholder="+91 98765 43210" required />
              </div>
              <div>
                {fieldLabel("Guardian email")}
                <Input name="parentEmail" type="email" placeholder="parent@example.com" />
              </div>
              <div>
                {fieldLabel("Temporary password")}
                <Input name="tempPassword" type="password" placeholder="Student@123 (default)" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                <input
                  type="checkbox"
                  checked={placed}
                  onChange={(e) => setPlaced(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                />
                Place into a class now (optional)
              </label>

              {placed && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {fieldLabel("Class & section", true)}
                    <select name="sectionId" required defaultValue="" className={selectClass}>
                      <option value="">Select…</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {fieldLabel("Roll number")}
                    <Input name="rollNo" placeholder="e.g. 12" />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[4px] bg-blue-50/60 border border-blue-200 p-3 text-xs text-blue-900 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Login credentials</p>
                <p className="text-[11px] text-blue-800">
                  The student signs in with username{" "}
                  <span className="font-mono font-bold">their admission number</span> and the
                  temporary password. They must change it on first sign-in. Without a class
                  placement the student stays <span className="font-mono font-bold">PENDING_ACADEMIC</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link href="/dashboard/admin/students">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating…" : "Create admission"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
