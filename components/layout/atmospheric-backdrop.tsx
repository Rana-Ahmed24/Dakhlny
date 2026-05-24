import Image from "next/image";
import { SECTION_IMAGES } from "@/lib/visual-assets";

export function AtmosphericBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Image
        src={SECTION_IMAGES.formBackdrop}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cream/92 via-cream/88 to-cream/95" />
      <div className="film-grain absolute inset-0 opacity-[0.12]" />
    </div>
  );
}
