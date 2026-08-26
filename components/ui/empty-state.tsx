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
      <div className="mb-5 rounded-full border border-white/[0.07] bg-zinc-900 p-5">
        <Icon className="h-8 w-8 text-zinc-600" />
      </div>
      <h3 className="font-display mb-2 text-lg font-bold text-zinc-100">{heading}</h3>
      <p className="mb-7 max-w-sm text-sm leading-relaxed text-zinc-500">{subtext}</p>
      {ctaLabel && ctaHref && (
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
