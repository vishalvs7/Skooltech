"use client";

import { useActionState } from "react";
import { saveTransportDetailAction, ArchiveActionResponse } from "@/actions/archive.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface TransportFormProps {
  studentId: string;
  initial: {
    routeName: string | null;
    vehicleNo: string | null;
    pickupPoint: string | null;
    dropPoint: string | null;
    driverName: string | null;
    driverPhone: string | null;
    monthlyFee: number | null;
    isActive: boolean;
  } | null;
}

function fieldLabel(text: string) {
  return (
    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
      {text}
    </label>
  );
}

export function TransportForm({ studentId, initial }: TransportFormProps) {
  const [state, formAction, isPending] = useActionState<ArchiveActionResponse | null, FormData>(
    saveTransportDetailAction,
    null
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="studentId" value={studentId} />

      {state?.success && (
        <div className="mb-4 p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Saved</p>
            <p>{state.message}</p>
          </div>
        </div>
      )}
      {state?.error && (
        <div className="mb-4 p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{initial ? "Edit Transport Details" : "Add Transport Details"}</CardTitle>
          <CardDescription>
            School bus / van assignment for this student. Leave blank for fields that do not apply.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel("Route Name")}
              <Input name="routeName" defaultValue={initial?.routeName || ""} placeholder="e.g. Route A - North Gate" maxLength={80} />
            </div>
            <div>
              {fieldLabel("Vehicle Number")}
              <Input name="vehicleNo" defaultValue={initial?.vehicleNo || ""} placeholder="e.g. DL 1PC 4521" maxLength={20} className="font-mono uppercase" />
            </div>
            <div>
              {fieldLabel("Pickup Point")}
              <Input name="pickupPoint" defaultValue={initial?.pickupPoint || ""} placeholder="e.g. Sector 62 Metro" maxLength={100} />
            </div>
            <div>
              {fieldLabel("Drop Point")}
              <Input name="dropPoint" defaultValue={initial?.dropPoint || ""} placeholder="e.g. School Main Gate" maxLength={100} />
            </div>
            <div>
              {fieldLabel("Driver Name")}
              <Input name="driverName" defaultValue={initial?.driverName || ""} maxLength={80} />
            </div>
            <div>
              {fieldLabel("Driver Phone")}
              <Input name="driverPhone" defaultValue={initial?.driverPhone || ""} placeholder="+91 98765 43210" inputMode="tel" />
            </div>
            <div>
              {fieldLabel("Monthly Transport Fee (₹)")}
              <Input
                name="monthlyFee"
                type="number"
                min={0}
                step="0.01"
                defaultValue={initial?.monthlyFee ?? ""}
                placeholder="e.g. 1500"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={initial ? initial.isActive : true}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                Transport currently active
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              {isPending ? "Saving…" : initial ? "Update Transport" : "Save Transport"}
            </Button>
            <p className="text-[11px] text-slate-500">Changes are written to the audit trail.</p>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
