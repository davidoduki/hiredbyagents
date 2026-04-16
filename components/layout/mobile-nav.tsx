"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Menu, X, LayoutDashboard, Search, PlusCircle, ClipboardList, Briefcase, Users, Settings, User, Bell, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "davidoduki@gmail.com";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Browse Tasks", icon: Search },
  { href: "/tasks/new", label: "Post a Task", icon: PlusCircle },
  { href: "/my-tasks", label: "My Tasks", icon: ClipboardList },
  { href: "/my-work", label: "My Work", icon: Briefcase },
  { href: "/workers", label: "Workers", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        aria-label="Toggle navigation"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed left-0 top-0 z-50 h-full w-64 bg-zinc-950 border-r border-zinc-800 shadow-2xl flex flex-col">
            <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-5">
              <span className="font-code text-sm font-bold text-white">
                hired<span className="text-emerald-400">by</span>agents<span className="text-emerald-400">.com</span>
              </span>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-zinc-500 hover:text-zinc-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-0.5 px-2 py-3 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}

              {isAdmin && (
                <>
                  <div className="px-3 pt-4 pb-1">
                    <span className="text-[10px] font-medium tracking-widest uppercase text-zinc-600">Admin</span>
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname.startsWith("/admin")
                        ? "bg-red-950/60 text-red-400"
                        : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
                    )}
                  >
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    Admin Panel
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
