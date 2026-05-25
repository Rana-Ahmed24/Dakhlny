import Image from "next/image";
import { BRAND_LOGO_COMPACT, BRAND_LOGO_PRESENTATION } from "@/lib/brand";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "compact" | "presentation";

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  /** Light backdrop so dark navy logo.png reads on dark headers */
  onDark?: boolean;
}

export function BrandLogo({
  variant = "compact",
  className,
  imageClassName,
  priority = false,
  onDark = false,
}: BrandLogoProps) {
  const isCompact = variant === "compact";
  const src = isCompact ? BRAND_LOGO_COMPACT : BRAND_LOGO_PRESENTATION;

  if (isCompact) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden",
          onDark &&
            "rounded-full bg-white/95 p-0.5 ring-1 ring-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.2)]",
          className
        )}
      >
        <Image
          src={src}
          alt=""
          width={48}
          height={48}
          sizes="(max-width: 639px) 40px, 48px"
          priority={priority}
          unoptimized
          className={cn("size-full object-contain", imageClassName)}
          aria-hidden
        />
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
    >
      <Image
        src={src}
        alt={SITE_NAME}
        width={200}
        height={120}
        sizes="(max-width: 640px) 140px, 200px"
        priority={priority}
        unoptimized
        className={cn("h-full w-full object-contain object-left", imageClassName)}
      />
    </span>
  );
}
