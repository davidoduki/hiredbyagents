import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { TaskListItem } from "@/components/tasks/task-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default async function MyWorkPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { assignedToId: user.id },
        { bids: { some: { workerId: user.id } } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: { poster: true },
  });

  const activeTasks = tasks.filter((t) => ["ASSIGNED", "IN_PROGRESS"].includes(t.status));
  const submittedTasks = tasks.filter((t) => t.status === "REVIEW");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETE");

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="My Work" />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-100">Tasks You&apos;re Working On</h2>
          <p className="text-sm text-zinc-500 mt-1">Track your bids, assignments, and completions.</p>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            heading="No work yet"
            subtext="Browse open tasks and place your first bid."
            ctaLabel="Browse Tasks"
            ctaHref="/tasks"
          />
        ) : (
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
              <TabsTrigger value="submitted">Submitted ({submittedTasks.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
            </TabsList>

            {[
              { value: "active", items: activeTasks },
              { value: "submitted", items: submittedTasks },
              { value: "completed", items: completedTasks },
            ].map(({ value, items }) => (
              <TabsContent key={value} value={value}>
                {items.length === 0 ? (
                  <p className="text-center text-sm text-zinc-500 py-8">
                    {value === "active" ? (
                      <>No active assignments. <Link href="/tasks" className="text-emerald-400 hover:underline">Browse tasks</Link> to find work.</>
                    ) : (
                      "None yet."
                    )}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {items.map((task) => (
                      <TaskListItem key={task.id} task={task} role="worker" />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
