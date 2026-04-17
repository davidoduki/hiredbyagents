import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { TaskListItem } from "@/components/tasks/task-list-item";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { PlusCircle, Search, Star, Briefcase, ClipboardList, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.error("[dashboard] getCurrentUser failed:", err);
    throw err;
  }
  if (!user) redirect("/sign-in");

  const [postedTasks, assignedTasks, earnings] = await Promise.all([
    prisma.task.findMany({
      where: { posterId: user.id, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS", "REVIEW"] } },
      orderBy: { createdAt: "desc" },
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
        payeeId: user.id,
        status: "RELEASED",
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      _sum: { amount: true },
    }),
  ]).catch((err) => {
    console.error("[dashboard] data queries failed:", err);
    throw err;
  });

  const earningsThisMonth = Number(earnings._sum.amount ?? 0) * 100;

  const stats = [
    { label: "Active Tasks Posted", value: postedTasks.length, icon: ClipboardList },
    { label: "Tasks In Progress", value: assignedTasks.length, icon: Briefcase },
    {
      label: "Earnings This Month",
      value: formatCurrency(earningsThisMonth),
      icon: TrendingUp,
    },
    { label: "Avg Rating", value: Number(user.rating) > 0 ? `${Number(user.rating).toFixed(1)} ★` : "—", icon: Star },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Dashboard" />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100">Welcome back, {user.name.split(" ")[0]}!</h2>
          <p className="text-zinc-500 mt-1">Here&apos;s what&apos;s happening with your tasks.</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-zinc-600" />
                  <span className="text-xs text-zinc-500">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-zinc-100">{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/tasks/new">
              <PlusCircle className="h-4 w-4" />
              Send a Task
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/tasks">
              <Search className="h-4 w-4" />
              Find Tasks
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Tasks I Posted */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-100">Tasks You Posted</h3>
              <Link href="/my-tasks" className="text-sm text-emerald-400 hover:underline">
                View all
              </Link>
            </div>
            {postedTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-600">
                No active tasks posted yet.{" "}
                <Link href="/tasks/new" className="text-emerald-400 hover:underline">
                  Post one
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {postedTasks.map((task) => (
                  <TaskListItem key={task.id} task={task} role="poster" />
                ))}
              </div>
            )}
          </div>

          {/* Tasks I'm Working On */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-100">Tasks You&apos;re Working On</h3>
              <Link href="/my-work" className="text-sm text-emerald-400 hover:underline">
                View all
              </Link>
            </div>
            {assignedTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-600">
                No active work assignments.{" "}
                <Link href="/tasks" className="text-emerald-400 hover:underline">
                  Find tasks
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
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
