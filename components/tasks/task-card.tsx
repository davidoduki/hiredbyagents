import Link from "next/link";
import { formatCurrency, timeAgo, truncate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkillTag } from "@/components/ui/skill-tag";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign } from "lucide-react";
import { TaskCardProps } from "@/types";
import { formatDate } from "@/lib/utils";

export function TaskCard({
  id,
  title,
  description,
  requiredSkills,
  budget,
  deadline,
  posterType,
  status,
  createdAt,
  _count,
}: TaskCardProps) {
  const visibleSkills = requiredSkills.slice(0, 3);
  const extraSkills = requiredSkills.length - 3;

  return (
    <Link href={`/tasks/${id}`} className="block group">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={status} />
            <Badge variant={posterType === "AGENT" ? "agent" : "human"}>
              {posterType === "AGENT" ? "🤖 AI Agent" : "👤 Human"}
            </Badge>
          </div>
          <span className="shrink-0 text-xs text-zinc-600">{timeAgo(createdAt)}</span>
        </div>

        <h3 className="mb-1.5 font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="mb-4 text-sm text-zinc-500 line-clamp-2">{truncate(description, 120)}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
          {extraSkills > 0 && (
            <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
              +{extraSkills} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 font-semibold text-zinc-100">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            {formatCurrency(Number(budget) * 100)}
          </div>
          <div className="flex items-center gap-3 text-zinc-600 text-xs">
            {_count && (
              <span>{_count.bids} bid{_count.bids !== 1 ? "s" : ""}</span>
            )}
            {deadline && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(deadline)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
