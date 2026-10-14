import { redirect } from "next/navigation";
import { getSession, getRoleDashboardPath } from "@/lib/auth";
import { logoutAction } from "@/actions/auth.actions";
import prisma, { isDatabaseConfigured } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CreditCard, Mail, LogOut } from "lucide-react";

const STATUS_COPY: Record<
  string,
  { title: string; body: string; badgeClass: string }
> = {
  UNPAID: {
    title: "Complete payment to activate your school",
    body: "Your registration is confirmed but your plan is not active yet. Complete the payment to unlock Skooltech for your school.",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  SUSPENDED: {
    title: "Account suspended",
    body: "This school account has been suspended. Please contact billing to restore access.",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  EXPIRED: {
    title: "Subscription expired",
    body: "This school's subscription period has ended. Renew your plan to continue using Skooltech.",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export default async function PaymentPendingPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?from=/payment-pending");
  }

  if (!isDatabaseConfigured()) {
    redirect("/login");
  }

  const school = await prisma.school.findUnique({
    where: { id: session.schoolId },
    select: { name: true, code: true, status: true, plan: true, email: true },
  });

  if (!school) {
    redirect("/login");
  }

  if (school.status === "ACTIVE") {
    redirect(getRoleDashboardPath(session.role));
  }

  const copy = STATUS_COPY[school.status] ?? STATUS_COPY.UNPAID;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 font-sans">
      <Card className="w-full max-w-lg border-slate-200 shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[4px] bg-red-50 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{school.name}</p>
                <p className="text-xs text-slate-500">
                  School Code: {school.code}
                  {school.plan ? ` · Plan: ${school.plan}` : ""}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={copy.badgeClass}>
              {school.status}
            </Badge>
          </div>

          <h1 className="text-xl font-bold text-slate-900 mb-2">{copy.title}</h1>
          <p className="text-sm text-slate-600 mb-6">{copy.body}</p>

          <div className="rounded-[4px] border border-slate-200 bg-slate-50 p-4 mb-6">
            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600">
                <p className="font-semibold text-slate-700 mb-1">Complete payment</p>
                <p>
                  Secure online checkout is being activated for your account. If you
                  need access immediately, contact billing and we will activate your
                  school right away.
                </p>
              </div>
            </div>
            {school.email ? (
              <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Registered email: {school.email}
              </p>
            ) : null}
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Billing support:{" "}
            <a href="mailto:billing@skooltech.com" className="text-blue-600 hover:underline">
              billing@skooltech.com
            </a>
          </p>

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Your school code and username remain reserved.
            </p>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Sign out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
