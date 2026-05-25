import { cn } from "@/lib/utils";
import { getAccessCountdown } from "@/lib/operations/access-request-ops";

export function CountdownBadge({ accessDate }: { accessDate: string }) {
  const { label, tone } = getAccessCountdown(accessDate);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        tone === "expired" && "bg-red-100 text-red-800",
        tone === "critical" && "bg-orange-100 text-orange-900 animate-pulse",
        tone === "soon" && "bg-amber-100 text-amber-900",
        tone === "normal" && "bg-slate-100 text-slate-600"
      )}
    >
      {label}
    </span>
  );
}
