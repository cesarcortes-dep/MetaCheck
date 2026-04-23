export type NormalizeUrlResult = { ok: true; url: string } | { ok: false; reason: string };

export function normalizeUrl(raw: string): NormalizeUrlResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: 'Please enter a URL' };

  let candidate = trimmed;
  if (candidate.startsWith('//')) {
    candidate = `https:${candidate}`;
  } else if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, reason: "That doesn't look like a valid URL" };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, reason: 'Only http and https URLs are supported' };
  }

  if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
    return { ok: false, reason: 'URL must include a valid domain' };
  }

  return { ok: true, url: parsed.toString() };
}
