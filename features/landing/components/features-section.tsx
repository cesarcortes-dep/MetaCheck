import { Download, Eye, Lock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureItem {
  icon: typeof Eye;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: Eye,
    title: 'Four faithful previews',
    description:
      'Renders of the Google SERP snippet, Facebook share card, Twitter / X card, and LinkedIn feed card — styled the way each platform actually shows them.',
  },
  {
    icon: Sparkles,
    title: 'Technical score',
    description:
      'Every meta tag checked against best practices. A 0–100 score across SEO, Open Graph, Twitter, and Structured Data, with a fix-it checklist.',
  },
  {
    icon: Download,
    title: 'Downloadable PDF report',
    description:
      'Ship the audit to a client or stakeholder — the same score and checklist, formatted for print or email. One click, no account.',
  },
  {
    icon: Lock,
    title: 'No signup, no tracking',
    description:
      'Analysis runs on our server, results render in your browser. We store nothing between requests. Rate-limited on the public endpoint.',
  },
];

export function FeaturesSection() {
  return (
    <section className="space-y-6 py-10">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What you get</h2>
        <p className="text-sm text-muted-foreground">
          Everything in the MVP — no paid tiers, no hidden limits.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader className="space-y-2 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <CardTitle className="text-base leading-tight">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
