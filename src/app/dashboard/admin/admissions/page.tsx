import { Card, CardContent } from "@/components/ui/card";
export default function AdminAdmissionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admissions</h1>
        <p className="text-sm text-slate-600 mt-1">Review and process admission applications</p>
      </div>
      <Card><CardContent className="p-8 text-center text-slate-500 text-sm">Admissions workflow will be available here.</CardContent></Card>
    </div>
  );
}
