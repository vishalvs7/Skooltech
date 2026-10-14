"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  checkUsernameAvailabilityAction,
  registerSchoolIdentityAction,
  registerAdminAccountAction,
  createSubscriptionOrderAction,
  verifySubscriptionPaymentAction,
  startOverRegistrationAction,
  RegistrationActionResponse,
} from "@/actions/registration.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  School,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  UserCog,
  CreditCard,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
} from "lucide-react";

function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STEPS = [
  { num: 1, label: "School Identity" },
  { num: 2, label: "Admin Account" },
  { num: 3, label: "Payment" },
  { num: 4, label: "Done" },
];

const PLAN_OPTIONS = [
  { id: "starter", name: "Standard Starter", amountInr: 24000 },
  { id: "pro", name: "Campus Growth Pro", amountInr: 54000 },
];

type AvailabilityState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "available" }
  | { kind: "unavailable"; reason: string };

interface OrderInfo {
  mode: "RAZORPAY" | "MOCK";
  orderId: string;
  amountInr: number;
  keyId: string | null;
  planId: string;
  planName: string;
}

export function RegisterWizard({
  rootDomain,
  initialPlan = "pro",
}: {
  rootDomain: string;
  initialPlan?: string;
}) {
  const [schoolName, setSchoolName] = useState("");
  const [username, setUsername] = useState("");
  const [checkResult, setCheckResult] = useState<{
    slug: string;
    available: boolean;
    reason?: string;
  } | null>(null);
  const [reset, setReset] = useState(false);
  const checkSeq = useRef(0);

  const [identityState, identityAction, identityPending] = useActionState<
    RegistrationActionResponse | null,
    FormData
  >(registerSchoolIdentityAction, null);

  const [adminState, setAdminState] = useState<RegistrationActionResponse | null>(null);
  const [adminPending, setAdminPending] = useState(false);

  const [planId, setPlanId] = useState(
    PLAN_OPTIONS.some((p) => p.id === initialPlan) ? initialPlan : "pro"
  );
  const [orderPending, setOrderPending] = useState(false);
  const [payPending, setPayPending] = useState(false);
  const [payState, setPayState] = useState<RegistrationActionResponse | null>(null);

  const [flowStep, setFlowStep] = useState(2);
  const [activated, setActivated] = useState<RegistrationActionResponse["activated"] | null>(null);

  const slug = normalizeSlug(username);
  const subdomain = slug ? `${slug}.${rootDomain}` : null;

  useEffect(() => {
    if (slug.length < 3) return;
    const seq = ++checkSeq.current;
    const timer = setTimeout(async () => {
      const result = await checkUsernameAvailabilityAction(slug);
      if (seq !== checkSeq.current) return;
      setCheckResult({ slug, available: !!result.available, reason: result.reason });
    }, 400);
    return () => clearTimeout(timer);
  }, [slug]);

  let availability: AvailabilityState;
  if (slug.length < 3) {
    availability = { kind: "idle" };
  } else if (checkResult && checkResult.slug === slug) {
    availability = checkResult.available
      ? { kind: "available" }
      : { kind: "unavailable", reason: checkResult.reason || "Not available." };
  } else {
    availability = { kind: "checking" };
  }

  const reserved = identityState?.success && identityState.data && !reset ? identityState.data : null;
  const step = !reserved ? 1 : flowStep;

  const handleStartOver = async () => {
    await startOverRegistrationAction();
    setReset(true);
    setSchoolName("");
    setUsername("");
    setAdminState(null);
    setPayState(null);
    setActivated(null);
    setFlowStep(2);
  };

  const handleAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdminPending(true);
    setAdminState(null);
    const fd = new FormData(e.currentTarget);
    const res = await registerAdminAccountAction(null, fd);
    setAdminState(res);
    setAdminPending(false);
    if (res.success) setFlowStep(3);
  };

  const handlePay = async () => {
    if (!reserved) return;
    setOrderPending(true);
    setPayState(null);
    const fd = new FormData();
    fd.set("planId", planId);
    const orderRes = await createSubscriptionOrderAction(null, fd);
    setOrderPending(false);
    if (!orderRes.success || !orderRes.order) {
      setPayState(orderRes);
      return;
    }
    const o = orderRes.order;

    if (o.mode === "MOCK") {
      await completeMockPayment(o);
    } else {
      openRazorpayCheckout(o);
    }
  };

  const completeMockPayment = async (o: OrderInfo) => {
    setPayPending(true);
    const fd = new FormData();
    fd.set("orderId", o.orderId);
    fd.set("paymentId", `pay_mock_${Date.now()}`);
    fd.set("mode", "MOCK");
    const res = await verifySubscriptionPaymentAction(null, fd);
    setPayPending(false);
    if (res.success && res.activated) {
      setActivated(res.activated);
      setFlowStep(4);
    } else {
      setPayState(res);
    }
  };

  const openRazorpayCheckout = (o: OrderInfo) => {
    if (!o.keyId) {
      setPayState({ success: false, error: "Payment key not configured." });
      return;
    }
    setPayPending(true);
    const scriptId = "rzp-checkout-script";
    const loadScript = () =>
      new Promise<boolean>((resolve) => {
        if (document.getElementById(scriptId)) return resolve(true);
        const s = document.createElement("script");
        s.id = scriptId;
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
      });

    loadScript().then((ok) => {
      if (!ok) {
        setPayPending(false);
        setPayState({ success: false, error: "Could not load payment gateway." });
        return;
      }
      const rzp = new (window as unknown as { Razorpay: new (o: unknown) => {
        open: () => void;
        on: (e: string, cb: (r: unknown) => void) => void;
      } }).Razorpay({
        key: o.keyId,
        order_id: o.orderId,
        name: "Skooltech",
        description: `${o.planName} — annual subscription`,
        prefill: { name: reserved?.name || "", email: "", contact: "" },
        theme: { color: "#1D4ED8" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const fd = new FormData();
          fd.set("orderId", response.razorpay_order_id);
          fd.set("paymentId", response.razorpay_payment_id);
          fd.set("signature", response.razorpay_signature);
          fd.set("mode", "RAZORPAY");
          const res = await verifySubscriptionPaymentAction(null, fd);
          setPayPending(false);
          if (res.success && res.activated) {
            setActivated(res.activated);
            setFlowStep(4);
          } else {
            setPayState(res);
          }
        },
        modal: { ondismiss: () => setPayPending(false) },
      });
      rzp.on("payment.failed", () => {
        setPayPending(false);
        setPayState({ success: false, error: "Payment failed. Please try again." });
      });
      rzp.open();
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="h-9 w-9 rounded-[4px] bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            Skool<span className="text-blue-700">tech</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Register Your School</h2>
        <p className="mt-1 text-sm text-slate-600">
          Claim your username, set up your admin, and activate your plan.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((s, i) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                      isDone
                        ? "bg-blue-700 border-blue-700 text-white"
                        : isActive
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      isActive ? "text-slate-900" : isDone ? "text-blue-700" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 ${isDone ? "bg-blue-300" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-lg">School Identity</CardTitle>
              <CardDescription>
                Your username becomes your permanent subdomain — it cannot be changed later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {identityState?.error && (
                <div className="mb-4 p-3 rounded-[4px] bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-sm text-rose-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{identityState.error}</span>
                </div>
              )}
              <form action={identityAction} onSubmit={() => setReset(false)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    School Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <School className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      name="schoolName"
                      type="text"
                      required
                      maxLength={100}
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Greenwood International School"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Username <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      name="username"
                      type="text"
                      required
                      maxLength={30}
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      placeholder="e.g. greenwood-international"
                      className="pl-9"
                    />
                  </div>
                  <div className="mt-2 min-h-[36px]">
                    {availability.kind === "checking" && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin" /> Checking availability…
                      </p>
                    )}
                    {availability.kind === "available" && subdomain && (
                      <div className="p-2 rounded-[4px] bg-emerald-50 border border-emerald-200">
                        <p className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Username available
                        </p>
                        <p className="text-xs text-emerald-700/80 mt-0.5 font-mono">{subdomain}</p>
                      </div>
                    )}
                    {availability.kind === "unavailable" && (
                      <p className="text-xs text-rose-600 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" /> {availability.reason}
                      </p>
                    )}
                    {availability.kind === "idle" && slug.length > 0 && slug.length < 3 && (
                      <p className="text-xs text-slate-400">
                        At least 3 characters. Lowercase letters, numbers and hyphens.
                      </p>
                    )}
                    {availability.kind === "idle" && slug.length === 0 && (
                      <p className="text-xs text-slate-400">
                        This will be your school&apos;s login address, e.g.{" "}
                        <span className="font-mono">yourschool.{rootDomain}</span>
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={
                    identityPending ||
                    availability.kind === "checking" ||
                    availability.kind !== "available"
                  }
                  className="w-full mt-2"
                  size="lg"
                >
                  {identityPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Reserving…
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="h-4 w-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && reserved && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-blue-700" /> Admin Account
                </CardTitle>
                <Badge variant="success" className="text-[10px]">
                  {reserved.code}
                </Badge>
              </div>
              <CardDescription>Create the login for your school administrator.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-[4px] border border-slate-200 bg-slate-50 p-3 mb-5 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{reserved.name}</span> ·{" "}
                <span className="font-mono">{reserved.subdomain}</span>
              </div>

              {adminState?.error && (
                <div className="mb-4 p-3 rounded-[4px] bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-sm text-rose-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{adminState.error}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Admin Username <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <UserCog className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input
                      name="adminUsername"
                      type="text"
                      required
                      maxLength={30}
                      placeholder="e.g. schooladmin"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        name="adminEmail"
                        type="email"
                        placeholder="admin@yourschool.edu.in"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input name="adminPhone" type="tel" placeholder="+91…" className="pl-9" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Password <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        name="adminPassword"
                        type="password"
                        required
                        minLength={8}
                        placeholder="Min 8 characters"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Password <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        name="adminConfirm"
                        type="password"
                        required
                        minLength={8}
                        placeholder="Re-enter password"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Button type="submit" disabled={adminPending} className="flex-1" size="lg">
                    {adminPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating…
                      </>
                    ) : (
                      <>
                        Continue <ArrowRight className="h-4 w-4 ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setFlowStep(2)}>
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back
                </Button>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
                >
                  Start over
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && reserved && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-700" /> Payment
                </CardTitle>
                <Badge variant="success" className="text-[10px]">
                  {reserved.code}
                </Badge>
              </div>
              <CardDescription>
                Choose your plan and complete payment to activate Skooltech.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payState?.error && (
                <div className="mb-4 p-3 rounded-[4px] bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-sm text-rose-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{payState.error}</span>
                </div>
              )}

              <div className="space-y-3 mb-5">
                {PLAN_OPTIONS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-4 rounded-[4px] border cursor-pointer transition-colors ${
                      planId === p.id
                        ? "border-blue-400 bg-blue-50/50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        value={p.id}
                        checked={planId === p.id}
                        onChange={() => setPlanId(p.id)}
                        className="accent-blue-700"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">Billed annually</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {formatInr(p.amountInr)}
                      <span className="text-xs font-normal text-slate-500">/yr</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="rounded-[4px] border border-slate-200 bg-slate-50 p-3 mb-5 text-xs text-slate-600">
                Activating for <span className="font-semibold text-slate-800">{reserved.name}</span>{" "}
                · <span className="font-mono">{reserved.subdomain}</span>
              </div>

              <Button
                onClick={handlePay}
                disabled={orderPending || payPending}
                className="w-full"
                size="lg"
              >
                {orderPending || payPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Pay {formatInr(PLAN_OPTIONS.find((p) => p.id === planId)?.amountInr || 0)}
                  </>
                )}
              </Button>
              <p className="mt-3 text-[11px] text-slate-400 text-center">
                Secure payment. You&apos;ll be redirected to your dashboard once verified.
              </p>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setFlowStep(2)}>
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back
                </Button>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
                >
                  Start over
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && activated && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="space-y-1 pb-4 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-lg">Payment successful — you&apos;re all set!</CardTitle>
              <CardDescription>
                {activated.name} is now active on the {activated.planName} plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-[4px] border border-slate-200 bg-slate-50 p-4 mb-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">School</span>
                  <span className="font-semibold text-slate-800">{activated.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">School Code</span>
                  <span className="font-mono font-bold text-slate-800">{activated.code}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Subdomain</span>
                  <span className="font-mono text-blue-700">{activated.subdomain}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Renews on</span>
                  <span className="text-slate-800">
                    {new Date(activated.currentPeriodEnd).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <a href={`https://${activated.subdomain}/login`} className="block">
                <Button className="w-full" size="lg">
                  <Globe className="h-4 w-4 mr-2" /> Go to your login
                </Button>
              </a>
              <p className="mt-3 text-[11px] text-slate-500 text-center">
                Sign in with your admin username and password to reach your School Admin dashboard.
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <Link
                  href="/login"
                  className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors"
                >
                  Or use the standard sign-in page
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
