import * as cheerio from 'cheerio';
import type {
  AnalyzeGeneral,
  AnalyzeHeadings,
  AnalyzeImages,
  AnalyzeOpenGraph,
  AnalyzeResponse,
  AnalyzeTwitter,
  StructuredDataItem,
} from '@/types/analyze';

type ParsedDocument = Omit<AnalyzeResponse, 'url'>;

const IMAGE_SAMPLE_LIMIT = 5;

export function parseHtml(html: string, finalUrl: string): ParsedDocument {
  const $ = cheerio.load(html);

  const resolveUrl = (maybeRelative: string | null): string | null => {
    if (!maybeRelative) return null;
    const trimmed = maybeRelative.trim();
    if (!trimmed) return null;
    try {
      return new URL(trimmed, finalUrl).toString();
    } catch {
      return trimmed;
    }
  };

  const metaContent = (selector: string): string | null => {
    const value = $(selector).first().attr('content');
    return value && value.trim() ? value.trim() : null;
  };

  const attrValue = (selector: string, name: string): string | null => {
    const value = $(selector).first().attr(name);
    return value && value.trim() ? value.trim() : null;
  };

  const title = ($('head > title').first().text() || '').trim() || null;

  const iconHref =
    attrValue('link[rel="icon"]', 'href') ??
    attrValue('link[rel="shortcut icon"]', 'href') ??
    attrValue('link[rel="apple-touch-icon"]', 'href');
  const favicon = resolveUrl(iconHref ?? '/favicon.ico');

  const structuredData: StructuredDataItem[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    if (!raw.trim()) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item && typeof item === 'object') {
            structuredData.push(item as StructuredDataItem);
          }
        }
      } else if (parsed && typeof parsed === 'object') {
        structuredData.push(parsed as StructuredDataItem);
      }
    } catch {
      // Ignore invalid JSON-LD blocks
    }
  });

  const h1: string[] = [];
  $('h1').each((_, el) => {
    const text = $(el).text().trim();
    if (text) h1.push(text);
  });
  const h2: string[] = [];
  $('h2').each((_, el) => {
    const text = $(el).text().trim();
    if (text) h2.push(text);
  });

  let imgTotal = 0;
  let imgWithoutAlt = 0;
  const samples: string[] = [];
  $('img').each((_, el) => {
    imgTotal += 1;
    const alt = $(el).attr('alt');
    if (alt === undefined || alt.trim() === '') {
      imgWithoutAlt += 1;
      if (samples.length < IMAGE_SAMPLE_LIMIT) {
        const src = $(el).attr('src');
        const resolved = resolveUrl(src ?? null);
        if (resolved) samples.push(resolved);
      }
    }
  });

  const general: AnalyzeGeneral = {
    title,
    description: metaContent('meta[name="description"]'),
    canonical: resolveUrl(attrValue('link[rel="canonical"]', 'href')),
    favicon,
    charset: attrValue('meta[charset]', 'charset'),
    lang: attrValue('html', 'lang'),
    viewport: metaContent('meta[name="viewport"]'),
    robots: metaContent('meta[name="robots"]'),
  };

  const openGraph: AnalyzeOpenGraph = {
    title: metaContent('meta[property="og:title"]'),
    description: metaContent('meta[property="og:description"]'),
    image: resolveUrl(metaContent('meta[property="og:image"]')),
    url: metaContent('meta[property="og:url"]'),
    type: metaContent('meta[property="og:type"]'),
    siteName: metaContent('meta[property="og:site_name"]'),
  };

  const twitter: AnalyzeTwitter = {
    card: metaContent('meta[name="twitter:card"]'),
    title: metaContent('meta[name="twitter:title"]'),
    description: metaContent('meta[name="twitter:description"]'),
    image: resolveUrl(metaContent('meta[name="twitter:image"]')),
    site: metaContent('meta[name="twitter:site"]'),
    creator: metaContent('meta[name="twitter:creator"]'),
  };

  const headings: AnalyzeHeadings = { h1, h2 };
  const images: AnalyzeImages = { total: imgTotal, withoutAlt: imgWithoutAlt, samples };

  return { general, openGraph, twitter, structuredData, headings, images };
}
