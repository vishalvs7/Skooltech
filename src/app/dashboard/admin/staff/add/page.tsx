import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { CreateStaffForm } from "@/components/admin/CreateStaffForm";

function single(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] : (v ?? "");
}

export default async function AdminStaffAddPage({
  searchParams,
}: PageProps<"/dashboard/admin/staff/add">) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "SCHOOL_ADMIN" && session.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const sp = await searchParams;
  const rawRole = single(sp.role).toUpperCase();
  const initialRole =
    rawRole === "ACCOUNTS"
      ? ("ACCOUNTS" as const)
      : rawRole === "TEACHER"
        ? ("TEACHER" as const)
        : ("PRINCIPAL" as const);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Staff Account</h1>
        <p className="text-sm text-slate-600 mt-1">Create a login for a Principal, Accounts manager, or Teacher</p>
      </div>
      <CreateStaffForm initialRole={initialRole} />
    </div>
  );
}
