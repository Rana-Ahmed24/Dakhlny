import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        pending: "border-transparent bg-amber-100 text-amber-800",
        contacted: "border-transparent bg-blue-100 text-blue-800",
        confirmed: "border-transparent bg-emerald-100 text-emerald-800",
        completed: "border-transparent bg-slate-100 text-slate-700",
        cancelled: "border-transparent bg-red-100 text-red-800",
        approved: "border-transparent bg-emerald-100 text-emerald-800",
        rejected: "border-transparent bg-red-100 text-red-800",
        active: "border-transparent bg-emerald-100 text-emerald-800",
        inactive: "border-transparent bg-slate-100 text-slate-600",
        failed: "border-transparent bg-red-100 text-red-800",
        paid: "border-transparent bg-emerald-100 text-emerald-800",
        partial: "border-transparent bg-amber-100 text-amber-800",
        refunded: "border-transparent bg-slate-100 text-slate-600",
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
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
