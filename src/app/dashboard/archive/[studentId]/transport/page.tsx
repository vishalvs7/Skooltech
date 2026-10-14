import { archiveContext, requireArchiveStudent } from "@/lib/archive";
import { DatabaseSetupNotice } from "@/components/shared/DatabaseSetupNotice";
import { TransportForm } from "@/components/archive/TransportForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bus, Phone, MapPin, IndianRupee } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArchiveTransportPage({
  params,
}: PageProps<"/dashboard/archive/[studentId]/transport">) {
  const ctx = await archiveContext();
  if (!ctx.dbReady) return <DatabaseSetupNotice />;

  const { studentId } = await params;
  const student = await requireArchiveStudent(ctx.session.schoolId, studentId);
  const t = student.transport;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-[4px] bg-blue-100 text-blue-700 flex items-center justify-center">
                <Bus className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Current Assignment</h2>
            </div>
            {t && (
              <Badge variant={t.isActive ? "success" : "secondary"}>{t.isActive ? "ACTIVE" : "INACTIVE"}</Badge>
            )}
          </div>

          {!t ? (
            <p className="text-sm text-slate-500 text-center py-6">
              No transport record for this student. If they use school transport, add the details using the form.
            </p>
          ) : (
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5"><Bus className="h-3.5 w-3.5" /> Route</dt>
                <dd className="text-slate-900 font-medium text-right">{t.routeName || "—"}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-xs text-slate-500 uppercase font-semibold">Vehicle</dt>
                <dd className="text-slate-900 font-mono font-medium text-right">{t.vehicleNo || "—"}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Pickup</dt>
                <dd className="text-slate-900 text-right">{t.pickupPoint || "—"}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Drop</dt>
                <dd className="text-slate-900 text-right">{t.dropPoint || "—"}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-xs text-slate-500 uppercase font-semibold">Driver</dt>
                <dd className="text-slate-900 text-right">
                  {t.driverName || "—"}
                  {t.driverPhone && (
                    <span className="flex items-center justify-end gap-1 text-xs text-slate-500 mt-0.5">
                      <Phone className="h-3 w-3" /> {t.driverPhone}
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-100">
                <dt className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5" /> Monthly Fee</dt>
                <dd className="text-slate-900 font-bold text-right">
                  {t.monthlyFee !== null ? `₹${Number(t.monthlyFee).toLocaleString("en-IN")}` : "—"}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
      <TransportForm
        studentId={student.id}
        initial={
          t
            ? {
                routeName: t.routeName,
                vehicleNo: t.vehicleNo,
                pickupPoint: t.pickupPoint,
                dropPoint: t.dropPoint,
                driverName: t.driverName,
                driverPhone: t.driverPhone,
                monthlyFee: t.monthlyFee !== null ? Number(t.monthlyFee) : null,
                isActive: t.isActive,
              }
            : null
        }
      />
    </div>
  );
}
