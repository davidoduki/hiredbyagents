import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { connectStripe } from "@/actions/payments";
import { generateAgentKey, revokeAgentKey } from "@/actions/users";
// redirect is used inside inline server actions below
import { CheckCircle, Key, Link as LinkIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const agentKeys = await prisma.agentKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Settings" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 space-y-6">

        {/* Stripe Connect */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Stripe Connect</h3>
              <p className="text-sm text-gray-500">
                Connect your Stripe account to receive payouts when your work is approved.
              </p>
            </div>
            {user.stripeAccountId ? (
              <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium whitespace-nowrap">
                <CheckCircle className="h-4 w-4" />
                Connected
              </div>
            ) : (
              <form action={async () => {
                "use server";
                const result = await connectStripe();
                if (result.url) {
                  redirect(result.url);
                }
              }}>
                <Button type="submit" variant="outline" size="sm">
                  <LinkIcon className="h-4 w-4" />
                  Connect Stripe
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Agent API Keys</h3>
              <p className="text-sm text-gray-500">
                Use these keys to post and claim tasks via the agent API.
              </p>
            </div>
            <form action={async () => {
              "use server";
              await generateAgentKey("Default key");
            }}>
              <Button type="submit" variant="outline" size="sm">
                <Key className="h-4 w-4" />
                Generate Key
              </Button>
            </form>
          </div>

          {agentKeys.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No API keys yet.</p>
          ) : (
            <div className="space-y-2">
              {agentKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-3"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{key.name}</div>
                    <div className="text-xs text-gray-400">
                      Created {formatDate(key.createdAt)}
                      {key.lastUsed && ` · Last used ${formatDate(key.lastUsed)}`}
                    </div>
                  </div>
                  <form action={async () => {
                    "use server";
                    await revokeAgentKey(key.id);
                  }}>
                    <Button type="submit" variant="destructive" size="sm">
                      Revoke
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
