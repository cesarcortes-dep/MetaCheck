import { NextResponse } from 'next/server';
import { z } from 'zod';
import { parseHtml } from '@/features/analyze/lib/parser';
import { fetchHtml } from '@/lib/fetch-html';
import type {
  AnalyzeErrorCode,
  AnalyzeErrorResponse,
  AnalyzeResponse,
} from '@/types/analyze';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  url: z.url(),
});

function errorResponse(
  code: AnalyzeErrorCode,
  message: string,
  status: number,
): NextResponse<AnalyzeErrorResponse> {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(
  request: Request,
): Promise<NextResponse<AnalyzeResponse | AnalyzeErrorResponse>> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse('INVALID_URL', 'Request body must be valid JSON', 400);
  }

  const parsed = BodySchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(
      'INVALID_URL',
      'Body must be { url: string } with a valid http(s) URL',
      400,
    );
  }

  const requestedUrl = parsed.data.url;
  const result = await fetchHtml(requestedUrl);

  if (!result.ok) {
    const status =
      result.code === 'BLOCKED_HOST'
        ? 400
        : result.code === 'TIMEOUT'
          ? 504
          : result.code === 'NOT_HTML' || result.code === 'TOO_LARGE'
            ? 422
            : 502;
    return errorResponse(result.code, result.message, status);
  }

  const parsedDoc = parseHtml(result.html, result.finalUrl);

  const response: AnalyzeResponse = {
    url: {
      requested: requestedUrl,
      final: result.finalUrl,
      statusCode: result.statusCode,
    },
    ...parsedDoc,
  };

  return NextResponse.json(response);
}
