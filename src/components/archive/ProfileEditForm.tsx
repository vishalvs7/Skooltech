"use client";

import { useActionState } from "react";
import {
  updateStudentProfileAction,
  ArchiveActionResponse,
} from "@/actions/archive.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, CheckCircle2, AlertCircle, Loader2, Lock } from "lucide-react";

interface ProfileEditFormProps {
  student: {
    id: string;
    admissionNo: string;
    fullName: string;
    dob: string | null;
    gender: string | null;
    address: string | null;
    parentName: string | null;
    parentPhone: string | null;
    parentEmail: string | null;
  };
}

function fieldLabel(text: string, required = false) {
  return (
    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
      {text} {required && <span className="text-rose-600">*</span>}
    </label>
  );
}

export function ProfileEditForm({ student }: ProfileEditFormProps) {
  const [state, formAction, isPending] = useActionState<ArchiveActionResponse | null, FormData>(
    updateStudentProfileAction,
    null
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="studentId" value={student.id} />

      {state?.success && (
        <div className="mb-4 p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Saved</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Identity</CardTitle>
            <CardDescription>Core student record — immutable fields are locked.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {fieldLabel("Admission Number")}
              <div className="relative">
                <Input
                  name="admissionNo"
                  defaultValue={student.admissionNo}
                  readOnly
                  className="font-mono bg-slate-50 text-slate-500 pr-9"
                />
                <Lock className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Admission numbers never change — this is the permanent archive key.
              </p>
            </div>
            <div>
              {fieldLabel("Full Name", true)}
              <Input name="fullName" defaultValue={student.fullName} required maxLength={100} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                {fieldLabel("Date of Birth")}
                <Input
                  name="dob"
                  type="date"
                  defaultValue={student.dob || ""}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div>
                {fieldLabel("Gender")}
                <select
                  name="gender"
                  defaultValue={student.gender || ""}
                  className="flex h-9 w-full rounded-[4px] border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
                >
                  <option value="">Not specified</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              {fieldLabel("Address")}
              <textarea
                name="address"
                defaultValue={student.address || ""}
                maxLength={250}
                rows={3}
                placeholder="House no, street, city, state, PIN"
                className="flex w-full rounded-[4px] border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Guardian / Parent</CardTitle>
            <CardDescription>Used for communication and fee reminders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {fieldLabel("Guardian Name")}
              <Input name="parentName" defaultValue={student.parentName || ""} maxLength={100} />
            </div>
            <div>
              {fieldLabel("Guardian Phone", true)}
              <Input
                name="parentPhone"
                defaultValue={student.parentPhone || ""}
                required
                placeholder="+91 98765 43210"
                inputMode="tel"
              />
            </div>
            <div>
              {fieldLabel("Guardian Email")}
              <Input
                name="parentEmail"
                type="email"
                defaultValue={student.parentEmail || ""}
                placeholder="parent@example.com"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1.5" />
          )}
          {isPending ? "Saving…" : "Save Profile"}
        </Button>
        <p className="text-[11px] text-slate-500">Every change is written to the audit trail.</p>
      </div>
    </form>
  );
}
