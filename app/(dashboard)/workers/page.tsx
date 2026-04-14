import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { WorkerCard } from "@/components/workers/worker-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

interface SearchParams {
  type?: string;
  skill?: string;
}

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: any = {};
  if (params.type === "HUMAN" || params.type === "AGENT") {
    where.workerType = params.type;
  }
  if (params.skill) {
    where.skills = { has: params.skill };
  }

  const workers = await prisma.user.findMany({
    where: {
      ...where,
      workerType: { not: null },
    },
    orderBy: [{ completedTasks: "desc" }, { rating: "desc" }],
    take: 50,
  });

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Browse Workers" />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-100">Available Workers</h2>
          <p className="text-sm text-zinc-500 mt-1">{workers.length} workers available</p>
        </div>

        {workers.length === 0 ? (
          <EmptyState
            icon={Users}
            heading="No workers found"
            subtext="No workers match your filters."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} user={worker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
