import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Header: compact logo + brand name (single row, flex) */
export function BrandMark({
  overlay = false,
  priority = false,
}: {
  overlay?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className="inline-flex min-h-0 items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3"
      aria-label={`${SITE_NAME} home`}
    >
      <BrandLogo
        variant="compact"
        priority={priority}
        onDark={overlay}
        className="size-10 sm:size-12"
      />
      <span
        className={cn(
          "font-display text-[1.125rem] font-semibold leading-none tracking-[-0.03em] sm:text-[1.25rem]",
          overlay ? "text-sand-light" : "text-navy"
        )}
      >
        {SITE_NAME}
      </span>
    </Link>
  );
}

/** Footer / onboarding — logo2.jpg */
export function BrandPresentation({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <BrandLogo
      variant="presentation"
      priority={priority}
      className={cn("h-14 w-[8.5rem] sm:h-16 sm:w-40", className)}
      imageClassName="object-contain object-left"
    />
  );
}
