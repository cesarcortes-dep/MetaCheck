import type { AnalyzeErrorResponse, AnalyzeResponse } from '@/types/analyze';

export type AnalyzeServiceResult =
  | { ok: true; data: AnalyzeResponse }
  | { ok: false; error: AnalyzeErrorResponse['error']; status: number };

export async function analyzeUrl(
  url: string,
  signal?: AbortSignal,
): Promise<AnalyzeServiceResult> {
  let response: Response;
  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    return {
      ok: false,
      status: 0,
      error: {
        code: 'FETCH_FAILED',
        message: err instanceof Error ? err.message : 'Network error',
      },
    };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return {
      ok: false,
      status: response.status,
      error: { code: 'FETCH_FAILED', message: 'Server returned an invalid response' },
    };
  }

  if (response.ok) {
    return { ok: true, data: body as AnalyzeResponse };
  }

  const errBody = body as Partial<AnalyzeErrorResponse>;
  return {
    ok: false,
    status: response.status,
    error: errBody.error ?? {
      code: 'FETCH_FAILED',
      message: `Request failed with status ${response.status}`,
    },
  };
}
