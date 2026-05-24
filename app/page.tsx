import {
  PageShell,
  SiteHeader,
  SiteFooter,
  StickyMobileCTA,
} from "@/components/layout/page-shell";
import {
  LandingHero,
  HowItWorks,
  TrustSection,
  FAQSection,
} from "@/components/landing/sections";
import { VillageCarousel } from "@/components/landing/village-carousel";

export default function HomePage() {
  return (
    <PageShell dark>
      <SiteHeader dark />
      <main className="pb-28 sm:pb-0">
        <LandingHero />
        <VillageCarousel />
        <HowItWorks />
        <TrustSection />
        <FAQSection />
      </main>
      <SiteFooter />
      <StickyMobileCTA
        primaryHref="/request-access"
        primaryLabel="Request Access"
        secondaryHref="/become-provider"
        secondaryLabel="Become a Provider"
      />
    </PageShell>
  );
}
