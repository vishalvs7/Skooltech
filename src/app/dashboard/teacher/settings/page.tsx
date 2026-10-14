import { TabNavigation } from "@/components/shared/TabNavigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600 mt-1">Profile, notifications, and marking scheme preferences.</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <Construction className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h2 className="font-bold text-lg text-slate-900 mb-1">Under Construction</h2>
          <p className="text-sm text-slate-500 mb-4">This section is being developed as part of the dashboard enrichment.</p>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 mx-auto">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
