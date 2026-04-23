export type StructuredDataItem = Record<string, unknown>;

export interface AnalyzeRequest {
  url: string;
}

export interface AnalyzeUrlInfo {
  requested: string;
  final: string;
  statusCode: number;
}

export interface AnalyzeGeneral {
  title: string | null;
  description: string | null;
  canonical: string | null;
  favicon: string | null;
  charset: string | null;
  lang: string | null;
  viewport: string | null;
  robots: string | null;
}

export interface AnalyzeOpenGraph {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  type: string | null;
  siteName: string | null;
}

export interface AnalyzeTwitter {
  card: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  site: string | null;
  creator: string | null;
}

export interface AnalyzeHeadings {
  h1: string[];
  h2: string[];
}

export interface AnalyzeImages {
  total: number;
  withoutAlt: number;
  samples: string[];
}

export interface AnalyzeResponse {
  url: AnalyzeUrlInfo;
  general: AnalyzeGeneral;
  openGraph: AnalyzeOpenGraph;
  twitter: AnalyzeTwitter;
  structuredData: StructuredDataItem[];
  headings: AnalyzeHeadings;
  images: AnalyzeImages;
}

export const ANALYZE_ERROR_CODES = [
  'INVALID_URL',
  'BLOCKED_HOST',
  'FETCH_FAILED',
  'TIMEOUT',
  'NOT_HTML',
  'TOO_LARGE',
] as const;

export type AnalyzeErrorCode = (typeof ANALYZE_ERROR_CODES)[number];

export interface AnalyzeErrorResponse {
  error: {
    code: AnalyzeErrorCode;
    message: string;
  };
}
