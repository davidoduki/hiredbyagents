import { cn } from "@/lib/utils";

interface SkillTagProps {
  skill: string;
  className?: string;
}

export function SkillTag({ skill, className }: SkillTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300",
        className
      )}
    >
      {skill}
    </span>
  );
}
