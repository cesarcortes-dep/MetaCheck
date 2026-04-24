import { ArrowRight, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LINKEDIN_URL =
  'https://www.linkedin.com/in/c%C3%A9sar-mateo-cort%C3%A9s-le%C3%B3n-b823a2206/';
const EMAIL = 'cesarcortes4@outlook.com';

export function CtaBanner() {
  return (
    <section className="my-10 rounded-xl border bg-muted/40 p-8 text-center md:p-10">
      <div className="mx-auto max-w-2xl space-y-3">
        <p className="text-xs font-semibold tracking-wider text-primary uppercase">Growing Lab</p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Want your site to look right everywhere?
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          MetaCheck finds the gaps. Growing Lab closes them — SEO, social presence, and the kind of
          marketing that actually converts, built for small businesses and freelancers. Let&apos;s
          talk.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Message on LinkedIn
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={`mailto:${EMAIL}`}>
            <Mail className="h-4 w-4" aria-hidden />
            cesarcortes4@outlook.com
          </a>
        </Button>
      </div>
    </section>
  );
}
