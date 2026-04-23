import { checkUrlAllowed } from '@/lib/ssrf-guard';

const MAX_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 8_000;
const MAX_REDIRECTS = 5;
const USER_AGENT = 'MetaCheckBot/1.0 (+https://github.com/cesarcortes-dep/MetaCheck)';

export type FetchHtmlErrorCode =
  | 'TIMEOUT'
  | 'FETCH_FAILED'
  | 'NOT_HTML'
  | 'TOO_LARGE'
  | 'BLOCKED_HOST';

export type FetchHtmlResult =
  | { ok: true; html: string; finalUrl: string; statusCode: number }
  | { ok: false; code: FetchHtmlErrorCode; message: string; statusCode?: number };

export async function fetchHtml(initialUrl: string): Promise<FetchHtmlResult> {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let currentUrl = initialUrl;

  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      let parsed: URL;
      try {
        parsed = new URL(currentUrl);
      } catch {
        return { ok: false, code: 'FETCH_FAILED', message: 'Invalid URL encountered' };
      }

      const guard = await checkUrlAllowed(parsed);
      if (!guard.ok) {
        return { ok: false, code: 'BLOCKED_HOST', message: guard.reason };
      }

      const response = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en,es;q=0.9',
        },
        signal: controller.signal,
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) {
          return {
            ok: false,
            code: 'FETCH_FAILED',
            message: `Redirect without Location header (status ${response.status})`,
            statusCode: response.status,
          };
        }
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }

      if (!response.ok) {
        return {
          ok: false,
          code: 'FETCH_FAILED',
          message: `HTTP ${response.status} ${response.statusText}`,
          statusCode: response.status,
        };
      }

      const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
      if (!contentType.includes('html')) {
        return {
          ok: false,
          code: 'NOT_HTML',
          message: `Response is not HTML (content-type: ${contentType || 'unknown'})`,
          statusCode: response.status,
        };
      }

      const contentLengthHeader = response.headers.get('content-length');
      if (contentLengthHeader !== null) {
        const contentLength = Number(contentLengthHeader);
        if (Number.isFinite(contentLength) && contentLength > MAX_BYTES) {
          return {
            ok: false,
            code: 'TOO_LARGE',
            message: `Response too large (${contentLength} bytes, max ${MAX_BYTES})`,
            statusCode: response.status,
          };
        }
      }

      if (!response.body) {
        return {
          ok: false,
          code: 'FETCH_FAILED',
          message: 'Empty response body',
          statusCode: response.status,
        };
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let received = 0;
      let html = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > MAX_BYTES) {
          await reader.cancel();
          return {
            ok: false,
            code: 'TOO_LARGE',
            message: `Response exceeded ${MAX_BYTES} bytes`,
            statusCode: response.status,
          };
        }
        html += decoder.decode(value, { stream: true });
      }
      html += decoder.decode();

      return { ok: true, html, finalUrl: currentUrl, statusCode: response.status };
    }

    return {
      ok: false,
      code: 'FETCH_FAILED',
      message: `Too many redirects (> ${MAX_REDIRECTS})`,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { ok: false, code: 'TIMEOUT', message: `Request timed out after ${TIMEOUT_MS}ms` };
    }
    return {
      ok: false,
      code: 'FETCH_FAILED',
      message: err instanceof Error ? err.message : 'Unknown fetch error',
    };
  } finally {
    clearTimeout(timeoutHandle);
  }
}
