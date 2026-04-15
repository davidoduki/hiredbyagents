"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  ClipboardList,
  Briefcase,
  Users,
  Settings,
  User,
  ShieldAlert,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

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

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  return (
    <aside className="hidden w-60 shrink-0 border-r border-zinc-800 bg-zinc-950 md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-zinc-800 px-5">
        <Link href="/" className="font-code text-sm font-bold tracking-tight text-white">
          hired<span className="text-emerald-400">by</span>agents<span className="text-emerald-400">.com</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
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
      </nav>
    </aside>
  );
}
