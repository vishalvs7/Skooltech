import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palmtree, PartyPopper, Landmark, Heart } from "lucide-react";

const tabs = [
  { label: "Monthly Calendar", href: "/dashboard/student/attendance" },
  { label: "Summary Stats", href: "/dashboard/student/attendance/summary" },
  { label: "Holidays", href: "/dashboard/student/attendance/holidays" },
  { label: "Apply Leave", href: "/dashboard/student/attendance/leave" },
  { label: "Raise Dispute", href: "/dashboard/student/attendance/dispute" },
];

const holidays = [
  { date: "2026-04-14", name: "Ambedkar Jayanti", type: "National" },
  { date: "2026-04-18", name: "Good Friday", type: "Religious" },
  { date: "2026-05-01", name: "May Day / Labour Day", type: "National" },
  { date: "2026-06-25", name: "Eid al-Adha (Bakrid)", type: "Religious" },
  { date: "2026-08-15", name: "Independence Day", type: "National" },
  { date: "2026-09-05", name: "Teachers' Day", type: "Observance" },
  { date: "2026-10-02", name: "Gandhi Jayanti", type: "National" },
  { date: "2026-11-08", name: "Diwali", type: "Festival" },
  { date: "2026-12-25", name: "Christmas", type: "Festival" },
  { date: "2027-01-01", name: "New Year's Day", type: "National" },
  { date: "2027-01-14", name: "Makar Sankranti / Pongal", type: "Festival" },
  { date: "2027-01-26", name: "Republic Day", type: "National" },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "National": return <Landmark className="h-4 w-4 text-blue-600" />;
    case "Festival": return <PartyPopper className="h-4 w-4 text-amber-600" />;
    case "Religious": return <Heart className="h-4 w-4 text-rose-600" />;
    default: return <Palmtree className="h-4 w-4 text-emerald-600" />;
  }
};

export default function HolidaysPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Holidays</h1>
        <p className="text-sm text-slate-600 mt-1">Official school holidays for academic session 2026-2027.</p>
      </div>
      <TabNavigation tabs={tabs} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Holiday Calendar</CardTitle>
          <CardDescription>{holidays.length} holidays declared for this session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {holidays.map((h) => (
              <div key={h.date} className="flex items-center gap-3 p-3 rounded-[4px] border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                <div className="h-10 w-10 rounded-[4px] bg-slate-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">{new Date(h.date).toLocaleDateString("en", { month: "short" })}</span>
                  <span className="text-sm font-bold text-slate-900 leading-none">{new Date(h.date).getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">{h.name}</p>
                  <p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString("en-IN", { weekday: "long" })}</p>
                </div>
                <Badge variant="secondary" className="ml-auto text-[10px] shrink-0">
                  {h.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
