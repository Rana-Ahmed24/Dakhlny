import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export function LoadingSpinner({ className, label }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-20",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand-muted">
        <Loader2 className="h-6 w-6 animate-spin text-ocean" />
      </div>
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </p>
      ) : null}
    </div>
  );
}
