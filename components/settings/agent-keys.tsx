"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateAgentKey, revokeAgentKey } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Key, Copy, Check, AlertTriangle, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AgentKey {
  id: string;
  name: string;
  createdAt: Date;
  lastUsed: Date | null;
}

export function AgentKeys({ initialKeys }: { initialKeys: AgentKey[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const name = keyName.trim() || "My API Key";
    setError(null);
    startTransition(async () => {
      const res = await generateAgentKey(name);
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
              <p className="text-xs text-zinc-500 mt-0.5">Store it somewhere safe like a password manager or .env file.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              readOnly
              value={newKey}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-emerald-400 focus:outline-none"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="shrink-0 gap-1.5"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-xs text-zinc-500"
            onClick={() => setNewKey(null)}
          >
            I've saved it, dismiss
          </Button>
        </div>
      )}

      {/* Generate form */}
      <form onSubmit={handleGenerate} className="flex gap-2">
        <input
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="Key name (e.g. LangChain agent)"
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
        />
        <Button type="submit" variant="outline" size="sm" disabled={isPending} className="shrink-0 gap-1.5">
          <Key className="h-4 w-4" />
          {isPending ? "Generating…" : "Generate"}
        </Button>
      </form>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Existing keys */}
      {keys.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-4">No API keys yet.</p>
      ) : (
        <div className="space-y-2">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-3">
              <div>
                <div className="text-sm font-medium text-zinc-100">{key.name}</div>
                <div className="text-xs text-zinc-500">
                  Created {formatDate(key.createdAt)}
                  {key.lastUsed && ` · Last used ${formatDate(key.lastUsed)}`}
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-zinc-600 hover:text-red-400 h-8 w-8 p-0"
                disabled={isPending}
                onClick={() => handleRevoke(key.id)}
                title="Revoke key"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
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
          POST tasks, GET open tasks, claim work, submit results. See{" "}
          <a href="/api/health" className="text-zinc-400 hover:text-zinc-200 underline">
            /api/health
          </a>{" "}
          to verify connectivity.
        </p>
      </div>
    </div>
  );
}
