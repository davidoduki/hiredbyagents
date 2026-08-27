"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Menu, X, LayoutDashboard, PlusCircle, ClipboardList, Briefcase, Users, Settings, User, Bell, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "davidoduki@gmail.com";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks/new", label: "New request", icon: PlusCircle },
  { href: "/my-tasks", label: "My requests", icon: ClipboardList },
  { href: "/my-work", label: "Assigned to me", icon: Briefcase },
  { href: "/workers/browse", label: "Verifiers", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const role = user?.publicMetadata?.adminRole as string | undefined;
  const isAdmin = email === ADMIN_EMAIL || role === "SUPER" || role === "MODERATOR";

  React.useEffect(() => setMounted(true), []);

  // Close on Escape, and stop the page scrolling underneath the open drawer.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /*
   * The drawer is rendered into document.body rather than in place. The topbar
   * that hosts this button uses backdrop-blur, which makes it the containing
   * block for position:fixed descendants — so an inline drawer gets clipped to
   * the 64px header instead of covering the viewport.
   */
  const drawer = (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed left-0 top-0 z-50 h-full w-64 bg-zinc-950 border-r border-white/[0.06] shadow-2xl flex flex-col">
            <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
              <Link href="/" onClick={() => setOpen(false)} className="font-code text-sm font-bold text-white">
                hired<span className="text-emerald-400">by</span>agents<span className="text-emerald-400">.com</span>
              </Link>
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
                        ? "bg-white/[0.07] text-zinc-100"
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
                    <span className="eyebrow text-zinc-600">Admin</span>
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
    </>
  );

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </div>
  );
}
