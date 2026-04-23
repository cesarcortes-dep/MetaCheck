'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  displayUrl,
  truncate,
} from '@/features/analyze/lib/preview-helpers';
import type { AnalyzeResponse } from '@/types/analyze';
import { MissingField } from './missing-field';

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

interface GooglePreviewProps {
  data: AnalyzeResponse;
  className?: string;
}

export function GooglePreview({ data, className }: GooglePreviewProps) {
  const [faviconFailed, setFaviconFailed] = React.useState(false);

  const url = data.url.final;
  const breadcrumb = displayUrl(url);
  const title = truncate(data.general.title, TITLE_MAX);
  const description = truncate(data.general.description, DESCRIPTION_MAX);
  const faviconSrc = data.general.favicon;

  return (
    <div
      className={cn(
        'rounded-lg border bg-white p-6 font-sans shadow-sm',
        className,
      )}
      style={{ color: '#202124' }}
    >
      <div className="flex items-center gap-2 text-sm" style={{ color: '#5f6368' }}>
        {faviconSrc && !faviconFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={faviconSrc}
            alt=""
            className="h-4 w-4 rounded-full"
            onError={() => setFaviconFailed(true)}
          />
        ) : (
          <Globe className="h-4 w-4" aria-hidden />
        )}
        <span className="truncate">{breadcrumb}</span>
      </div>

      <div className="mt-1">
        {title ? (
          <h3
            className="cursor-pointer text-xl leading-tight font-normal hover:underline"
            style={{ color: '#1a0dab' }}
          >
            {title}
          </h3>
        ) : (
          <div className="flex h-6 items-center">
            <MissingField label="No <title> tag" />
          </div>
        )}
      </div>

      <div className="mt-1">
        {description ? (
          <p className="text-sm leading-snug" style={{ color: '#4d5156' }}>
            {description}
          </p>
        ) : (
          <MissingField label="No meta description" />
        )}
      </div>
    </div>
  );
}
