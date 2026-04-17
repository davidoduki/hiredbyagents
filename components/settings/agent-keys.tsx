"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateAgentKey, revokeAgentKey } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Key, Copy, Check, AlertTriangle, Trash2, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

const SCOPE_OPTIONS = [
  { value: "tasks:read", label: "Read tasks" },
  { value: "tasks:write", label: "Post / claim / submit tasks" },
];

const EXPIRY_OPTIONS = [
  { label: "Never", days: 0 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 },
];

interface AgentKey {
  id: string;
  name: string;
  scopes: string[];
  expiresAt: Date | null;
  createdAt: Date;
  lastUsed: Date | null;
}

export function AgentKeys({ initialKeys }: { initialKeys: AgentKey[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["tasks:read", "tasks:write"]);
  const [expiresInDays, setExpiresInDays] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggleScope(scope: string) {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const name = keyName.trim() || "My API Key";
    setError(null);
    startTransition(async () => {
      const res = await generateAgentKey(
        name,
        expiresInDays > 0 ? expiresInDays : undefined,
        selectedScopes.length > 0 ? selectedScopes : undefined
      );
      if ("error" in res && res.error) { setError(res.error); return; }
      if ("key" in res && res.key) {
        setNewKey(res.key);
        setKeyName("");
        router.refresh();
      }
    });
  }

  function handleCopy() {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRevoke(keyId: string) {
    setError(null);
    startTransition(async () => {
      const res = await revokeAgentKey(keyId);
      if ("error" in res && res.error) { setError(res.error); return; }
      setKeys((prev) => prev.filter((k) => k.id !== keyId));
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">

      {/* Newly generated key — shown once */}
      {newKey && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-300">Copy your key now — it won't be shown again</p>
              <p className="text-xs text-zinc-500 mt-0.5">Store it in a password manager or .env file.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={newKey}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-emerald-400 focus:outline-none"
            />
            <Button type="button" size="sm" variant="outline" className="shrink-0 gap-1.5" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Button type="button" size="sm" variant="ghost" className="text-xs text-zinc-500" onClick={() => setNewKey(null)}>
            I've saved it, dismiss
          </Button>
        </div>
      )}

      {/* Generate form */}
      <form onSubmit={handleGenerate} className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex gap-2">
          <input
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="Key name (e.g. LangChain agent)"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
          />
          <select
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(Number(e.target.value))}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          >
            {EXPIRY_OPTIONS.map((o) => (
              <option key={o.days} value={o.days}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3">
          {SCOPE_OPTIONS.map((s) => (
            <label key={s.value} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedScopes.includes(s.value)}
                onChange={() => toggleScope(s.value)}
                className="rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-xs text-zinc-400">{s.label}</span>
            </label>
          ))}
          <span className="text-xs text-zinc-600 self-center">(empty = all scopes)</span>
        </div>

        <Button type="submit" variant="outline" size="sm" disabled={isPending} className="gap-1.5">
          <Key className="h-4 w-4" />
          {isPending ? "Generating…" : "Generate Key"}
        </Button>
      </form>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Existing keys */}
      {keys.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-4">No API keys yet.</p>
      ) : (
        <div className="space-y-2">
          {keys.map((key) => {
            const expired = key.expiresAt && new Date(key.expiresAt) < new Date();
            return (
              <div key={key.id} className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-100">{key.name}</span>
                    {expired && (
                      <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5">Expired</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Created {formatDate(key.createdAt)}
                    {key.lastUsed && ` · Last used ${formatDate(key.lastUsed)}`}
                    {key.expiresAt && !expired && ` · Expires ${formatDate(new Date(key.expiresAt))}`}
                  </div>
                  {key.scopes.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <ShieldCheck className="h-3 w-3 text-zinc-600 shrink-0" />
                      {key.scopes.map((s) => (
                        <span key={s} className="text-[10px] text-zinc-500 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-zinc-600 hover:text-red-400 h-8 w-8 p-0 shrink-0"
                  disabled={isPending}
                  onClick={() => handleRevoke(key.id)}
                  title="Revoke key"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Usage hint */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 space-y-2">
        <p className="text-xs font-medium text-zinc-500">How to use</p>
        <div className="space-y-1 text-xs text-zinc-600 font-mono">
          <p>curl https://hiredbyagents.com/api/agent/tasks \</p>
          <p className="pl-4">-H "x-agent-key: hba_..."</p>
        </div>
        <p className="text-xs text-zinc-600">
          Batch-create up to 50 tasks at once with{" "}
          <span className="font-mono text-zinc-500">POST /api/agent/tasks/batch</span>. See{" "}
          <a href="/docs" className="text-zinc-400 hover:text-zinc-200 underline">/docs</a> for the full reference.
        </p>
      </div>
    </div>
  );
}
