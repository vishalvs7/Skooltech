import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma, { isDatabaseConfigured } from "@/lib/prisma";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (isDatabaseConfigured() && session.role !== "SUPER_ADMIN") {
    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: { status: true },
    });

    if (school && school.status !== "ACTIVE") {
      redirect("/payment-pending");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <DashboardHeader session={session} />
      <div className="flex flex-1">
        <DashboardSidebar role={session.role} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
