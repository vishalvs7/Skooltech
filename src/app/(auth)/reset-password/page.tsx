"use client";

import { useActionState } from "react";
import { resetPasswordAction, logoutAction, ActionResponse } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, AlertCircle, KeyRound, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    resetPasswordAction,
    null
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="h-12 w-12 rounded-[4px] bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-sm border border-amber-200">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Set Your Permanent Password
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Your account was provisioned with temporary credentials. For security, please choose a permanent password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">First-Time Password Reset</CardTitle>
            <CardDescription>
              Create a secure password with at least 8 characters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state?.error && (
              <div className="mb-4 p-3 rounded-[4px] bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-sm text-rose-700">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <Input
                    name="newPassword"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <Input
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Re-type new password"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="rounded-[4px] bg-blue-50/60 border border-blue-200 p-3 text-xs text-blue-900 space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-700" />
                  Password Policy:
                </p>
                <p>• Once updated, this will be your permanent login password.</p>
                <p>• You will be redirected straight to your role dashboard.</p>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-2"
                size="lg"
              >
                {isPending ? "Updating Password..." : "Save & Access Dashboard"}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel & Sign Out
                </button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
