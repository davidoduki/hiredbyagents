"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-zinc-100 text-zinc-900 hover:bg-white",
        ghost: "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white",
        accent: "bg-emerald-600 text-white hover:bg-emerald-500",
        link: "text-zinc-300 underline-offset-4 hover:underline hover:text-white min-h-0 px-0",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10 min-h-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
