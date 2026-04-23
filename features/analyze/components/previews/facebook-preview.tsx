'use client';

import * as React from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  extractHostname,
  truncate,
} from '@/features/analyze/lib/preview-helpers';
import type { AnalyzeResponse } from '@/types/analyze';
import { MissingField } from './missing-field';

const TITLE_MAX = 90;
const DESCRIPTION_MAX = 200;

interface FacebookPreviewProps {
  data: AnalyzeResponse;
  className?: string;
}

export function FacebookPreview({ data, className }: FacebookPreviewProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  const imageUrl = data.openGraph.image;
  const siteName = data.openGraph.siteName ?? extractHostname(data.url.final);
  const domain = siteName.toUpperCase();
  const title = truncate(data.openGraph.title ?? data.general.title, TITLE_MAX);
  const description = truncate(
    data.openGraph.description ?? data.general.description,
    DESCRIPTION_MAX,
  );

  return (
    <div
      className={cn('overflow-hidden rounded-lg border bg-white font-sans', className)}
      style={{ borderColor: '#dddfe2' }}
    >
      <div
        className="relative aspect-[1.91/1] w-full overflow-hidden"
        style={{ backgroundColor: '#f0f2f5' }}
      >
        {imageUrl && !imageFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2"
            style={{ color: '#8d949e' }}
          >
            <ImageOff className="h-8 w-8" aria-hidden />
            <span className="text-xs font-medium">
              {imageUrl ? 'og:image failed to load' : 'No og:image provided'}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1 p-3" style={{ backgroundColor: '#f2f3f5' }}>
        <div
          className="text-xs tracking-wider uppercase"
          style={{ color: '#8d949e' }}
        >
          {domain}
        </div>

        {title ? (
          <h3
            className="text-base leading-tight font-semibold"
            style={{ color: '#1c1e21' }}
          >
            {title}
          </h3>
        ) : (
          <MissingField label="No og:title" />
        )}

        {description ? (
          <p
            className="text-sm leading-snug"
            style={{ color: '#606770' }}
          >
            {description}
          </p>
        ) : (
          <MissingField label="No og:description" />
        )}
      </div>
    </div>
  );
}
