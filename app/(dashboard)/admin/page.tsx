import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlatformUsdcBalance, getPlatformWalletAddress } from "@/lib/usdc";
import { Topbar } from "@/components/layout/topbar";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { AdminDisputeCard } from "@/components/admin/dispute-card";
import { CopyWalletAddress } from "@/components/admin/copy-wallet-address";
import { ManageAdmins } from "@/components/admin/manage-admins";
import { listCurrentAdmins } from "@/actions/admin";
import {
  Users, ClipboardList, DollarSign, AlertTriangle, TrendingUp,
  Bot, UserCheck, CheckCircle2, Wallet, ShieldAlert,
} from "lucide-react";

const SUPER_EMAIL = "davidoduki@gmail.com";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const isSuper = user.email === SUPER_EMAIL || user.adminRole === "SUPER";
  const isModerator = user.adminRole === "MODERATOR";

  if (!isSuper && !isModerator) redirect("/dashboard");

  // Shared queries (all admins)
  const [
    totalUsers,
    humanWorkers,
    agentWorkers,
    totalTasks,
    openTasks,
    completedTasks,
    disputedTasks,
    recentUsers,
    recentDisputes,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { workerType: "HUMAN" } }),
    prisma.user.count({ where: { workerType: "AGENT" } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: "OPEN" } }),
    prisma.task.count({ where: { status: "COMPLETE" } }),
    prisma.task.count({ where: { status: "DISPUTED" } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, workerType: true, adminRole: true, createdAt: true },
    }),
    prisma.task.findMany({
      where: { status: "DISPUTED" },
      orderBy: { updatedAt: "desc" },
      take: 10,
      include: {
        poster: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        disputeMessages: { include: { sender: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" } },
      },
    }),
  ]);

  // Super-only queries
  let totalPayments = 0;
  let recentPayments: Awaited<ReturnType<typeof prisma.payment.findMany>> = [];
  let totalRevenue = 0;
  let totalVolume = 0;
  let platformUsdcBalance = 0;
  let platformWalletAddress = "";
  let currentAdmins: { id: string; name: string; email: string; adminRole: string }[] = [];

  if (isSuper) {
    const [payments, paymentsList, revenue, usdcBal, walletAddr, adminsRes] = await Promise.all([
      prisma.payment.count({ where: { status: "RELEASED" } }),
      prisma.payment.findMany({
        where: { status: "RELEASED" },
        orderBy: { updatedAt: "desc" },
        take: 8,
        include: { task: { select: { title: true } }, payer: { select: { name: true } }, payee: { select: { name: true } } },
      }),
      prisma.payment.aggregate({ where: { status: "RELEASED" }, _sum: { platformFee: true, amount: true } }),
      getPlatformUsdcBalance(),
      getPlatformWalletAddress(),
      listCurrentAdmins(),
    ]);
    totalPayments = payments;
    recentPayments = paymentsList;
    totalRevenue = Number(revenue._sum.platformFee ?? 0);
    totalVolume = Number(revenue._sum.amount ?? 0);
    platformUsdcBalance = usdcBal;
    platformWalletAddress = walletAddr;
    currentAdmins = adminsRes.admins ?? [];
  }

  const sharedStats = [
    { label: "Total Users", value: totalUsers, sub: `${humanWorkers} humans · ${agentWorkers} agents`, icon: Users, color: "text-blue-400" },
    { label: "Total Tasks", value: totalTasks, sub: `${openTasks} open · ${completedTasks} complete`, icon: ClipboardList, color: "text-emerald-400" },
    { label: "Disputes", value: disputedTasks, sub: disputedTasks > 0 ? "Needs attention" : "All clear", icon: AlertTriangle, color: disputedTasks > 0 ? "text-red-400" : "text-zinc-500" },
  ];

  const superStats = [
    { label: "Platform Revenue", value: formatCurrency(totalRevenue * 100), sub: `$${totalVolume.toFixed(0)} total GMV`, icon: DollarSign, color: "text-yellow-400" },
    { label: "Payments Released", value: totalPayments, sub: "Successful payouts", icon: CheckCircle2, color: "text-emerald-400" },
    { label: "GMV", value: `$${totalVolume.toFixed(0)}`, sub: "Gross marketplace volume", icon: TrendingUp, color: "text-purple-400" },
    {
      label: "USDC Pool",
      value: `$${platformUsdcBalance.toFixed(2)}`,
      sub: platformUsdcBalance < 10 ? "Low — top up wallet" : "Circle · Base mainnet",
      icon: Wallet,
      color: platformUsdcBalance < 10 ? "text-amber-400" : "text-cyan-400",
    },
  ];

  const stats = isSuper ? [...sharedStats, ...superStats] : sharedStats;

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Admin Panel" />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 space-y-8">

        {/* Role badge */}
        <div className="flex items-center gap-2">
          <ShieldAlert className={`h-4 w-4 ${isSuper ? "text-red-400" : "text-amber-400"}`} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${isSuper ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"}`}>
            {isSuper ? "Super Admin" : "Moderator"}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-zinc-500">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{stat.sub}</div>
              </div>
            );
          })}
        </div>

        {/* USDC wallet — super only */}
        {isSuper && (
          <div className="rounded-xl border border-cyan-900/30 bg-zinc-900 p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200">Platform USDC Pool · Base Network</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {platformUsdcBalance > 0
                  ? `${platformUsdcBalance.toFixed(2)} USDC available`
                  : "Not yet funded — send USDC on Base to the address below"}
              </p>
              {platformWalletAddress && (
                <p className="text-xs font-mono text-zinc-400 mt-1 truncate">{platformWalletAddress}</p>
              )}
            </div>
            {platformWalletAddress && <CopyWalletAddress address={platformWalletAddress} />}
          </div>
        )}

        {/* Disputes — all admins */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h3 className="font-semibold text-zinc-100">Open Disputes</h3>
            {disputedTasks > 0 && (
              <span className="ml-auto rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400">
                {disputedTasks} active
              </span>
            )}
          </div>
          {recentDisputes.length === 0 ? (
            <p className="text-sm text-zinc-600 text-center py-6">No disputes — all clear.</p>
          ) : (
            <div className="space-y-4">
              {recentDisputes.map((task) => <AdminDisputeCard key={task.id} task={task} />)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Recent payouts — super only */}
          {isSuper && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <h3 className="font-semibold text-zinc-100">Recent Payouts</h3>
              </div>
              {recentPayments.length === 0 ? (
                <p className="text-sm text-zinc-600 text-center py-6">No payouts yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentPayments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-4 rounded-lg border border-zinc-800 p-3">
                      <div>
                        <div className="text-sm font-medium text-zinc-200 truncate max-w-[180px]">{p.task.title}</div>
                        <div className="text-xs text-zinc-500">{p.payer.name} → {p.payee.name}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-semibold text-emerald-400">{formatCurrency(Number(p.amount) * 100)}</div>
                        <div className="text-[10px] text-zinc-600">{formatCurrency(Number(p.platformFee) * 100)} fee</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent sign-ups — all admins */}
          <div className={`rounded-xl border border-zinc-800 bg-zinc-900 p-6 ${!isSuper ? "lg:col-span-2" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="h-4 w-4 text-blue-400" />
              <h3 className="font-semibold text-zinc-100">Recent Sign-ups</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-600 border-b border-zinc-800">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {recentUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="py-2.5 text-zinc-200 font-medium">{u.name}</td>
                      <td className="py-2.5 text-zinc-400 text-xs">{u.email}</td>
                      <td className="py-2.5">
                        {u.workerType ? (
                          <span className="inline-flex items-center gap-1 text-xs">
                            {u.workerType === "AGENT"
                              ? <><Bot className="h-3 w-3 text-purple-400" /><span className="text-purple-400">Agent</span></>
                              : <><Users className="h-3 w-3 text-blue-400" /><span className="text-blue-400">Human</span></>}
                          </span>
                        ) : <span className="text-xs text-zinc-600">—</span>}
                      </td>
                      <td className="py-2.5 text-xs text-zinc-600">{timeAgo(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Manage Admins — super only */}
        {isSuper && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center gap-2 mb-5">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              <h3 className="font-semibold text-zinc-100">Manage Admins</h3>
            </div>
            <ManageAdmins currentAdmins={currentAdmins} />
          </div>
        )}

      </div>
    </div>
  );
}
