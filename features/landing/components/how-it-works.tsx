interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: '1',
    title: 'Paste your URL',
    description: 'Any public page — a homepage, a blog post, a product page. No account required.',
  },
  {
    number: '2',
    title: 'We read the HTML',
    description:
      'Server-side fetch, cheerio parser — no JavaScript executed on the target page. You see what Google, Facebook, and LinkedIn crawlers see.',
  },
  {
    number: '3',
    title: 'Compare, fix, share',
    description:
      'Live previews for each platform, a scored checklist of every meta tag, and a PDF you can download and send to a client.',
  },
];

export function HowItWorks() {
  return (
    <section className="space-y-6 py-10">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
        <p className="text-sm text-muted-foreground">
          Three steps, no setup. Same as what a crawler does when it discovers your page.
        </p>
      </div>
      <ol className="grid gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.number} className="space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {step.number}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
