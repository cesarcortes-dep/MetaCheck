'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { scoreAnalysis } from '@/features/analyze/lib/scoring';
import type { AnalyzeResponse } from '@/types/analyze';
import { FacebookPreview } from './previews/facebook-preview';
import { GooglePreview } from './previews/google-preview';
import { LinkedInPreview } from './previews/linkedin-preview';
import { TwitterPreview } from './previews/twitter-preview';
import { ReportChecklist } from './report/checklist';
import { DownloadPdfButton } from './report/download-pdf-button';
import { ScoreBanner } from './report/score-banner';

interface AnalyzeResultProps {
  data: AnalyzeResponse;
}

export function AnalyzeResult({ data }: AnalyzeResultProps) {
  const report = React.useMemo(() => scoreAnalysis(data), [data]);

  return (
    <div className="space-y-8">
      <ScoreBanner report={report} />

      <Tabs defaultValue="google" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="twitter">Twitter / X</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
        </TabsList>

        <TabsContent value="google" className="mt-4">
          <GooglePreview data={data} />
        </TabsContent>
        <TabsContent value="facebook" className="mt-4">
          <FacebookPreview data={data} />
        </TabsContent>
        <TabsContent value="twitter" className="mt-4">
          <TwitterPreview data={data} />
        </TabsContent>
        <TabsContent value="linkedin" className="mt-4">
          <LinkedInPreview data={data} />
        </TabsContent>
      </Tabs>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Technical report</h2>
          <DownloadPdfButton data={data} report={report} />
        </div>
        <ReportChecklist report={report} />
      </section>
    </div>
  );
}
