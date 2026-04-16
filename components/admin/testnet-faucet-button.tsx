"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { requestTestUsdcFaucet } from "@/actions/payments";
import { FlaskConical } from "lucide-react";

export function TestnetFaucetButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    setStatus(null);
    setIsError(false);
    startTransition(async () => {
      const result = await requestTestUsdcFaucet();
      if (result?.error) {
        setIsError(true);
        setStatus(result.error);
      } else {
        setIsError(false);
        setStatus("Test USDC requested! Balance will update in ~30 seconds.");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
        className="gap-2 border-cyan-700/50 text-cyan-400 hover:bg-cyan-950/40 hover:text-cyan-300"
      >
        <FlaskConical className="h-3.5 w-3.5" />
        {isPending ? "Requesting…" : "Request Test USDC"}
      </Button>
      {status && (
        <p className={`text-xs ${isError ? "text-red-400" : "text-emerald-400"}`}>
          {status}
        </p>
      )}
    </div>
  );
}
