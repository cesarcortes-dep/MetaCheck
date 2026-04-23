'use client';

import * as React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  extractHostname,
} from '@/features/analyze/lib/preview-helpers';
import type { ScoreReport } from '@/features/analyze/lib/scoring';
import type { AnalyzeResponse } from '@/types/analyze';

interface DownloadPdfButtonProps {
  data: AnalyzeResponse;
  report: ScoreReport;
}

function buildFilename(data: AnalyzeResponse, generatedAt: Date): string {
  const host = extractHostname(data.url.final).replace(/[^a-z0-9.-]/gi, '-');
  const date = generatedAt.toISOString().slice(0, 10);
  return `metacheck-${host}-${date}.pdf`;
}

export function DownloadPdfButton({ data, report }: DownloadPdfButtonProps) {
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleClick = async () => {
    setGenerating(true);
    setError(null);
    try {
      const [{ pdf }, { ReportDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/features/analyze/pdf/report-document'),
      ]);
      const generatedAt = new Date();
      const blob = await pdf(
        <ReportDocument data={data} report={report} generatedAt={generatedAt} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = buildFilename(data, generatedAt);
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        loading={generating}
        disabled={generating}
      >
        {!generating ? <Download className="h-4 w-4" aria-hidden /> : null}
        {generating ? 'Generating PDF…' : 'Download PDF'}
      </Button>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
