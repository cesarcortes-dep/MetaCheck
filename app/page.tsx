import { SiteFooter } from '@/components/shared/site-footer';
import { SiteHeader } from '@/components/shared/site-header';
import { AnalyzeStatus } from '@/features/analyze/components/analyze-status';
import { CtaBanner } from '@/features/landing/components/cta-banner';
import { FeaturesSection } from '@/features/landing/components/features-section';
import { Hero } from '@/features/landing/components/hero';
import { HowItWorks } from '@/features/landing/components/how-it-works';

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
      <SiteHeader />

      <main className="flex-1">
        <Hero />

        <div className="mx-auto max-w-3xl pt-2">
          <AnalyzeStatus />
        </div>

        <FeaturesSection />
        <HowItWorks />
        <CtaBanner />
      </main>

      <SiteFooter />
    </div>
  );
}
