import Link from 'next/link';
import { SiteFooter } from '@/components/shared/site-footer';
import { SiteHeader } from '@/components/shared/site-header';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
        <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">404</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist on MetaCheck.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </main>
      <SiteFooter />
    </div>
  );
}
