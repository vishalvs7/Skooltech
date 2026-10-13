"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction, ActionResponse } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { School, Lock, User, ArrowLeft, AlertCircle, KeyRound, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    loginAction,
    null
  );

  const [schoolCode, setSchoolCode] = useState("DEMO01");
  const [username, setUsername] = useState("admin_demo");
  const [password, setPassword] = useState("DemoPass@123");

  const fillCredentials = (code: string, user: string, pass: string) => {
    setSchoolCode(code);
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="h-9 w-9 rounded-[4px] bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            Skool<span className="text-blue-700">tech</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Your School Portal
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter your school code and assigned credentials to proceed.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Unified Portal Access</CardTitle>
            <CardDescription>
              School Admin, Principal, Accounts, Teachers & Students.
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
                  School Code
                </label>
                <div className="relative">
                  <School className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <Input
                    name="schoolCode"
                    type="text"
                    required
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DEMO01"
                    className="pl-9 font-mono uppercase"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Assigned by school administration (Option B).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Username / Admission No
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <Input
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin_demo or ADM-1001"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <Input
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-2"
                size="lg"
              >
                {isPending ? "Authenticating..." : "Sign In to Portal"}
              </Button>
            </form>

            {/* Demo Sandbox Quick-Fill Pills */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-blue-700" />
                  Quick Demo Accounts
                </span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                  DEMO01
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillCredentials("DEMO01", "admin_demo", "DemoPass@123")}
                  className="p-2 text-left rounded-[4px] border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                >
                  <p className="font-semibold text-slate-800">School Admin</p>
                  <p className="text-[11px] text-slate-500">admin_demo</p>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("DEMO01", "principal_demo", "DemoPass@123")}
                  className="p-2 text-left rounded-[4px] border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                >
                  <p className="font-semibold text-slate-800">Principal</p>
                  <p className="text-[11px] text-slate-500">principal_demo</p>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("DEMO01", "accounts_demo", "DemoPass@123")}
                  className="p-2 text-left rounded-[4px] border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                >
                  <p className="font-semibold text-slate-800">Accounts Desk</p>
                  <p className="text-[11px] text-slate-500">accounts_demo</p>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("DEMO01", "teacher_sharma", "DemoPass@123")}
                  className="p-2 text-left rounded-[4px] border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                >
                  <p className="font-semibold text-slate-800">Class Teacher</p>
                  <p className="text-[11px] text-slate-500">teacher_sharma</p>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("DEMO01", "ADM-1001", "Student@123")}
                  className="p-2 text-left rounded-[4px] border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                >
                  <p className="font-semibold text-slate-800">Student</p>
                  <p className="text-[11px] text-slate-500">ADM-1001</p>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("DEMO01", "new_student_demo", "Student@123")}
                  className="p-2 text-left rounded-[4px] border border-amber-300 bg-amber-50/40 hover:bg-amber-50 transition-colors"
                >
                  <p className="font-semibold text-amber-900 flex items-center gap-1">
                    <KeyRound className="h-3 w-3 text-amber-700" />
                    Reset Flow
                  </p>
                  <p className="text-[11px] text-amber-700">Test Password Reset</p>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
