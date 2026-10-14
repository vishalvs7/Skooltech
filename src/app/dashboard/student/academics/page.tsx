import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, Link2, CheckCircle2, Clock } from "lucide-react";

const tabs = [
  { label: "Syllabus", href: "/dashboard/student/academics" },
  { label: "Homework", href: "/dashboard/student/academics/homework" },
  { label: "Study Material", href: "/dashboard/student/academics/materials" },
  { label: "Progress", href: "/dashboard/student/academics/progress" },
];

const subjects = [
  { name: "Mathematics", teacher: "Mr. Rajesh Sharma", chapters: 12, completed: 5, color: "bg-blue-100 text-blue-700" },
  { name: "Science", teacher: "Mrs. Sunita Verma", chapters: 10, completed: 4, color: "bg-emerald-100 text-emerald-700" },
  { name: "English Language & Literature", teacher: "Ms. Priya Sharma", chapters: 14, completed: 6, color: "bg-purple-100 text-purple-700" },
  { name: "Hindi", teacher: "Mrs. Kavita Mishra", chapters: 12, completed: 5, color: "bg-amber-100 text-amber-700" },
  { name: "Social Science", teacher: "Mr. Ashok Verma", chapters: 11, completed: 3, color: "bg-rose-100 text-rose-700" },
];

export default function AcademicsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academics</h1>
        <p className="text-sm text-slate-600 mt-1">Syllabus, homework, study materials, and academic progress.</p>
      </div>
      <TabNavigation tabs={tabs} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((sub) => {
          const pct = Math.round((sub.completed / sub.chapters) * 100);
          return (
            <Card key={sub.name}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-[4px] flex items-center justify-center font-bold text-sm ${sub.color}`}>
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{sub.name}</h3>
                    <p className="text-xs text-slate-500">{sub.teacher}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Syllabus Coverage</span>
                    <span className="font-semibold text-slate-700">{sub.completed}/{sub.chapters} chapters</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-700 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500">{pct}% completed</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Study Materials */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-700" />
            Recent Study Materials
          </CardTitle>
          <CardDescription>Resources uploaded by your teachers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { name: "Chapter 5: Fractions & Decimals — Notes", subject: "Mathematics", type: "PDF", size: "2.4 MB" },
            { name: "Photosynthesis — Animated Explanation", subject: "Science", type: "Video", size: "15 MB" },
            { name: "Tenses Practice Worksheet", subject: "English", type: "PDF", size: "890 KB" },
          ].map((mat, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-[4px] border border-slate-200 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-semibold text-sm text-slate-900">{mat.name}</p>
                  <p className="text-xs text-slate-500">{mat.subject} • {mat.type} • {mat.size}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
