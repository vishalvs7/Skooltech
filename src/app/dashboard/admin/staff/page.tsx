import { getSession, UserRoleType } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

type StaffTab = "all" | "teacher" | "accounts" | "principal";

const TABS: { key: StaffTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "teacher", label: "Teachers" },
  { key: "accounts", label: "Accounts" },
  { key: "principal", label: "Principals" },
];

const ROLE_FOR_TAB: Record<Exclude<StaffTab, "all">, UserRoleType> = {
  teacher: "TEACHER",
  accounts: "ACCOUNTS",
  principal: "PRINCIPAL",
};

function single(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] : (v ?? "");
}

export default async function AdminStaffPage({
  searchParams,
}: PageProps<"/dashboard/admin/staff">) {
  const session = await getSession();
  if (!session) return null;
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const sp = await searchParams;
  const rawTab = single(sp.tab).toLowerCase();
  const tab: StaffTab = TABS.some((t) => t.key === rawTab) ? (rawTab as StaffTab) : "all";

  const roleFilter =
    tab === "all"
      ? { in: ["TEACHER", "ACCOUNTS", "PRINCIPAL"] as UserRoleType[] }
      : ROLE_FOR_TAB[tab as Exclude<StaffTab, "all">];

  const users = await prisma.user.findMany({
    where: {
      schoolId: session.schoolId,
      role: roleFilter,
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      mustChangePassword: true,
      teacherProfile: { select: { fullName: true, designation: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Management</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage teaching staff and administrative logins
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/staff/add?role=principal">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" /> Add Principal
            </Button>
          </Link>
          <Link href="/dashboard/admin/staff/add?role=accounts">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" /> Add Accounts
            </Button>
          </Link>
          <Link href="/dashboard/admin/staff/add?role=teacher">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Add Teacher
            </Button>
          </Link>
        </div>
      </div>

      <div className="border-b border-slate-200 mb-4 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <nav className="flex gap-1 min-w-max" aria-label="Staff role tabs">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Link
                key={t.key}
                href={t.key === "all" ? "/dashboard/admin/staff" : `/dashboard/admin/staff?tab=${t.key}`}
                className={
                  "px-4 py-2.5 text-sm font-medium rounded-t-[4px] border-b-2 transition-colors whitespace-nowrap " +
                  (active
                    ? "border-blue-700 text-blue-700 bg-blue-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60")
                }
                aria-current={active ? "page" : undefined}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-500 text-sm">
            No staff accounts found in this category.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Username</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Designation</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const name = u.teacherProfile?.fullName || u.fullName || "—";
                  const designation =
                    u.role === "TEACHER" ? u.teacherProfile?.designation || "—" : "—";
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-800">{name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{u.username}</td>
                      <td className="py-3 px-4 text-slate-600">{u.email || "—"}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px]">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{designation}</td>
                      <td className="py-3 px-4">
                        {!u.isActive ? (
                          <Badge variant="outline" className="text-[10px] text-slate-400">
                            Disabled
                          </Badge>
                        ) : u.mustChangePassword ? (
                          <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-200 bg-amber-50">
                            Must change password
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">
                            Active
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
