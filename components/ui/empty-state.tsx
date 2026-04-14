import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  subtext: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ icon: Icon, heading, subtext, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-zinc-800 p-4">
        <Icon className="h-8 w-8 text-zinc-500" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-zinc-100">{heading}</h3>
      <p className="mb-6 max-w-sm text-sm text-zinc-500">{subtext}</p>
      {ctaLabel && ctaHref && (
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
