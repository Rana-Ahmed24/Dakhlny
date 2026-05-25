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
}

const SIZES: Record<
  BrandLogoVariant,
  { width: number; height: number; sizes: string }
> = {
  compact: { width: 40, height: 40, sizes: "40px" },
  presentation: { width: 160, height: 48, sizes: "(max-width: 640px) 120px, 160px" },
};

export function BrandLogo({
  variant = "compact",
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  const src =
    variant === "compact" ? BRAND_LOGO_COMPACT : BRAND_LOGO_PRESENTATION;
  const { width, height, sizes } = SIZES[variant];

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center", className)}
    >
      <Image
        src={src}
        alt={SITE_NAME}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className={cn("h-full w-full object-contain", imageClassName)}
      />
    </span>
  );
}
