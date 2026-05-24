import {
  PageShell,
  SiteHeader,
  SiteFooter,
} from "@/components/layout/page-shell";
import { CinematicHero } from "@/components/landing/cinematic-hero";
import {
  HowItWorks,
  TrustSection,
  FAQSection,
} from "@/components/landing/sections";
import { VillageCarousel } from "@/components/landing/village-carousel";

export default function HomePage() {
  return (
    <PageShell dark className="bg-[#0a0f14]">
      <SiteHeader dark overlay />
      <main>
        <CinematicHero />
        <VillageCarousel />
        <HowItWorks />
        <TrustSection />
        <FAQSection />
      </main>
      <SiteFooter />
    </PageShell>
  );
}
