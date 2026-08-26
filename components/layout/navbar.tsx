"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserButton, useUser } from "@clerk/nextjs";

type NavDropdown = { label: string; items: { label: string; href: string; desc: string }[] };
type NavLink = { label: string; href: string; secondary?: boolean };
type NavItem = NavDropdown | NavLink;

const NAV: NavItem[] = [
  {
    label: "What we verify",
    items: [
      { label: "Merchant & KYB checks", href: "/#use-cases", desc: "Confirm a business is real and trading" },
      { label: "Loan & collateral checks", href: "/#use-cases", desc: "Verify the asset exists before you disburse" },
      { label: "Supplier & warehouse audits", href: "/#use-cases", desc: "Stock counts, SKUs and conditions on site" },
      { label: "All use cases →", href: "/#use-cases", desc: "See everything we verify" },
    ],
  },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  {
    label: "Developers",
    items: [
      { label: "API docs", href: "/docs", desc: "REST API reference and webhooks" },
      { label: "FAQ", href: "/faq", desc: "Common questions answered" },
      { label: "Blog", href: "/blog", desc: "News and updates" },
      { label: "Tools", href: "/tools", desc: "Utilities for teams and agents" },
    ],
  },
  { label: "Work with us", href: "/workers", secondary: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navBg = scrolled
    ? "bg-zinc-950/90 border-b border-white/[0.06] backdrop-blur-xl"
    : "bg-transparent border-b border-transparent";

  return (
    <>
      <nav className={`sticky top-0 z-40 w-full transition-all duration-300 ${navBg}`}>
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-6 sm:px-10 lg:px-0">
          {/* Logo */}
          <Link href="/" className="font-code text-sm font-bold tracking-tight text-white">
            hired<span className="text-emerald-400">by</span>agents
            <span className="text-emerald-400">.com</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV.map((item) =>
              "items" in item ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-100 outline-none">
                      {item.label}
                      <ChevronDown className="h-3 w-3 mt-px opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.items.map((sub) => (
                      <DropdownMenuItem key={sub.label} asChild>
                        <Link href={sub.href} className="block">
                          <span className="block text-sm font-medium text-zinc-200">{sub.label}</span>
                          <span className="block text-xs mt-0.5 text-zinc-500">{sub.desc}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  href={(item as NavLink).href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    (item as NavLink).secondary
                      ? "text-zinc-600 hover:text-zinc-400"
                      : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-2">
            {!isSignedIn ? (
              <>
                <Button variant="ghost" asChild size="sm">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button variant="accent" asChild size="sm">
                  <Link href="/tasks/new">Request a verification</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild size="sm">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Link>
                </Button>
                <UserButton />
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden rounded-lg p-2 transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-[72px] left-0 right-0 z-40 lg:hidden border-b border-white/[0.06] bg-zinc-950 overflow-y-auto max-h-[calc(100vh-72px)]">
            <div className="px-4 py-4 space-y-1">
              {NAV.map((item) =>
                "items" in item ? (
                  <div key={item.label}>
                    <div className="px-3 py-1.5 eyebrow text-zinc-600">
                      {item.label}
                    </div>
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2.5 text-sm rounded-lg transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={(item as NavLink).href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 text-sm rounded-lg transition-colors hover:bg-zinc-800 hover:text-zinc-100 ${
                      (item as NavLink).secondary ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="pt-3 mt-2 border-t border-white/[0.06] flex flex-col gap-2">
                {!isSignedIn ? (
                  <>
                    <Button variant="ghost" asChild size="sm" className="w-full">
                      <Link href="/sign-in" onClick={() => setMobileOpen(false)}>Sign in</Link>
                    </Button>
                    <Button variant="accent" asChild size="sm" className="w-full">
                      <Link href="/tasks/new" onClick={() => setMobileOpen(false)}>Request a verification</Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" asChild size="sm" className="w-full">
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
