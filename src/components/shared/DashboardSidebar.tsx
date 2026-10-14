"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { UserRoleType } from "@/lib/auth";
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  IndianRupee,
  BookOpen,
  CalendarDays,
  FileText,
  Bell,
  User,
  Users,
  Building2,
  ClipboardList,
  Settings,
  ShieldCheck,
  Receipt,
  BarChart3,
  Megaphone,
  Wallet,
  Printer,
  School,
  HeartPulse,
  FileSearch,
  Send,
  BookMarked,
  Archive,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const STUDENT_NAV: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/dashboard/student", icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "My Exams", href: "/dashboard/student/exams", icon: <FileText className="h-4 w-4" /> },
      { label: "Academics", href: "/dashboard/student/academics", icon: <BookOpen className="h-4 w-4" /> },
      { label: "Report Cards", href: "/dashboard/student/report-cards", icon: <GraduationCap className="h-4 w-4" /> },
      { label: "Schedule", href: "/dashboard/student/schedule", icon: <CalendarDays className="h-4 w-4" /> },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Attendance", href: "/dashboard/student/attendance", icon: <CalendarCheck className="h-4 w-4" /> },
      { label: "Leave Applications", href: "/dashboard/student/leaves", icon: <ClipboardList className="h-4 w-4" /> },
      { label: "Fees", href: "/dashboard/student/fees", icon: <IndianRupee className="h-4 w-4" /> },
    ],
  },
  {
    title: "General",
    items: [
      { label: "Notifications", href: "/dashboard/student/notifications", icon: <Bell className="h-4 w-4" /> },
      { label: "Profile", href: "/dashboard/student/profile", icon: <User className="h-4 w-4" /> },
    ],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/dashboard/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Student Lifecycle", href: "/dashboard/admin/students", icon: <GraduationCap className="h-4 w-4" /> },
      { label: "Staff Management", href: "/dashboard/admin/staff", icon: <Users className="h-4 w-4" /> },
      { label: "Academic Structure", href: "/dashboard/admin/academics", icon: <School className="h-4 w-4" /> },
      { label: "Admissions", href: "/dashboard/admin/admissions", icon: <ClipboardList className="h-4 w-4" /> },
      { label: "Archive", href: "/dashboard/archive", icon: <Archive className="h-4 w-4" /> },
    ],
  },
  {
    title: "Finance & Exams",
    items: [
      { label: "Fee Structures", href: "/dashboard/admin/fees", icon: <Wallet className="h-4 w-4" /> },
      { label: "Examinations", href: "/dashboard/admin/exams", icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Communications", href: "/dashboard/admin/communications", icon: <Megaphone className="h-4 w-4" /> },
      { label: "Audit & Compliance", href: "/dashboard/admin/audit", icon: <ShieldCheck className="h-4 w-4" /> },
      { label: "Settings", href: "/dashboard/admin/settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

const PRINCIPAL_NAV: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/dashboard/principal", icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    title: "Oversight",
    items: [
      { label: "Attendance", href: "/dashboard/principal/attendance", icon: <CalendarCheck className="h-4 w-4" /> },
      { label: "Academics", href: "/dashboard/principal/academics", icon: <BarChart3 className="h-4 w-4" /> },
      { label: "Fee & Finance", href: "/dashboard/principal/finance", icon: <IndianRupee className="h-4 w-4" /> },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Staff", href: "/dashboard/principal/staff", icon: <Users className="h-4 w-4" /> },
      { label: "Student Welfare", href: "/dashboard/principal/welfare", icon: <HeartPulse className="h-4 w-4" /> },
      { label: "Archive", href: "/dashboard/archive", icon: <Archive className="h-4 w-4" /> },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Audit Trail", href: "/dashboard/principal/audit", icon: <FileSearch className="h-4 w-4" /> },
      { label: "Reports", href: "/dashboard/principal/reports", icon: <FileText className="h-4 w-4" /> },
      { label: "Settings", href: "/dashboard/principal/settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

const ACCOUNTS_NAV: NavSection[] = [
  {
    items: [
      { label: "Overview", href: "/dashboard/accounts", icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    title: "Cash Desk",
    items: [
      { label: "Collect Payment", href: "/dashboard/accounts/cash-desk", icon: <IndianRupee className="h-4 w-4" /> },
      { label: "Student Ledger", href: "/dashboard/accounts/ledger", icon: <Receipt className="h-4 w-4" /> },
      { label: "Receipts & Printing", href: "/dashboard/accounts/receipts", icon: <Printer className="h-4 w-4" /> },
      { label: "Archive", href: "/dashboard/archive", icon: <Archive className="h-4 w-4" /> },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Fee Management", href: "/dashboard/accounts/fees", icon: <Wallet className="h-4 w-4" /> },
      { label: "Payment Gateway", href: "/dashboard/accounts/gateway", icon: <Building2 className="h-4 w-4" /> },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Reports", href: "/dashboard/accounts/reports", icon: <BarChart3 className="h-4 w-4" /> },
      { label: "Audit Log", href: "/dashboard/accounts/audit", icon: <ShieldCheck className="h-4 w-4" /> },
      { label: "Settings", href: "/dashboard/accounts/settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

const TEACHER_NAV: NavSection[] = [
  {
    items: [
      { label: "My Class", href: "/dashboard/teacher", icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    title: "Daily Work",
    items: [
      { label: "Attendance", href: "/dashboard/teacher/attendance", icon: <CalendarCheck className="h-4 w-4" /> },
      { label: "Admissions Queue", href: "/dashboard/teacher/admissions", icon: <ClipboardList className="h-4 w-4" /> },
      { label: "Examinations", href: "/dashboard/teacher/exams", icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    title: "Students",
    items: [
      { label: "Student Profiles", href: "/dashboard/teacher/students", icon: <GraduationCap className="h-4 w-4" /> },
      { label: "Leave Management", href: "/dashboard/teacher/leaves", icon: <ClipboardList className="h-4 w-4" /> },
      { label: "Lesson Planning", href: "/dashboard/teacher/lessons", icon: <BookMarked className="h-4 w-4" /> },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Communications", href: "/dashboard/teacher/communications", icon: <Send className="h-4 w-4" /> },
      { label: "Reports", href: "/dashboard/teacher/reports", icon: <BarChart3 className="h-4 w-4" /> },
      { label: "Settings", href: "/dashboard/teacher/settings", icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

function getNavForRole(role: UserRoleType): NavSection[] {
  switch (role) {
    case "SUPER_ADMIN":
    case "SCHOOL_ADMIN":
      return ADMIN_NAV;
    case "PRINCIPAL":
      return PRINCIPAL_NAV;
    case "ACCOUNTS":
      return ACCOUNTS_NAV;
    case "TEACHER":
      return TEACHER_NAV;
    case "STUDENT":
      return STUDENT_NAV;
    default:
      return STUDENT_NAV;
  }
}

interface DashboardSidebarProps {
  role: UserRoleType;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const sections = getNavForRole(role);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (["/dashboard/student", "/dashboard/admin", "/dashboard/principal", "/dashboard/accounts", "/dashboard/teacher"].includes(href)) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sidebarContent = (
    <nav className="flex flex-col h-full overflow-y-auto" aria-label="Dashboard navigation">
      <div className="flex-1 px-3 py-4 space-y-6">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            {section.title && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors",
                        active
                          ? "bg-blue-600/20 text-blue-400 shadow-sm shadow-blue-600/10"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      )}
                    >
                      <span className={cn("shrink-0", active ? "text-blue-400" : "text-slate-500")}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-[4px]",
                            active
                              ? "bg-blue-600/30 text-blue-300"
                              : "bg-white/10 text-slate-400"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] shrink-0 border-r border-slate-800 bg-[#0f172a] h-[calc(100vh-64px)] sticky top-16 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-40 h-12 w-12 rounded-[4px] bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-[280px] max-w-[85vw] bg-[#0f172a] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800 shrink-0">
              <span className="font-bold text-lg tracking-tight text-white">
                Skool<span className="text-blue-400">tech</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8 rounded-[4px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
