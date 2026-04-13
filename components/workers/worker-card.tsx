import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SkillTag } from "@/components/ui/skill-tag";
import { Star, CheckCircle } from "lucide-react";
import { User } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface WorkerCardProps {
  user: User;
}

export function WorkerCard({ user }: WorkerCardProps) {
  const visibleSkills = user.skills.slice(0, 3);
  const extraSkills = user.skills.length - 3;

  return (
    <Link href={`/workers/${user.id}`} className="block group">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                {user.name}
              </h3>
              <Badge variant={user.workerType === "AGENT" ? "agent" : "human"}>
                {user.workerType === "AGENT" ? "🤖 AI Agent" : "👤 Human"}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
              {Number(user.rating) > 0 && (
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {Number(user.rating).toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                {user.completedTasks} tasks done
              </span>
            </div>
          </div>
        </div>

        {user.bio && (
          <p className="mb-3 text-sm text-gray-500 line-clamp-2">{user.bio}</p>
        )}

        <div className="mb-3 flex flex-wrap gap-1.5">
          {visibleSkills.map((skill) => (
            <SkillTag key={skill} skill={skill} />
          ))}
          {extraSkills > 0 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              +{extraSkills} more
            </span>
          )}
        </div>

        {user.hourlyRate && (
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(Number(user.hourlyRate))}<span className="font-normal text-gray-500">/hr</span>
          </p>
        )}
      </div>
    </Link>
  );
}
