import type { AnalyzeResponse } from '@/types/analyze';

export type CheckStatus = 'pass' | 'warn' | 'fail';

export type CheckCategory = 'seo' | 'openGraph' | 'twitter' | 'structuredData';

export interface Check {
  id: string;
  category: CheckCategory;
  label: string;
  status: CheckStatus;
  message: string | null;
  weight: number;
}

export interface CategoryCounts {
  pass: number;
  warn: number;
  fail: number;
}

export interface CategoryScore {
  category: CheckCategory;
  label: string;
  score: number;
  checks: Check[];
  counts: CategoryCounts;
}

export type OverallStatus = 'excellent' | 'good' | 'needsWork' | 'poor';

export interface ScoreReport {
  total: number;
  status: OverallStatus;
  categories: CategoryScore[];
  counts: CategoryCounts;
}

const CATEGORY_WEIGHTS: Record<CheckCategory, number> = {
  seo: 40,
  openGraph: 30,
  twitter: 20,
  structuredData: 10,
};

const CATEGORY_LABELS: Record<CheckCategory, string> = {
  seo: 'SEO',
  openGraph: 'Open Graph',
  twitter: 'Twitter / X',
  structuredData: 'Structured Data',
};

function statusFactor(status: CheckStatus): number {
  if (status === 'pass') return 1;
  if (status === 'warn') return 0.5;
  return 0;
}

function lengthCheck(
  id: string,
  category: CheckCategory,
  label: string,
  value: string | null,
  weight: number,
  min: number,
  max: number,
  missingMessage: string,
): Check {
  if (!value) {
    return { id, category, label, status: 'fail', message: missingMessage, weight };
  }
  const len = value.length;
  const range = `ideal ${min}–${max}`;
  if (len >= min && len <= max) {
    return { id, category, label, status: 'pass', message: `${len} characters (${range})`, weight };
  }
  return { id, category, label, status: 'warn', message: `${len} characters (${range})`, weight };
}

function presenceCheck(
  id: string,
  category: CheckCategory,
  label: string,
  value: string | null,
  weight: number,
  missingMessage: string,
): Check {
  return {
    id,
    category,
    label,
    status: value ? 'pass' : 'fail',
    message: value ?? missingMessage,
    weight,
  };
}

function buildSeoChecks(data: AnalyzeResponse): Check[] {
  const { general, headings, images } = data;
  const checks: Check[] = [];

  checks.push(
    lengthCheck(
      'seo.title',
      'seo',
      'Page title',
      general.title,
      4,
      30,
      60,
      'Missing <title> tag',
    ),
  );

  checks.push(
    lengthCheck(
      'seo.description',
      'seo',
      'Meta description',
      general.description,
      4,
      120,
      160,
      'Missing <meta name="description">',
    ),
  );

  checks.push(
    presenceCheck(
      'seo.canonical',
      'seo',
      'Canonical URL',
      general.canonical,
      2,
      'No <link rel="canonical"> found',
    ),
  );

  checks.push(
    presenceCheck('seo.lang', 'seo', 'Language attribute', general.lang, 1, 'Missing <html lang>'),
  );

  checks.push(
    presenceCheck(
      'seo.viewport',
      'seo',
      'Viewport meta tag',
      general.viewport,
      1,
      'Missing <meta name="viewport">',
    ),
  );

  checks.push(
    presenceCheck(
      'seo.favicon',
      'seo',
      'Favicon',
      general.favicon,
      1,
      'No <link rel="icon"> or fallback',
    ),
  );

  const h1Count = headings.h1.length;
  if (h1Count === 1) {
    checks.push({
      id: 'seo.h1',
      category: 'seo',
      label: 'Single H1 heading',
      status: 'pass',
      message: '1 H1 found',
      weight: 2,
    });
  } else if (h1Count > 1) {
    checks.push({
      id: 'seo.h1',
      category: 'seo',
      label: 'Single H1 heading',
      status: 'warn',
      message: `${h1Count} H1s found (recommend 1 per page)`,
      weight: 2,
    });
  } else {
    checks.push({
      id: 'seo.h1',
      category: 'seo',
      label: 'Single H1 heading',
      status: 'fail',
      message: 'No H1 heading found',
      weight: 2,
    });
  }

  if (images.total === 0) {
    checks.push({
      id: 'seo.alt',
      category: 'seo',
      label: 'Image alt coverage',
      status: 'pass',
      message: 'No images on page',
      weight: 2,
    });
  } else {
    const coverage = 1 - images.withoutAlt / images.total;
    const pct = Math.round(coverage * 100);
    let status: CheckStatus;
    if (coverage >= 0.9) status = 'pass';
    else if (coverage >= 0.5) status = 'warn';
    else status = 'fail';
    checks.push({
      id: 'seo.alt',
      category: 'seo',
      label: 'Image alt coverage',
      status,
      message: `${pct}% of ${images.total} images have alt text (${images.withoutAlt} missing)`,
      weight: 2,
    });
  }

  return checks;
}

