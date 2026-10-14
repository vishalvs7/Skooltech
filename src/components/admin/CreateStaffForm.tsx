"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createUserAction, StaffActionResponse } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

type StaffRole = "PRINCIPAL" | "ACCOUNTS" | "TEACHER";

const ROLE_LABELS: Record<StaffRole, string> = {
  PRINCIPAL: "Principal",
  ACCOUNTS: "Accounts",
  TEACHER: "Teacher",
};

function fieldLabel(text: string) {
  return (
    <span className="block text-xs font-medium text-slate-700 mb-1.5">{text}</span>
  );
}

export function CreateStaffForm({ initialRole = "PRINCIPAL" }: { initialRole?: StaffRole }) {
  const [role, setRole] = useState<StaffRole>(initialRole);
  const [state, formAction, isPending] = useActionState<StaffActionResponse | null, FormData>(
    createUserAction,
    null
  );

  return (
    <div>
      <Link
        href="/dashboard/admin/staff"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to staff
      </Link>

      {state?.success && state.data && (
        <div className="mb-6 p-4 rounded-[4px] bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Account created</p>
            <p>
              {ROLE_LABELS[state.data.role as StaffRole] || state.data.role}{" "}
              <span className="font-mono">{state.data.username}</span> is ready. They will be
              asked to set a new password on first sign-in.
            </p>
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
          <CardTitle className="text-base">Create staff account</CardTitle>
          <CardDescription>
            Onboard a Principal, Accounts manager, or Teacher for your school. They sign in with
            the username and temporary password you set here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            <div>
              {fieldLabel("Role")}
              <input type="hidden" name="role" value={role} />
              <div className="inline-flex rounded-[4px] border border-slate-200 overflow-hidden">
                {(Object.keys(ROLE_LABELS) as StaffRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={
                      "px-5 py-2 text-sm font-medium transition-colors " +
                      (role === r
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-50")
                    }
                    aria-pressed={role === r}
                  >
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {fieldLabel("Full name")}
                <Input name="fullName" placeholder="e.g. Anil Verma" required />
              </div>
              <div>
                {fieldLabel("Username")}
                <Input name="username" placeholder="e.g. principal.verma" required />
              </div>
              <div>
                {fieldLabel("Email (optional)")}
                <Input name="email" type="email" placeholder="name@school.edu" />
              </div>
              <div>
                {fieldLabel("Phone (optional)")}
                <Input name="phone" placeholder="+91 98765 43210" />
              </div>
              <div>
                {fieldLabel("Temporary password")}
                <Input name="password" type="password" placeholder="Min 8 characters" required />
              </div>
              <div>
                {fieldLabel("Confirm password")}
                <Input name="confirm" type="password" placeholder="Re-enter password" required />
              </div>
            </div>

            {role === "TEACHER" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
                <div>
                  {fieldLabel("Employee ID (optional)")}
                  <Input name="employeeId" placeholder="e.g. EMP-2041" />
                </div>
                <div>
                  {fieldLabel("Designation (optional)")}
                  <Input name="designation" placeholder="e.g. Senior PGT Mathematics" />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link href="/dashboard/admin/staff">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating…" : `Create ${ROLE_LABELS[role]} account`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
