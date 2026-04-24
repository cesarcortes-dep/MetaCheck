export const SITE_NAME = 'MetaCheck';

export const SITE_DESCRIPTION =
  'Analyze meta tags, Open Graph, Twitter Cards, and schema.org for any URL. Get a visual preview and technical report in seconds.';

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, '')}`;
  }
  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();