function buildOgChecks(data: AnalyzeResponse): Check[] {
  const { openGraph } = data;
  return [
    presenceCheck('og.title', 'openGraph', 'og:title', openGraph.title, 3, 'Missing og:title'),
    presenceCheck(
      'og.description',
      'openGraph',
      'og:description',
      openGraph.description,
      2,
      'Missing og:description',
    ),
    presenceCheck(
      'og.image',
      'openGraph',
      'og:image',
      openGraph.image,
      3,
      'Missing og:image — Facebook and LinkedIn will show no preview image',
    ),
    presenceCheck('og.url', 'openGraph', 'og:url', openGraph.url, 1, 'Missing og:url'),
    presenceCheck('og.type', 'openGraph', 'og:type', openGraph.type, 1, 'Missing og:type'),
    presenceCheck(
      'og.siteName',
      'openGraph',
      'og:site_name',
      openGraph.siteName,
      1,
      'Missing og:site_name',
    ),
  ];
}

function buildTwitterChecks(data: AnalyzeResponse): Check[] {
  const { twitter } = data;
  return [
    presenceCheck(
      'tw.card',
      'twitter',
      'twitter:card',
      twitter.card,
      2,
      'Missing twitter:card (Twitter will infer from Open Graph)',
    ),
    presenceCheck(
      'tw.title',
      'twitter',
      'twitter:title',
      twitter.title,
      2,
      'Missing (will fall back to og:title)',
    ),
    presenceCheck(
      'tw.description',
      'twitter',
      'twitter:description',
      twitter.description,
      2,
      'Missing (will fall back to og:description)',
    ),
    presenceCheck(
      'tw.image',
      'twitter',
      'twitter:image',
      twitter.image,
      2,
      'Missing (will fall back to og:image)',
    ),
  ];
}

function buildSdChecks(data: AnalyzeResponse): Check[] {
  const count = data.structuredData.length;
  return [
    {
      id: 'sd.jsonld',
      category: 'structuredData',
      label: 'JSON-LD structured data',
      status: count > 0 ? 'pass' : 'fail',
      message:
        count > 0
          ? `${count} JSON-LD block${count > 1 ? 's' : ''} found`
          : 'No JSON-LD blocks — rich snippets not available',
      weight: 3,
    },
  ];
}

function buildCategoryScore(category: CheckCategory, checks: Check[]): CategoryScore {
  const totalWeight = checks.reduce((acc, c) => acc + c.weight, 0);
  const earned = checks.reduce((acc, c) => acc + c.weight * statusFactor(c.status), 0);
  const score = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);
  const counts: CategoryCounts = { pass: 0, warn: 0, fail: 0 };
  for (const check of checks) {
    counts[check.status] += 1;
  }
  return {
    category,
    label: CATEGORY_LABELS[category],
    score,
    checks,
    counts,
  };
}

function overallStatus(total: number): OverallStatus {
  if (total >= 90) return 'excellent';
  if (total >= 70) return 'good';
  if (total >= 50) return 'needsWork';
  return 'poor';
}

export function scoreAnalysis(data: AnalyzeResponse): ScoreReport {
  const categories: CategoryScore[] = [
    buildCategoryScore('seo', buildSeoChecks(data)),
    buildCategoryScore('openGraph', buildOgChecks(data)),
    buildCategoryScore('twitter', buildTwitterChecks(data)),
    buildCategoryScore('structuredData', buildSdChecks(data)),
  ];
  const weightedSum = categories.reduce(
    (acc, cat) => acc + cat.score * CATEGORY_WEIGHTS[cat.category],
    0,
  );
  const weightDivisor = Object.values(CATEGORY_WEIGHTS).reduce((a, b) => a + b, 0);
  const total = Math.round(weightedSum / weightDivisor);

  const counts: CategoryCounts = { pass: 0, warn: 0, fail: 0 };
  for (const cat of categories) {
    counts.pass += cat.counts.pass;
    counts.warn += cat.counts.warn;
    counts.fail += cat.counts.fail;
  }

  return { total, status: overallStatus(total), categories, counts };
}
