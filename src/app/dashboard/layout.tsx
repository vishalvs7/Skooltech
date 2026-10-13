import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DashboardHeader } from "@/components/shared/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <DashboardHeader session={session} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
