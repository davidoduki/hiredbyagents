import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { TaskListItem } from "@/components/tasks/task-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ClipboardList, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function MyTasksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const tasks = await prisma.task.findMany({
    where: { posterId: user.id },
    orderBy: { createdAt: "desc" },
    include: { assignedTo: true },
  });

  const openTasks = tasks.filter((t) => t.status === "OPEN");
  const activeTasks = tasks.filter((t) => ["ASSIGNED", "IN_PROGRESS"].includes(t.status));
  const reviewTasks = tasks.filter((t) => t.status === "REVIEW");
  const doneTasks = tasks.filter((t) => ["COMPLETE", "CANCELLED"].includes(t.status));

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="My Tasks" />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-100">Tasks You Posted</h2>
          <Button asChild>
            <Link href="/tasks/new">
              <PlusCircle className="h-4 w-4" />
              New Task
            </Link>
          </Button>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            heading="No tasks posted yet"
            subtext="Send your first task and get matched with the right worker."
            ctaLabel="Send a Task"
            ctaHref="/tasks/new"
          />
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-4 flex-wrap h-auto gap-1">
              <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
              <TabsTrigger value="open">Open ({openTasks.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
              <TabsTrigger value="review">Review ({reviewTasks.length})</TabsTrigger>
              <TabsTrigger value="done">Done ({doneTasks.length})</TabsTrigger>
            </TabsList>

            {[
              { value: "all", items: tasks },
              { value: "open", items: openTasks },
              { value: "active", items: activeTasks },
              { value: "review", items: reviewTasks },
              { value: "done", items: doneTasks },
            ].map(({ value, items }) => (
              <TabsContent key={value} value={value}>
                {items.length === 0 ? (
                  <p className="text-center text-sm text-zinc-500 py-8">No tasks in this category.</p>
                ) : (
                  <div className="space-y-2">
                    {items.map((task) => (
                      <TaskListItem key={task.id} task={task} role="poster" />
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
