'use client';

import * as React from 'react';
import { analyzeUrl } from '@/services/analyze';
import type { AnalyzeErrorResponse, AnalyzeResponse } from '@/types/analyze';

export type AnalyzeState =
  | { status: 'idle' }
  | { status: 'loading'; requestedUrl: string }
  | { status: 'success'; data: AnalyzeResponse; requestedUrl: string }
  | { status: 'error'; error: AnalyzeErrorResponse['error']; requestedUrl: string };

interface AnalyzeContextValue {
  state: AnalyzeState;
  analyze: (url: string) => Promise<void>;
  reset: () => void;
}

const AnalyzeContext = React.createContext<AnalyzeContextValue | null>(null);

interface AnalyzeProviderProps {
  children: React.ReactNode;
}

export function AnalyzeProvider({ children }: AnalyzeProviderProps) {
  const [state, setState] = React.useState<AnalyzeState>({ status: 'idle' });
  const controllerRef = React.useRef<AbortController | null>(null);

  const analyze = React.useCallback(async (url: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState({ status: 'loading', requestedUrl: url });

    try {
      const result = await analyzeUrl(url, controller.signal);
      if (controller.signal.aborted) return;
      if (result.ok) {
        setState({ status: 'success', data: result.data, requestedUrl: url });
      } else {
        setState({ status: 'error', error: result.error, requestedUrl: url });
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setState({
        status: 'error',
        requestedUrl: url,
        error: {
          code: 'FETCH_FAILED',
          message: err instanceof Error ? err.message : 'Unknown error',
        },
      });
    }
  }, []);

  const reset = React.useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState({ status: 'idle' });
  }, []);

  React.useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    [],
  );

  const value = React.useMemo<AnalyzeContextValue>(
    () => ({ state, analyze, reset }),
    [state, analyze, reset],
  );

  return <AnalyzeContext.Provider value={value}>{children}</AnalyzeContext.Provider>;
}

export function useAnalyze(): AnalyzeContextValue {
  const ctx = React.useContext(AnalyzeContext);
  if (!ctx) throw new Error('useAnalyze must be used inside <AnalyzeProvider>');
  return ctx;
}
