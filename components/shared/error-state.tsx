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
        "flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center",
        className
      )}
      role="alert"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-red-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-red-700">{message}</p>
    </div>
  );
}
