'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);

  return (
    <main className="container mx-auto max-w-xl p-6 md:p-8">
      <Card className="border-destructive">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden />
          <CardTitle className="text-destructive">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            An unexpected error occurred while rendering this page. You can try again, refresh the
            browser, or reset state with the button below.
          </p>
          {error.digest ? (
            <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
          ) : null}
          <Button onClick={reset}>Try again</Button>
        </CardContent>
      </Card>
    </main>
  );
}
