"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  href: string;
}

interface TabNavigationProps {
  tabs: Tab[];
}

export function TabNavigation({ tabs }: TabNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="border-b border-slate-200 mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <nav className="flex gap-1 min-w-max" aria-label="Section tabs">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-2.5 text-sm font-medium rounded-t-[4px] border-b-2 transition-colors whitespace-nowrap",
                active
                  ? "border-blue-700 text-blue-700 bg-blue-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60"
              )}
              aria-current={active ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
