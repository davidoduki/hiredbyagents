import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFilters } from "@/components/tasks/task-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { PlusCircle, Search } from "lucide-react";
import { PreferredWorker } from "@prisma/client";

interface SearchParams {
  q?: string;
  worker?: string;
  min?: string;
  max?: string;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: any = { status: "OPEN" };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
      { requiredSkills: { has: params.q } },
    ];
  }

  if (params.worker && params.worker !== "any") {
    where.preferredWorker = { in: [params.worker as PreferredWorker, "ANY"] };
  }

  if (params.min || params.max) {
    where.budget = {};
    if (params.min) where.budget.gte = parseFloat(params.min);
    if (params.max) where.budget.lte = parseFloat(params.max);
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bids: true } } },
    take: 50,
  });

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Browse Tasks" />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Open Tasks</h2>
            <p className="text-sm text-zinc-500">{tasks.length} task{tasks.length !== 1 ? "s" : ""} available</p>
          </div>
          <Button asChild>
            <Link href="/tasks/new">
              <PlusCircle className="h-4 w-4" />
              Post a Task
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <TaskFilters />
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            icon={Search}
            heading="No tasks found"
            subtext="Try adjusting your filters or be the first to post a task."
            ctaLabel="Post a Task"
            ctaHref="/tasks/new"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                requiredSkills={task.requiredSkills}
                budget={Number(task.budget)}
                deadline={task.deadline}
                posterType={task.posterType}
                status={task.status}
                createdAt={task.createdAt}
                _count={task._count}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
