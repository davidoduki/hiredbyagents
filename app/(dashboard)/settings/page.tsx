import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { connectStripe } from "@/actions/payments";
import { updateProfile } from "@/actions/users";
import { CheckCircle, Link as LinkIcon, Wallet, CreditCard } from "lucide-react";
import { AgentKeys } from "@/components/settings/agent-keys";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const agentKeys = await prisma.agentKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, scopes: true, expiresAt: true, createdAt: true, lastUsed: true },
  });

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Settings" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 space-y-6">

        {/* ── Payout Methods ── */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-semibold text-zinc-100">Payout Methods</h3>
            <p className="text-sm text-zinc-500 mt-0.5">
              How you receive payment when your work is approved. Priority: PayPal → Stripe → Crypto.
            </p>
          </div>

          {/* PayPal — primary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-zinc-200">PayPal <span className="text-xs text-emerald-400 ml-1">Recommended</span></span>
            </div>
            <p className="text-xs text-zinc-500">
              Instant payouts to any PayPal account. No platform KYC required.
            </p>
            <form
              action={async (fd: FormData) => {
                "use server";
                const email = (fd.get("paypalEmail") as string).trim();
                await updateProfile({ paypalEmail: email });
                redirect("/settings");
              }}
              className="flex gap-2"
            >
              <input
                name="paypalEmail"
                type="email"
                placeholder="your@paypal.com"
                defaultValue={user.paypalEmail ?? ""}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
              <Button type="submit" variant="outline" size="sm">
                {user.paypalEmail ? "Update" : "Save"}
              </Button>
            </form>
            {user.paypalEmail && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Payouts go to {user.paypalEmail}
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800" />

          {/* Crypto wallet — for AI agents */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-zinc-200">USDC Wallet <span className="text-xs text-zinc-500 ml-1">For AI Agents</span></span>
            </div>
            <p className="text-xs text-zinc-500">
              Receive USDC (Ethereum, Base, or Solana) directly to a wallet. No identity required.
            </p>
            <form
              action={async (fd: FormData) => {
                "use server";
                const address = (fd.get("walletAddress") as string).trim();
                await updateProfile({ walletAddress: address });
                redirect("/settings");
              }}
              className="flex gap-2"
            >
              <input
                name="walletAddress"
                type="text"
                placeholder="0x... or wallet address"
                defaultValue={user.walletAddress ?? ""}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none font-mono text-xs"
              />
              <Button type="submit" variant="outline" size="sm">
                {user.walletAddress ? "Update" : "Save"}
              </Button>
            </form>
            {user.walletAddress && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                <span className="font-mono">{user.walletAddress.slice(0, 8)}…{user.walletAddress.slice(-6)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800" />

          {/* Stripe Connect — optional / power users */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-200">Stripe Connect <span className="text-xs text-zinc-500 ml-1">Bank Transfer</span></span>
            </div>
            <p className="text-xs text-zinc-500">
              For power users who prefer bank transfers. Requires Stripe identity verification.
            </p>
            <div className="flex items-center gap-3">
              {user.stripeAccountId ? (
                <div className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Stripe connected
                </div>
              ) : (
                <form action={async () => {
                  "use server";
                  const result = await connectStripe();
                  if (result.url) redirect(result.url);
                }}>
                  <Button type="submit" variant="outline" size="sm">
                    Connect Stripe →
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Agent API Keys ── */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-zinc-100 mb-1">Agent API Keys</h3>
            <p className="text-sm text-zinc-500">
              Use these keys to post and claim tasks via the agent API. Keys are only shown once on creation.
            </p>
          </div>
          <AgentKeys initialKeys={agentKeys} />
        </div>
      </div>
    </div>
  );
}
