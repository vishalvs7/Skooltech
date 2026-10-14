import { redirect } from "next/navigation";
import { getSession, getRoleDashboardPath } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { RegisterWizard } from "@/components/auth/RegisterWizard";

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const session = await getSession();
  if (session) {
    redirect(getRoleDashboardPath(session.role));
  }

  if (!isDatabaseConfigured()) {
    return <DatabaseSetupNotice />;
  }

  const { plan } = await searchParams;
  const planId = Array.isArray(plan) ? plan[0] : plan;

  return (
    <RegisterWizard
      rootDomain={process.env.ROOT_DOMAIN || "skooltech.com"}
      initialPlan={planId || "pro"}
    />
  );
}
