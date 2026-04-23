'use client';

import { cn } from '@/lib/utils';
import type { OverallStatus, ScoreReport } from '@/features/analyze/lib/scoring';

const STATUS_LABEL: Record<OverallStatus, string> = {
  excellent: 'Excellent',
  good: 'Good',
  needsWork: 'Needs work',
  poor: 'Poor',
};

const STATUS_STYLES: Record<OverallStatus, string> = {
  excellent:
    'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-50',
  good: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-50',
  needsWork:
    'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-50',
  poor: 'border-red-200 bg-red-50 text-red-950 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-50',
};

const ACCENT_STYLES: Record<OverallStatus, string> = {
  excellent: 'text-emerald-700 dark:text-emerald-300',
  good: 'text-emerald-700 dark:text-emerald-300',
  needsWork: 'text-amber-700 dark:text-amber-300',
  poor: 'text-red-700 dark:text-red-300',
};

interface ScoreBannerProps {
  report: ScoreReport;
}

export function ScoreBanner({ report }: ScoreBannerProps) {
  const { counts } = report;
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-6 rounded-lg border p-6',
        STATUS_STYLES[report.status],
      )}
    >
      <div className={cn('flex items-baseline gap-2', ACCENT_STYLES[report.status])}>
        <span className="text-5xl leading-none font-bold tabular-nums">{report.total}</span>
        <span className="text-sm font-medium">/ 100</span>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="text-base font-semibold">{STATUS_LABEL[report.status]}</div>
        <div className="text-sm opacity-80">
          {counts.pass} passing · {counts.warn} warning · {counts.fail} missing
        </div>
      </div>

      <div className="flex gap-3 text-xs">
        {report.categories.map((cat) => (
          <div key={cat.category} className="text-center">
            <div className={cn('text-lg font-semibold tabular-nums', ACCENT_STYLES[report.status])}>
              {cat.score}
            </div>
            <div className="opacity-70">{cat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
