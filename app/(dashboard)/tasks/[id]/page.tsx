import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Topbar } from "@/components/layout/topbar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkillTag } from "@/components/ui/skill-tag";
import { BidForm } from "@/components/tasks/bid-form";
import { SubmitForm } from "@/components/tasks/submit-form";
import { TaskStatusTimeline } from "@/components/tasks/task-status-timeline";
import { formatCurrency, formatDate, timeAgo } from "@/lib/utils";
import { Calendar, DollarSign, Star } from "lucide-react";
import { approveSubmission, rejectSubmission, assignTask, openDispute } from "@/actions/tasks";
import Link from "next/link";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [task, currentUser] = await Promise.all([
    prisma.task.findUnique({
      where: { id },
      include: {
        poster: true,
        assignedTo: true,
        bids: { include: { worker: true }, orderBy: { createdAt: "asc" } },
        submissions: { include: { worker: true }, orderBy: { submittedAt: "desc" } },
        reviews: { include: { reviewer: true } },
        payment: true,
      },
    }),
    getCurrentUser(),
  ]);

  if (!task) notFound();

  const isPoster = currentUser?.id === task.posterId;
  const isWorker = currentUser?.id === task.assignedToId;
  const hasAlreadyBid = task.bids.some((b) => b.workerId === currentUser?.id);

  return (
    <div className="flex flex-col min-h-full">
      <Topbar />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <StatusBadge status={task.status} />
                <Badge variant={task.posterType === "AGENT" ? "agent" : "human"}>
                  {task.posterType === "AGENT" ? "🤖 AI Agent" : "👤 Human"} posted
                </Badge>
                <span className="text-xs text-zinc-600">{timeAgo(task.createdAt)}</span>
              </div>
              <h1 className="text-2xl font-bold text-zinc-100 mb-4">{task.title}</h1>

              {/* Timeline */}
              <TaskStatusTimeline status={task.status} />
            </div>

            {/* Description */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-base font-semibold text-zinc-100 mb-3">Description</h2>
              <p className="text-sm text-zinc-400 whitespace-pre-wrap">{task.description}</p>
            </div>

            {/* Skills */}
            {task.requiredSkills.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {task.requiredSkills.map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
              </div>
            )}

            {/* Bids (poster only) */}
            {isPoster && task.bids.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4">
                  Bids ({task.bids.length})
                </h2>
                <div className="space-y-4">
                  {task.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={bid.worker.avatarUrl ?? undefined} />
                        <AvatarFallback>{bid.worker.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 justify-between flex-wrap">
                          <div>
                            <span className="font-medium text-zinc-100 text-sm">{bid.worker.name}</span>
                            {Number(bid.worker.rating) > 0 && (
                              <span className="ml-2 text-xs text-zinc-500 inline-flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {Number(bid.worker.rating).toFixed(1)}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-zinc-100">
                            {formatCurrency(Number(bid.proposedRate) * 100)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-400">{bid.message}</p>
                        {task.status === "OPEN" && (
                          <form
                            action={async () => {
                              "use server";
                              await assignTask(task.id, bid.workerId);
                            }}
                          >
                            <Button size="sm" className="mt-2" type="submit">
                              Assign
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submissions */}
            {task.submissions.length > 0 && (isPoster || isWorker) && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4">Submissions</h2>
                <div className="space-y-4">
                  {task.submissions.map((sub) => (
                    <div key={sub.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-zinc-500">{formatDate(sub.submittedAt)}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          sub.status === "APPROVED" ? "bg-emerald-500/15 text-emerald-400" :
                          sub.status === "REJECTED" ? "bg-red-500/15 text-red-400" :
                          "bg-amber-500/15 text-amber-400"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap">{sub.content}</p>
                      {sub.notes && (
                        <p className="mt-2 text-xs text-zinc-500 italic">Notes: {sub.notes}</p>
                      )}
                      {sub.feedback && (
                        <div className="mt-2 rounded border-l-2 border-amber-500/50 pl-3 text-xs text-zinc-400">
                          Feedback: {sub.feedback}
                        </div>
                      )}

                      {isPoster && sub.status === "PENDING" && task.status === "REVIEW" && (
                        <div className="mt-3 flex gap-2">
                          <form
                            action={async () => {
                              "use server";
                              await approveSubmission(task.id, sub.id);
                            }}
                          >
                            <Button size="sm" variant="accent" type="submit">
                              Approve
                            </Button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await rejectSubmission(task.id, sub.id, "Please revise and resubmit.");
                            }}
                          >
                            <Button size="sm" variant="destructive" type="submit">
                              Request Changes
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {task.reviews.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4">Reviews</h2>
                <div className="space-y-3">
                  {task.reviews.map((review) => (
                    <div key={review.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-100">{review.reviewer.name}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-zinc-400">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Budget & Deadline */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <div>
                  <div className="text-xs text-zinc-500">Budget</div>
                  <div className="text-xl font-bold text-zinc-100">
                    {formatCurrency(Number(task.budget) * 100)}
                  </div>
                </div>
              </div>
              {task.deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-600" />
                  <div>
                    <div className="text-xs text-zinc-500">Deadline</div>
                    <div className="text-sm font-medium text-zinc-100">{formatDate(task.deadline)}</div>
                  </div>
                </div>
              )}
              <div className="text-xs text-zinc-500">
                Preferred: {task.preferredWorker === "ANY" ? "Any worker" : task.preferredWorker === "HUMAN" ? "Human" : "AI Agent"}
              </div>
            </div>

            {/* Actions */}
            {currentUser && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-2">
                {task.status === "OPEN" && !isPoster && !hasAlreadyBid && (
                  <BidForm taskId={task.id} taskBudget={Number(task.budget)} />
                )}
                {hasAlreadyBid && !isPoster && (
                  <p className="text-sm text-zinc-500 text-center">You&apos;ve already bid on this task.</p>
                )}
                {isWorker && (task.status === "ASSIGNED" || task.status === "IN_PROGRESS") && (
                  <SubmitForm taskId={task.id} />
                )}
                {(isPoster || isWorker) && !["COMPLETE", "CANCELLED", "DISPUTED"].includes(task.status) && (
                  <form
                    action={async () => {
                      "use server";
                      await openDispute(task.id);
                    }}
                  >
                    <Button variant="destructive" size="sm" className="w-full" type="submit">
                      Open Dispute
                    </Button>
                  </form>
                )}
                {isPoster && task.status === "OPEN" && (
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href={`/tasks/${task.id}/edit`}>Edit Task</Link>
                  </Button>
                )}
              </div>
            )}

            {/* Poster info */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">Posted by</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={task.poster.avatarUrl ?? undefined} />
                  <AvatarFallback>{task.poster.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/workers/${task.poster.id}`} className="font-medium text-sm text-zinc-100 hover:text-emerald-400">
                    {task.poster.name}
                  </Link>
                  {Number(task.poster.rating) > 0 && (
                    <div className="flex items-center gap-0.5 text-xs text-zinc-500">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {Number(task.poster.rating).toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assigned worker */}
            {task.assignedTo && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">Assigned to</h3>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={task.assignedTo.avatarUrl ?? undefined} />
                    <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link href={`/workers/${task.assignedTo.id}`} className="font-medium text-sm text-zinc-100 hover:text-emerald-400">
                    {task.assignedTo.name}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
