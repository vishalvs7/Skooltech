import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { archiveContext, studentPlacement, STATUS_BADGE } from "@/lib/archive";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { ArchiveSearchForm } from "@/components/archive/ArchiveSearchForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchX, Archive, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface ResultRow {
  id: string;
  admissionNo: string;
  fullName: string;
  status: string;
  placement: string;
  sessions: string[];
}

function single(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) || "";
}

function ResultsTable({ rows, caption }: { rows: ResultRow[]; caption: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h2 className="text-sm font-semibold text-slate-800">{caption}</h2>
        <span className="text-xs text-slate-500">
          {rows.length} student{rows.length !== 1 ? "s" : ""} found
        </span>
      </div>
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-semibold">
                <th className="text-left py-3 px-4">Admission No</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Class / Placement</th>
                <th className="text-left py-3 px-4">Sessions</th>
                <th className="text-center py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-semibold text-blue-700">{r.admissionNo}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{r.fullName}</td>
                  <td className="text-center py-3 px-4">
                    <Badge variant={STATUS_BADGE[r.status] || "outline"} className="text-[10px]">
                      {r.status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {r.placement === "ALUMNI" || r.placement === "WITHDRAWN" ? (
                      <Badge variant="secondary" className="text-[10px]">{r.placement}</Badge>
                    ) : (
                      <span className="text-slate-700">{r.placement}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{r.sessions.join(", ")}</td>
                  <td className="text-center py-3 px-4">
                    <Link
                      href={`/dashboard/archive/${r.id}/profile`}
                      className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline"
                    >
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function ArchiveSearchPage({
  searchParams,
}: PageProps<"/dashboard/archive">) {
  const ctx = await archiveContext();
  if (!ctx.dbReady) return <DatabaseSetupNotice />;
  const { schoolId } = ctx.session;

  const sp = await searchParams;
  const rawMode = single(sp.mode);
  const mode: "student" | "class" = rawMode === "class" ? "class" : "student";
  const q = single(sp.q).trim();
  const clsId = single(sp.cls).trim();
  const sid = single(sp.sid).trim();

  let notFoundQuery: string | null = null;
  let studentResults: ResultRow[] = [];

  if (mode === "student" && q) {
    const exact = await prisma.student.findFirst({
      where: { schoolId, admissionNo: { equals: q, mode: "insensitive" } },
      select: { id: true },
    });
    if (exact) redirect(`/dashboard/archive/${exact.id}/profile`);

    if (q.length >= 2) {
      const matches = await prisma.student.findMany({
        where: {
          schoolId,
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { admissionNo: { contains: q, mode: "insensitive" } },
          ],
        },
        include: {
          enrollments: {
            orderBy: { session: { startDate: "desc" } },
            include: {
              session: true,
              section: { include: { class: true } },
            },
          },
        },
        orderBy: { fullName: "asc" },
        take: 50,
      });

      studentResults = matches.map((s) => ({
        id: s.id,
        admissionNo: s.admissionNo,
        fullName: s.fullName,
        status: s.status,
        placement: studentPlacement(s),
        sessions: s.enrollments.map((e) => e.session.name),
      }));

      if (studentResults.length === 0) notFoundQuery = q;
    } else {
      notFoundQuery = q;
    }
  }

  const [classes, sessions] = await Promise.all([
    prisma.class.findMany({
      where: { schoolId },
      orderBy: { numericOrder: "asc" },
      include: { _count: { select: { sections: true } } },
    }),
    prisma.academicSession.findMany({
      where: { schoolId },
      orderBy: { startDate: "desc" },
    }),
  ]);

  let classResults: ResultRow[] = [];
  let searchedClassName: string | null = null;
  let searchedSessionName: string | null = null;

  if (mode === "class" && clsId) {
    const targetClass = await prisma.class.findFirst({
      where: { id: clsId, schoolId },
      select: { id: true, name: true },
    });

    if (targetClass) {
      searchedClassName = targetClass.name;

      if (sid) {
        const filterSession = sessions.find((s) => s.id === sid);
        searchedSessionName = filterSession ? filterSession.name : null;
      }

      const enrollments = await prisma.enrollment.findMany({
        where: {
          section: { classId: targetClass.id },
          ...(sid ? { sessionId: sid } : {}),
        },
        include: {
          student: true,
          session: true,
          section: { include: { class: true } },
        },
        orderBy: { session: { startDate: "desc" } },
      });

      const byStudent = new Map<string, (typeof enrollments)[number]>();
      const sessionsByStudent = new Map<string, Set<string>>();
      for (const e of enrollments) {
        if (!byStudent.has(e.studentId)) byStudent.set(e.studentId, e);
        if (!sessionsByStudent.has(e.studentId)) sessionsByStudent.set(e.studentId, new Set());
        sessionsByStudent.get(e.studentId)!.add(e.session.name);
      }

      classResults = [...byStudent.values()]
        .map((e) => ({
          id: e.student.id,
          admissionNo: e.student.admissionNo,
          fullName: e.student.fullName,
          status: e.student.status,
          placement: studentPlacement({
            status: e.student.status,
            enrollments: [
              {
                session: { name: e.session.name, isCurrent: e.session.isCurrent },
                section: { name: e.section.name, class: { name: e.section.class.name } },
              },
            ],
          }),
          sessions: [...sessionsByStudent.get(e.studentId)!],
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Archive className="h-3.5 w-3.5" />
          <span>ARCHIVE</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">School Archive Search</h1>
        <p className="text-sm text-slate-600 mt-1">
          Search any student — current, alumni or withdrawn — across the entire history of the school.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-5">
          <ArchiveSearchForm
            classes={classes.map((c) => ({ id: c.id, name: c.name, sectionCount: c._count.sections }))}
            sessions={sessions.map((s) => ({ id: s.id, name: s.name, isCurrent: s.isCurrent }))}
            initialMode={mode}
            initialQ={q}
            initialClassId={clsId}
            initialSessionId={sid}
          />
        </CardContent>
      </Card>

      {mode === "student" && notFoundQuery && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-6 flex items-start gap-3">
            <SearchX className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-amber-900">
                No student matched &ldquo;{notFoundQuery}&rdquo;
              </p>
              <p className="text-xs text-amber-800 mt-1">
                Search by full/partial name or admission number (min 2 characters), or switch to{" "}
                <strong>Class</strong> search to browse every student ever enrolled — including alumni.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "student" && studentResults.length > 0 && (
        <ResultsTable rows={studentResults} caption={`Search results for "${q}"`} />
      )}

      {mode === "class" && clsId && (
        <div>
          {classResults.length === 0 ? (
            <div>
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                {searchedClassName}
                {searchedSessionName ? ` — Session ${searchedSessionName}` : " — Full history"}
              </h2>
              <Card>
                <CardContent className="p-8 text-center text-slate-500 text-sm">
                  No students found for this class
                  {searchedSessionName ? ` in session ${searchedSessionName}` : ""}.
                </CardContent>
              </Card>
            </div>
          ) : (
            <ResultsTable
              rows={classResults}
              caption={`${searchedClassName}${
                searchedSessionName ? ` — Session ${searchedSessionName}` : " — Full history"
              }`}
            />
          )}
        </div>
      )}
    </div>
  );
}
