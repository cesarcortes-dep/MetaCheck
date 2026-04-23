import { ThemeToggle } from '@/components/shared/theme-toggle';
import { AnalyzeStatus } from '@/features/analyze/components/analyze-status';
import { UrlInputForm } from '@/features/analyze/components/url-input-form';

export default function HomePage() {
  return (
    <main className="container mx-auto max-w-3xl space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-end">
        <ThemeToggle />
      </div>

      <header className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">MetaCheck</h1>
        <p className="text-muted-foreground">
          Paste any URL and see its meta tags through the eyes of Google, Facebook, Twitter, and
          LinkedIn.
        </p>
      </header>

      <UrlInputForm />
      <AnalyzeStatus />
    </main>
  );
}
