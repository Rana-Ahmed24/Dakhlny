import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-border/80 bg-white/60 px-6 py-20 text-center backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sand-muted">
        <Inbox className="h-7 w-7 text-ocean/60" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-2xl font-light text-navy">{title}</h3>
      {description ? (
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
