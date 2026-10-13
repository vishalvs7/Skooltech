import Link from "next/link";
import { SessionPayload } from "@/lib/auth";
import { logoutAction } from "@/actions/auth.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, School, Shield, User } from "lucide-react";

interface DashboardHeaderProps {
  session: SessionPayload;
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  const getBadgeVariant = (role: SessionPayload["role"]) => {
    switch (role) {
      case "SUPER_ADMIN":
      case "SCHOOL_ADMIN":
        return "default";
      case "PRINCIPAL":
        return "secondary";
      case "ACCOUNTS":
        return "success";
      case "TEACHER":
        return "default";
      case "STUDENT":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & School Name */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-[4px] bg-blue-700 flex items-center justify-center text-white font-bold text-base shadow-sm">
              S
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:inline">
              Skool<span className="text-blue-700">tech</span>
            </span>
          </Link>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-blue-700 shrink-0" />
            <span className="text-sm font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
              {session.schoolName}
            </span>
            <Badge variant="secondary" className="font-mono text-[10px] hidden md:inline-flex">
              {session.schoolCode}
            </Badge>
          </div>
        </div>

        {/* Right: User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-right">
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">
                {session.username}
              </p>
              <div className="mt-1">
                <Badge variant={getBadgeVariant(session.role)} className="text-[10px] py-0 px-1.5 uppercase font-medium">
                  {session.role.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </div>

          <form action={logoutAction}>
            <Button variant="outline" size="sm" type="submit" className="text-xs h-8 px-2.5 text-slate-600 hover:text-rose-600">
              <LogOut className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
