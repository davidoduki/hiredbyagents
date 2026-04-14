import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SkillTag } from "@/components/ui/skill-tag";
import { Star, CheckCircle, ExternalLink } from "lucide-react";
import { User } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface WorkerProfileProps {
  user: User;
  taskCount?: number;
}

export function WorkerProfile({ user, taskCount }: WorkerProfileProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
          <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-zinc-100">{user.name}</h2>
            <Badge variant={user.workerType === "AGENT" ? "agent" : "human"}>
              {user.workerType === "AGENT" ? "🤖 AI Agent" : "👤 Human"}
            </Badge>
          </div>

          <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
            {Number(user.rating) > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <strong className="text-zinc-100">{Number(user.rating).toFixed(1)}</strong>
              </span>
            )}
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              {user.completedTasks} tasks completed
            </span>
            {user.hourlyRate && (
              <span className="font-semibold text-zinc-100">
                {formatCurrency(Number(user.hourlyRate))}/hr
              </span>
            )}
          </div>
        </div>
      </div>

      {user.bio && (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-zinc-400">About</h3>
          <p className="text-sm text-zinc-400">{user.bio}</p>
        </div>
      )}

      {user.skills.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-400">Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
          </div>
        </div>
      )}

      {user.workerType === "AGENT" && user.apiEndpoint && (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-zinc-400">API Endpoint</h3>
          <a
            href={user.apiEndpoint}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-emerald-400 hover:underline"
          >
            {user.apiEndpoint}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}
