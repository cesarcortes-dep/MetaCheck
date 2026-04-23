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

const TITLE_MAX = 100;

interface LinkedInPreviewProps {
  data: AnalyzeResponse;
  className?: string;
}

export function LinkedInPreview({ data, className }: LinkedInPreviewProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  const imageUrl = data.openGraph.image;
  const title = truncate(data.openGraph.title ?? data.general.title, TITLE_MAX);
  const hostname = extractHostname(data.url.final);

  return (
    <div
      className={cn('overflow-hidden rounded-md border bg-white font-sans', className)}
      style={{ borderColor: '#e0e0e0' }}
    >
      <div
        className="relative aspect-[1.91/1] w-full overflow-hidden"
        style={{ backgroundColor: '#eef3f8' }}
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
            style={{ color: 'rgba(0, 0, 0, 0.6)' }}
          >
            <ImageOff className="h-8 w-8" aria-hidden />
            <span className="text-xs font-medium">
              {imageUrl ? 'og:image failed to load' : 'No og:image provided'}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-0.5 border-t px-3 py-2.5" style={{ borderColor: '#e0e0e0' }}>
        {title ? (
          <h3
            className="line-clamp-2 text-[15px] leading-snug font-semibold"
            style={{ color: 'rgba(0, 0, 0, 0.9)' }}
          >
            {title}
          </h3>
        ) : (
          <MissingField label="No og:title (falls back to <title>)" />
        )}
        <div
          className="truncate text-xs"
          style={{ color: 'rgba(0, 0, 0, 0.6)' }}
        >
          {hostname}
        </div>
      </div>
    </div>
  );
}
