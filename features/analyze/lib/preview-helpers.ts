export function truncate(text: string | null | undefined, maxChars: number): string | null {
  if (text === null || text === undefined) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (trimmed.length <= maxChars) return trimmed;

  const sliced = trimmed.slice(0, maxChars - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const cut = lastSpace > maxChars * 0.7 ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.trimEnd()}…`;
}

export function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, '');
  } catch {
    return url;
  }
}

export function displayUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, '');
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return host;
    return `${host} › ${segments.join(' › ')}`;
  } catch {
    return url;
  }
}
