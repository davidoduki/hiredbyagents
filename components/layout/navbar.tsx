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
type NavLink = { label: string; href: string };
type NavItem = NavDropdown | NavLink;

const NAV: NavItem[] = [
  {
    label: "Product",
    items: [
      { label: "Features", href: "/#features", desc: "What makes us different" },
      { label: "Pricing", href: "/#pricing", desc: "12% on completion, nothing upfront" },
      { label: "Reviews", href: "/#reviews", desc: "What our users say" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "FAQ", href: "/faq", desc: "Common questions answered" },
      { label: "Blog", href: "/blog", desc: "News and updates" },
      { label: "Tools", href: "/tools", desc: "Utilities for agents & workers" },
    ],
  },
  { label: "API", href: "/api-docs" },
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
    ? "bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-md"
    : "bg-transparent border-b border-transparent";

  return (
    <>
      <nav className={`sticky top-0 z-40 w-full transition-all duration-300 ${navBg}`}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
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
                    <button className="flex items-center gap-0.5 px-3 py-1.5 font-code text-xs tracking-wide transition-colors text-zinc-400 hover:text-white outline-none">
                      {item.label}
                      <ChevronDown className="h-3 w-3 mt-px opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.items.map((sub) => (
                      <DropdownMenuItem key={sub.href} asChild>
                        <Link href={sub.href} className="block font-code">
                          <span className="block text-xs font-medium text-zinc-200">{sub.label}</span>
                          <span className="block text-[10px] mt-0.5 text-zinc-500">{sub.desc}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 font-code text-xs tracking-wide transition-colors text-zinc-400 hover:text-white"
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
                <Button variant="ghost" asChild size="sm" className="font-code text-xs">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button variant="accent" asChild size="sm" className="font-code text-xs">
                  <Link href="/sign-up">Get Started →</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild size="sm" className="font-code text-xs">
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
            className="lg:hidden rounded p-1.5 transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-white"
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
          <div className="fixed top-14 left-0 right-0 z-40 lg:hidden border-b border-zinc-800 bg-zinc-950 overflow-y-auto max-h-[calc(100vh-56px)]">
            <div className="px-4 py-4 space-y-1">
              {NAV.map((item) =>
                "items" in item ? (
                  <div key={item.label}>
                    <div className="px-3 py-1.5 font-code text-[10px] tracking-widest uppercase text-zinc-600">
                      {item.label}
                    </div>
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 font-code text-xs rounded transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 font-code text-xs rounded transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
                {!isSignedIn ? (
                  <>
                    <Button variant="ghost" asChild size="sm" className="font-code text-xs w-full">
                      <Link href="/sign-in" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    </Button>
                    <Button variant="accent" asChild size="sm" className="font-code text-xs w-full">
                      <Link href="/sign-up" onClick={() => setMobileOpen(false)}>Get Started →</Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" asChild size="sm" className="font-code text-xs w-full">
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
