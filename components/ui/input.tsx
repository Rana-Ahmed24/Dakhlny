import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[3.25rem] w-full rounded-2xl border border-border/80 bg-white/90 px-4 py-2 text-base shadow-[inset_0_1px_2px_rgba(7,16,24,0.04)] transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 focus-visible:border-ocean/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/15 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
