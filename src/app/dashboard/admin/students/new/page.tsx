import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { NewAdmissionForm } from "@/components/admin/NewAdmissionForm";

export default async function AdminNewStudentPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "SCHOOL_ADMIN" && session.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }
  if (!isDatabaseConfigured()) return <DatabaseSetupNotice />;

  const sections = await prisma.section.findMany({
    where: { class: { schoolId: session.schoolId } },
    orderBy: [{ class: { numericOrder: "asc" } }, { name: "asc" }],
    select: { id: true, name: true, class: { select: { name: true } } },
  });

  const options = sections.map((s) => ({
    id: s.id,
    name: s.name,
    className: s.class.name,
    label: `${s.class.name} — ${s.name}`,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Admission</h1>
        <p className="text-sm text-slate-600 mt-1">Create a new student admission record</p>
      </div>
      <NewAdmissionForm sections={options} />
    </div>
  );
}
