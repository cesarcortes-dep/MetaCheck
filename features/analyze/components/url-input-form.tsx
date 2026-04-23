'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnalyze } from '@/context/analyze-context';
import { normalizeUrl } from '@/lib/normalize-url';

export function UrlInputForm() {
  const { state, analyze } = useAnalyze();
  const [value, setValue] = React.useState('');
  const [clientError, setClientError] = React.useState<string | null>(null);

  const isLoading = state.status === 'loading';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = normalizeUrl(value);
    if (!result.ok) {
      setClientError(result.reason);
      return;
    }
    setClientError(null);
    void analyze(result.url);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (clientError) setClientError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <label htmlFor="analyze-url" className="sr-only">
        URL to analyze
      </label>
      <div className="flex gap-2">
        <Input
          id="analyze-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          autoCapitalize="none"
          placeholder="https://example.com"
          value={value}
          onChange={handleChange}
          error={clientError !== null}
          disabled={isLoading}
          aria-describedby={clientError ? 'analyze-url-error' : undefined}
        />
        <Button type="submit" loading={isLoading} disabled={isLoading || !value.trim()}>
          {isLoading ? 'Analyzing…' : 'Analyze'}
        </Button>
      </div>
      {clientError ? (
        <p id="analyze-url-error" role="alert" className="text-sm text-destructive">
          {clientError}
        </p>
      ) : null}
    </form>
  );
}
