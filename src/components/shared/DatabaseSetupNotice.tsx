import { Card, CardContent } from "@/components/ui/card";
import { Database, AlertTriangle } from "lucide-react";

export function DatabaseSetupNotice() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-lg w-full border-amber-200">
        <CardContent className="p-8 text-center">
          <div className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Database className="h-7 w-7 text-amber-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Database Not Configured</h2>
          <p className="text-sm text-slate-600 mb-6">
            Connect your PostgreSQL database to start using the dashboard.
          </p>
          <div className="text-left bg-slate-50 rounded-[4px] p-4 text-xs font-mono text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900">Setup steps:</p>
            <p>1. Create a <code className="bg-slate-200 px-1 rounded">.env</code> file in the project root</p>
            <p>2. Add your database credentials:</p>
            <pre className="bg-slate-200 p-2 rounded mt-1 overflow-x-auto">{`DATABASE_URL="postgresql://user:pass@host:5432/dbname"
DIRECT_URL="postgresql://user:pass@host:5432/dbname"`}</pre>
            <p>3. Run: <code className="bg-slate-200 px-1 rounded">npx prisma db push</code></p>
            <p>4. Run: <code className="bg-slate-200 px-1 rounded">npx prisma db seed</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
