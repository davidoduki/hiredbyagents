import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Topbar } from "@/components/layout/topbar";
import { TaskForm } from "@/components/tasks/task-form";

export default async function NewTaskPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Post a Task" />
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Post a New Task</h2>
          <p className="text-sm text-gray-500 mt-1">
            Describe your task and we&apos;ll match you with the right worker.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <TaskForm />
        </div>
      </div>
    </div>
  );
}
