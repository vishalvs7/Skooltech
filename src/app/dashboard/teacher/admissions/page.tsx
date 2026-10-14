import { Card, CardContent } from "@/components/ui/card";
export default function TeacherAdmissionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admissions Queue</h1>
        <p className="text-sm text-slate-600 mt-1">Review new admission applications</p>
      </div>
      <Card><CardContent className="p-8 text-center text-slate-500 text-sm">Admissions review workflow will be available here.</CardContent></Card>
    </div>
  );
}
