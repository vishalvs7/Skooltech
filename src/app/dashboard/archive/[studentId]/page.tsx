import { redirect } from "next/navigation";

export default async function ArchiveStudentRootPage({
  params,
}: PageProps<"/dashboard/archive/[studentId]">) {
  const { studentId } = await params;
  redirect(`/dashboard/archive/${studentId}/profile`);
}
