import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Topbar } from "@/components/layout/topbar";
import { TaskCheckoutForm } from "@/components/tasks/task-checkout-form";

export default async function NewTaskPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Send a Task" />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-zinc-100">Send a Task</h2>
          <p className="text-sm text-zinc-500 mt-1">
            Select a tier, describe what you need, and pay securely. We dispatch a human immediately.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
          <TaskCheckoutForm />
        </div>
      </div>
    </div>
  );
}
