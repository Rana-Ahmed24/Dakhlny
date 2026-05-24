import {
  PageShell,
  SiteHeader,
  SiteFooter,
  StickyMobileCTA,
} from "@/components/layout/page-shell";
import {
  LandingHero,
  HowItWorks,
  VillagesSection,
  TrustSection,
  FAQSection,
} from "@/components/landing/sections";

export default function HomePage() {
  return (
    <PageShell>
      <SiteHeader dark />
      <main className="pb-24 sm:pb-0">
        <LandingHero />
        <HowItWorks />
        <VillagesSection />
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
