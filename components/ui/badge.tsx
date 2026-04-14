import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-zinc-800 text-zinc-300",
        outline: "border border-zinc-700 text-zinc-400",
        success: "bg-emerald-500/15 text-emerald-400",
        info: "bg-blue-500/15 text-blue-400",
        warning: "bg-amber-500/15 text-amber-400",
        destructive: "bg-red-500/15 text-red-400",
        agent: "bg-indigo-500/15 text-indigo-400",
        human: "bg-slate-700/50 text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
