"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sliders, X, CheckCircle2, Calendar, ShieldCheck } from "lucide-react";

export function FeeStructureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [cycle, setCycle] = useState<"MONTHLY" | "QUARTERLY">("QUARTERLY");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Sliders className="h-4 w-4 mr-1.5" /> Fee Billing Settings
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[4px] border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[4px] bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Fee Structure & Billing Cycle
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure Monthly or Quarterly billing modes and late fee penalty rules.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-[4px]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {saved && (
                <div className="mb-4 p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Fee Structure Settings Saved Successfully!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Fee Structure Template Name
                  </label>
                  <Input
                    defaultValue="Primary Standard Fee (Class 1-5)"
                    required
                    placeholder="e.g. Primary Standard Fee"
                  />
                </div>

                {/* Monthly vs. Quarterly Toggle */}
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Billing Cycle Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCycle("QUARTERLY")}
                      className={`p-3 rounded-[4px] border text-left transition-all ${
                        cycle === "QUARTERLY"
                          ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Badge variant="default" className="text-[10px] py-0 px-1.5 mb-1">Standard CBSE</Badge>
                      <p className="font-bold text-slate-900">Quarterly (4 Terms)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Apr, Jul, Oct, Jan terms</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCycle("MONTHLY")}
                      className={`p-3 rounded-[4px] border text-left transition-all ${
                        cycle === "MONTHLY"
                          ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 mb-1">Budget / State</Badge>
                      <p className="font-bold text-slate-900">Monthly (12 Cycles)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Due on 10th of every month</p>
                    </button>
                  </div>
                </div>

                {/* Amount breakdown */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Tuition Fee (₹)
                    </label>
                    <Input
                      type="number"
                      defaultValue={cycle === "QUARTERLY" ? "12000" : "4000"}
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Development & Lab (₹)
                    </label>
                    <Input
                      type="number"
                      defaultValue={cycle === "QUARTERLY" ? "1500" : "500"}
                      required
                    />
                  </div>
                </div>

                {/* Late Fee Penalty Settings */}
                <div className="p-3 bg-slate-50 rounded-[4px] border border-slate-200 space-y-3">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    Late Payment Rules:
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Grace Days</label>
                      <Input defaultValue="5" className="h-8 text-xs font-mono" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Penalty / Day (₹)</label>
                      <Input defaultValue="25" className="h-8 text-xs font-mono" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Maximum Cap (₹)</label>
                      <Input defaultValue="1000" className="h-8 text-xs font-mono" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Billing Settings
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
