import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AccountsGatewayPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Gateway</h1>
        <p className="text-sm text-slate-600 mt-1">Razorpay integration status and configuration</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-slate-900">Razorpay Gateway</p>
              <p className="text-xs text-slate-500 mt-1">Online payment collection via Razorpay</p>
            </div>
            <Badge variant="warning">NOT CONFIGURED</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-4">Razorpay API keys will be configured in Settings once available.</p>
        </CardContent>
      </Card>
    </div>
  );
}
