'use client';

import { AlertTriangle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  CategoryCounts,
  CheckStatus,
  ScoreReport,
} from '@/features/analyze/lib/scoring';

interface StatusVisual {
  Icon: typeof Check;
  colorClass: string;
  label: string;
}

const STATUS_VISUALS: Record<CheckStatus, StatusVisual> = {
  pass: { Icon: Check, colorClass: 'text-emerald-600 dark:text-emerald-400', label: 'Pass' },
  warn: { Icon: AlertTriangle, colorClass: 'text-amber-600 dark:text-amber-400', label: 'Warning' },
  fail: { Icon: X, colorClass: 'text-red-600 dark:text-red-400', label: 'Missing' },
};

function summarize(counts: CategoryCounts): string {
  return `${counts.pass} pass · ${counts.warn} warn · ${counts.fail} miss`;
}

interface ReportChecklistProps {
  report: ScoreReport;
}

export function ReportChecklist({ report }: ReportChecklistProps) {
  return (
    <div className="space-y-6">
      {report.categories.map((category) => (
        <section key={category.category} className="space-y-3">
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold">{category.label}</h3>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{category.score}/100</span> · {summarize(category.counts)}
            </div>
          </header>

          <ul className="space-y-2">
            {category.checks.map((check) => {
              const visual = STATUS_VISUALS[check.status];
              const { Icon, colorClass, label } = visual;
              return (
                <li
                  key={check.id}
                  className="flex items-start gap-3 rounded-md border bg-card p-3"
                >
                  <div
                    role="img"
                    aria-label={label}
                    className={cn('mt-0.5 shrink-0', colorClass)}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-sm font-medium">{check.label}</div>
                    {check.message ? (
                      <div className="wrap-break-word text-xs text-muted-foreground">
                        {check.message}
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
