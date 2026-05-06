import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList } from "lucide-react";

export default async function TasksPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Topbar heading="Tasks" />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-6">
          <div className="rounded-full bg-zinc-900 border border-zinc-800 p-5">
            <ClipboardList className="h-10 w-10 text-zinc-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Tasks are assigned by our team</h2>
            <p className="text-sm text-zinc-500 max-w-md">
              Tasks are not publicly listed. Once you sign up, our team will match you with
              suitable work and notify you when you&apos;re assigned.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="ghost">
              <Link href="/my-work">View My Work</Link>
            </Button>
            <Button asChild>
              <Link href="/tasks/new">
                <PlusCircle className="h-4 w-4" />
                Send a Task
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
