import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Topbar } from "@/components/layout/topbar";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [task, user] = await Promise.all([
    prisma.task.findUnique({ where: { id } }),
    getCurrentUser(),
  ]);

  if (!task) notFound();
  if (!user || task.posterId !== user.id) redirect(`/tasks/${id}`);
  if (task.status !== "OPEN") redirect(`/tasks/${id}`);

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Edit Task" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Task editing form — coming soon.</p>
        </div>
      </div>
    </div>
  );
}
