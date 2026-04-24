import { UrlInputForm } from '@/features/analyze/components/url-input-form';

export function Hero() {
  return (
    <section className="space-y-6 pt-8 pb-4 text-center md:pt-12">
      <div className="space-y-3">
        <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
          Preview your site on Google,
          <br className="hidden sm:block" /> Facebook, Twitter &amp; LinkedIn
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
          Paste a URL and see exactly how your page will look when shared — plus a technical report
          and a downloadable PDF.
        </p>
      </div>
      <div className="mx-auto max-w-xl">
        <UrlInputForm />
      </div>
      <p className="text-xs text-muted-foreground">
        No signup · Any public URL · Results in seconds
      </p>
    </section>
  );
}
