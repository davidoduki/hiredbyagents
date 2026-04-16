"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { grantAdminRole, revokeAdminRole, searchUsersByEmail } from "@/actions/admin";
import { Shield, ShieldAlert, ShieldOff, Search, X } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  adminRole: string;
}

interface ManageAdminsProps {
  currentAdmins: AdminUser[];
}

const ROLE_LABELS: Record<string, string> = {
  SUPER: "Super Admin",
  MODERATOR: "Moderator",
  NONE: "No access",
};

const ROLE_COLORS: Record<string, string> = {
  SUPER: "text-red-400 bg-red-500/10 border-red-500/20",
  MODERATOR: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

export function ManageAdmins({ currentAdmins }: ManageAdminsProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminUser[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await searchUsersByEmail(query);
      if (res.error) { setError(res.error); return; }
      setResults(res.users ?? []);
      setSearched(true);
    });
  }

  function handleGrant(userId: string, role: "MODERATOR" | "SUPER") {
    setError(null);
    startTransition(async () => {
      const res = await grantAdminRole(userId, role);
      if (res.error) { setError(res.error); return; }
      setResults([]);
      setQuery("");
      setSearched(false);
      router.refresh();
    });
  }

  function handleRevoke(userId: string) {
    setError(null);
    startTransition(async () => {
      const res = await revokeAdminRole(userId);
      if (res.error) { setError(res.error); return; }
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Current admins */}
      {currentAdmins.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">Current admins</p>
          {currentAdmins.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-zinc-200">{a.name}</p>
                <p className="text-xs text-zinc-500">{a.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${ROLE_COLORS[a.adminRole] ?? ""}`}>
                  {ROLE_LABELS[a.adminRole] ?? a.adminRole}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-zinc-600 hover:text-red-400 h-7 w-7 p-0"
                  disabled={isPending}
                  onClick={() => handleRevoke(a.id)}
                  title="Revoke access"
                >
                  <ShieldOff className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search to grant */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mb-2">Grant access</p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearched(false); setResults([]); }}
              placeholder="Search by email…"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); setResults([]); setSearched(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button size="sm" type="submit" variant="outline" disabled={isPending || !query.trim()}>
            {isPending ? "…" : "Search"}
          </Button>
        </form>

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        {searched && results.length === 0 && (
          <p className="text-xs text-zinc-600 mt-2">No users found.</p>
        )}

        {results.length > 0 && (
          <div className="mt-2 space-y-2">
            {results.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-200">{u.name}</p>
                  <p className="text-xs text-zinc-500">{u.email}</p>
                  {u.adminRole !== "NONE" && (
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${ROLE_COLORS[u.adminRole] ?? ""}`}>
                      Already: {ROLE_LABELS[u.adminRole]}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-amber-400 border-amber-700/40 hover:bg-amber-950/30 h-8 text-xs"
                    disabled={isPending || u.adminRole === "MODERATOR"}
                    onClick={() => handleGrant(u.id, "MODERATOR")}
                  >
                    <Shield className="h-3 w-3" />
                    Moderator
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-red-400 border-red-700/40 hover:bg-red-950/30 h-8 text-xs"
                    disabled={isPending || u.adminRole === "SUPER"}
                    onClick={() => handleGrant(u.id, "SUPER")}
                  >
                    <ShieldAlert className="h-3 w-3" />
                    Super
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role legend */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 space-y-2">
        <p className="text-xs font-medium text-zinc-500">Role permissions</p>
        <div className="space-y-1.5 text-xs text-zinc-600">
          <p><span className="text-amber-400 font-medium">Moderator</span> — view disputes, send messages, resolve disputes, see user list</p>
          <p><span className="text-red-400 font-medium">Super Admin</span> — full access including financials, USDC wallet, and managing other admins</p>
        </div>
      </div>
    </div>
  );
}
