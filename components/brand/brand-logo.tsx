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

const SIZES: Record<
  BrandLogoVariant,
  { width: number; height: number; sizes: string }
> = {
  compact: { width: 44, height: 44, sizes: "44px" },
  presentation: {
    width: 200,
    height: 120,
    sizes: "(max-width: 640px) 140px, 200px",
  },
};

export function BrandLogo({
  variant = "compact",
  className,
  imageClassName,
  priority = false,
  onDark = false,
}: BrandLogoProps) {
  const src =
    variant === "compact" ? BRAND_LOGO_COMPACT : BRAND_LOGO_PRESENTATION;
  const { width, height, sizes } = SIZES[variant];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        variant === "compact" &&
          onDark &&
          "rounded-full bg-white/95 p-1 ring-1 ring-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      <Image
        src={src}
        alt={SITE_NAME}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized
        className={cn("h-full w-full object-contain", imageClassName)}
      />
    </span>
  );
}
