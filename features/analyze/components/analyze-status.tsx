'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useAnalyze } from '@/context/analyze-context';
import { AnalyzeResult } from './analyze-result';

export function AnalyzeStatus() {
  const { state } = useAnalyze();

  if (state.status === 'idle') return null;

  if (state.status === 'loading') {
    return (
      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <Spinner />
          <CardTitle className="text-base font-medium break-all">
            Analyzing {state.requestedUrl}…
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (state.status === 'error') {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            {state.error.code.replace(/_/g, ' ')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>{state.error.message}</p>
          <p className="break-all text-muted-foreground">URL: {state.requestedUrl}</p>
        </CardContent>
      </Card>
    );
  }

  return <AnalyzeResult data={state.data} />;
}
