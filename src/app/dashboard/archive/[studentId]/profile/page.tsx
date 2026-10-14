import { archiveContext, requireArchiveStudent } from "@/lib/archive";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { ProfileEditForm } from "@/components/archive/ProfileEditForm";

export const dynamic = "force-dynamic";

export default async function ArchiveProfilePage({
  params,
}: PageProps<"/dashboard/archive/[studentId]/profile">) {
  const ctx = await archiveContext();
  if (!ctx.dbReady) return <DatabaseSetupNotice />;

  const { studentId } = await params;
  const student = await requireArchiveStudent(ctx.session.schoolId, studentId);

  return (
    <ProfileEditForm
      student={{
        id: student.id,
        admissionNo: student.admissionNo,
        fullName: student.fullName,
        dob: student.dob ? student.dob.toISOString().slice(0, 10) : null,
        gender: student.gender,
        address: student.address,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        parentEmail: student.parentEmail,
      }}
    />
  );
}
