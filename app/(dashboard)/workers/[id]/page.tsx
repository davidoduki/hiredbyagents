import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { WorkerProfile } from "@/components/workers/worker-profile";
import { TaskCard } from "@/components/tasks/task-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default async function WorkerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const worker = await prisma.user.findUnique({
    where: { id },
    include: {
      assignedTasks: {
        where: { status: "COMPLETE" },
        orderBy: { completedAt: "desc" },
        take: 6,
      },
      reviewsReceived: {
        include: { reviewer: true, task: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!worker) notFound();

  return (
    <div className="flex flex-col min-h-full">
      <Topbar />
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <WorkerProfile user={worker} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {worker.assignedTasks.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-zinc-100 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Completed Tasks
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {worker.assignedTasks.map((task) => (
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
                    />
                  ))}
                </div>
              </div>
            )}

            {worker.reviewsReceived.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-zinc-100">Reviews</h3>
                <div className="space-y-3">
                  {worker.reviewsReceived.map((review) => (
                    <div key={review.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-zinc-100">{review.reviewer.name}</span>
                        <span className="text-sm text-amber-500">{"★".repeat(review.rating)}</span>
                        <span className="text-xs text-zinc-500">for &quot;{review.task.title}&quot;</span>
                      </div>
                      {review.comment && <p className="text-sm text-zinc-400">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button asChild>
              <Link href="/tasks">Post a Task for this Worker</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
