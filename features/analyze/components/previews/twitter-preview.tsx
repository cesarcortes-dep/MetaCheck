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

const TITLE_MAX = 70;
const DESCRIPTION_MAX = 200;

const KNOWN_CARDS = new Set(['summary', 'summary_large_image', 'app', 'player']);

interface TwitterPreviewProps {
  data: AnalyzeResponse;
  className?: string;
}

export function TwitterPreview({ data, className }: TwitterPreviewProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  const rawCard = data.twitter.card?.toLowerCase().trim() ?? '';
  const cardType = KNOWN_CARDS.has(rawCard) ? rawCard : 'summary_large_image';
  const isLargeImage = cardType !== 'summary';

  const imageUrl = data.twitter.image ?? data.openGraph.image;
  const title = truncate(
    data.twitter.title ?? data.openGraph.title ?? data.general.title,
    TITLE_MAX,
  );
  const description = truncate(
    data.twitter.description ?? data.openGraph.description ?? data.general.description,
    DESCRIPTION_MAX,
  );
  const hostname = extractHostname(data.url.final);

  const imageSlot = (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: '#f7f9f9' }}
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
          className="flex h-full w-full flex-col items-center justify-center gap-1"
          style={{ color: '#536471' }}
        >
          <ImageOff className={isLargeImage ? 'h-8 w-8' : 'h-6 w-6'} aria-hidden />
          <span className="text-[10px] font-medium">
            {imageUrl ? 'image failed' : 'no image'}
          </span>
        </div>
      )}
    </div>
  );

  if (!isLargeImage) {
    return (
      <div
        className={cn(
          'flex overflow-hidden rounded-2xl border bg-white font-sans',
          className,
        )}
        style={{ borderColor: '#cfd9de' }}
      >
        <div
          className="aspect-square w-32 shrink-0 border-r"
          style={{ borderColor: '#cfd9de' }}
        >
          {imageSlot}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-3">
          <div className="truncate text-xs" style={{ color: '#536471' }}>
            {hostname}
          </div>
          {title ? (
            <h3
              className="line-clamp-2 text-sm leading-tight font-semibold"
              style={{ color: '#0f1419' }}
            >
              {title}
            </h3>
          ) : (
            <MissingField label="No title" />
          )}
          {description ? (
            <p className="line-clamp-2 text-xs leading-snug" style={{ color: '#536471' }}>
              {description}
            </p>
          ) : (
            <MissingField label="No description" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('overflow-hidden rounded-2xl border bg-white font-sans', className)}
      style={{ borderColor: '#cfd9de' }}
    >
      <div className="aspect-[1.91/1] w-full" style={{ backgroundColor: '#f7f9f9' }}>
        {imageSlot}
      </div>
      <div className="space-y-1 p-3">
        <div className="text-xs" style={{ color: '#536471' }}>
          {hostname}
        </div>
        {title ? (
          <h3 className="text-sm leading-tight font-semibold" style={{ color: '#0f1419' }}>
            {title}
          </h3>
        ) : (
          <MissingField label="No title" />
        )}
        {description ? (
          <p className="text-sm leading-snug" style={{ color: '#536471' }}>
            {description}
          </p>
        ) : (
          <MissingField label="No description" />
        )}
      </div>
    </div>
  );
}
