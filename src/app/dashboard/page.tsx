import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getRoleDashboardPath } from "@/lib/auth";

export default async function DashboardRootPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  redirect(getRoleDashboardPath(session.role));
}
