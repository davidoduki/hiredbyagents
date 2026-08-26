import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { TaskListItem } from "@/components/tasks/task-list-item";
import { formatCurrency } from "@/lib/utils";
import { PlusCircle, ClipboardList, Briefcase, MapPin, Wallet } from "lucide-react";

export default async function DashboardPage() {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error("[dashboard] getCurrentUser failed:", err);
    throw err;
  }
  if (!user) redirect("/sign-in");

  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  const [openRequests, inField, assignedTasks, spend] = await Promise.all([
    prisma.task.findMany({
      where: { posterId: user.id, status: { in: ["OPEN", "PENDING_PAYMENT"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { assignedTo: true },
    }),
    prisma.task.findMany({
      where: {
        posterId: user.id,
        status: { in: ["ASSIGNED", "IN_PROGRESS", "REVIEW"] },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { assignedTo: true },
    }),
    prisma.task.findMany({
      where: {
        assignedToId: user.id,
        status: { in: ["ASSIGNED", "IN_PROGRESS", "REVIEW"] },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { poster: true },
    }),
    prisma.payment.aggregate({
      where: {
        payerId: user.id,
        status: { in: ["HELD", "RELEASED"] },
        createdAt: { gte: monthStart },
      },
      _sum: { amount: true },
      _count: true,
    }),
  ]).catch((err) => {
    console.error("[dashboard] data queries failed:", err);
    throw err;
  });

  const spendThisMonth = Number(spend._sum.amount ?? 0) * 100;

  const stats = [
    {
      label: "Open requests",
      value: openRequests.length,
      sub: openRequests.length === 0 ? "Nothing queued" : "Awaiting dispatch",
      icon: ClipboardList,
      accent: false,
    },
    {
      label: "In the field",
      value: inField.length,
      sub: inField.length > 0 ? "Verifier assigned" : "None active",
      icon: MapPin,
      accent: inField.length > 0,
    },
    {
      label: "Assigned to you",
      value: assignedTasks.length,
      sub: assignedTasks.length > 0 ? "Awaiting your result" : "Nothing assigned",
      icon: Briefcase,
      accent: false,
    },
    {
      label: "Spend this month",
      value: formatCurrency(spendThisMonth),
      sub: `Across ${spend._count} ${spend._count === 1 ? "check" : "checks"}`,
      icon: Wallet,
      accent: false,
    },
  ];

  // The poster-side list leads with work in progress, then anything still queued.
  const myRequests = [...inField, ...openRequests].slice(0, 5);

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Dashboard" />
      <div className="mx-auto w-full max-w-5xl px-4 py-9 sm:px-6">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-100">
            Welcome back, {user.name.split(" ")[0]}
          </h2>
          <p className="mt-1 text-zinc-500">
            {inField.length > 0
              ? `${inField.length} ${inField.length === 1 ? "verification is" : "verifications are"} in the field right now.`
              : "Here's where your verifications stand."}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.07] bg-zinc-900 p-5"
              >
                <div className="mb-3.5 flex items-center justify-between">
                  <span className="eyebrow text-zinc-600">{stat.label}</span>
                  <Icon className="h-[15px] w-[15px] text-zinc-700" />
                </div>
                <div className="font-display text-[30px] font-extrabold leading-none tracking-tight text-zinc-100">
                  {stat.value}
                </div>
                <div
                  className={`mt-2 text-[12.5px] ${
                    stat.accent ? "text-emerald-400" : "text-zinc-600"
                  }`}
                >
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="mb-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/tasks/new">
              <PlusCircle className="h-4 w-4" />
              Request a verification
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/my-tasks">View all requests</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Your requests */}
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="font-display font-bold tracking-tight text-zinc-100">
                Your requests
              </h3>
              <Link
                href="/my-tasks"
                className="text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-300"
              >
                View all
              </Link>
            </div>
            {myRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.10] p-8 text-center text-sm leading-relaxed text-zinc-600">
                No verifications requested yet.{" "}
                <Link href="/tasks/new" className="text-emerald-400 hover:underline">
                  Request one
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {myRequests.map((task) => (
                  <TaskListItem key={task.id} task={task} role="poster" />
                ))}
              </div>
            )}
          </div>

          {/* Assigned to you */}
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <h3 className="font-display font-bold tracking-tight text-zinc-100">
                Assigned to you
              </h3>
              <Link
                href="/my-work"
                className="text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-300"
              >
                View all
              </Link>
            </div>
            {assignedTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.10] p-8 text-center text-sm leading-relaxed text-zinc-600">
                Nothing assigned right now. Our team will notify you when you are
                matched.
              </div>
            ) : (
              <div className="space-y-2.5">
                {assignedTasks.map((task) => (
                  <TaskListItem key={task.id} task={task} role="worker" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
