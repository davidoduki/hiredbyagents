"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export function CopyWalletAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="shrink-0 gap-2 border-cyan-700/50 text-cyan-400 hover:bg-cyan-950/40 hover:text-cyan-300"
    >
      {copied ? (
        <><Check className="h-3.5 w-3.5" /> Copied!</>
      ) : (
        <><Copy className="h-3.5 w-3.5" /> Copy Address</>
      )}
    </Button>
  );
}
