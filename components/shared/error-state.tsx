import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[1.75rem] border border-red-200/80 bg-red-50/80 px-6 py-16 text-center backdrop-blur-sm",
        className
      )}
      role="alert"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
        <AlertCircle className="h-7 w-7 text-red-600" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold tracking-[-0.02em] text-red-900 sm:text-xl">
        {title}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-red-700">{message}</p>
    </div>
  );
}
