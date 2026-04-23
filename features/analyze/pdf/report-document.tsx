import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type {
  CheckStatus,
  OverallStatus,
  ScoreReport,
} from '@/features/analyze/lib/scoring';
import type { AnalyzeResponse } from '@/types/analyze';

const COLORS = {
  text: '#0f172a',
  muted: '#64748b',
  border: '#e2e8f0',
  surface: '#f8fafc',
  accent: '#2563eb',
  pass: '#059669',
  warn: '#d97706',
  fail: '#dc2626',
  scoreBg: {
    excellent: '#ecfdf5',
    good: '#ecfdf5',
    needsWork: '#fffbeb',
    poor: '#fef2f2',
  } satisfies Record<OverallStatus, string>,
  scoreText: {
    excellent: '#047857',
    good: '#047857',
    needsWork: '#b45309',
    poor: '#b91c1c',
  } satisfies Record<OverallStatus, string>,
};

const STATUS_LABEL: Record<OverallStatus, string> = {
  excellent: 'Excellent',
  good: 'Good',
  needsWork: 'Needs work',
  poor: 'Poor',
};

const CHECK_SYMBOL: Record<CheckStatus, { glyph: string; color: string; label: string }> = {
  pass: { glyph: '✓', color: COLORS.pass, label: 'Pass' },
  warn: { glyph: '!', color: COLORS.warn, label: 'Warning' },
  fail: { glyph: '✕', color: COLORS.fail, label: 'Missing' },
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  kicker: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: COLORS.muted,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  urlRow: {
    fontSize: 10,
    color: COLORS.accent,
    marginBottom: 2,
  },
  metaRow: {
    fontSize: 9,
    color: COLORS.muted,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 20,
  },
  scoreBig: {
    fontSize: 42,
    fontFamily: 'Helvetica-Bold',
  },
  scoreOutOf: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginLeft: 4,
  },
  scoreStatus: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  scoreSummary: {
    fontSize: 9,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  categoryCell: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  categoryCellLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: COLORS.muted,
    marginBottom: 2,
    fontFamily: 'Helvetica-Bold',
  },
  categoryCellScore: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  categoryCellCounts: {
    fontSize: 8,
    color: COLORS.muted,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },
  sectionMeta: {
    fontSize: 9,
    color: COLORS.muted,
  },
  checkItem: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  checkGlyphBox: {
    width: 14,
    alignItems: 'center',
  },
  checkGlyph: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  checkBody: {
    flex: 1,
  },
  checkLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  checkMessage: {
    fontSize: 9,
    color: COLORS.muted,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 8,
    color: COLORS.muted,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
});

interface ReportDocumentProps {
  data: AnalyzeResponse;
  report: ScoreReport;
  generatedAt: Date;
}

export function ReportDocument({ data, report, generatedAt }: ReportDocumentProps) {
  const scoreBg = COLORS.scoreBg[report.status];
  const scoreText = COLORS.scoreText[report.status];
  const formattedDate = generatedAt.toISOString().slice(0, 10);

  return (
    <Document
      title={`MetaCheck Report — ${data.url.final}`}
      author="MetaCheck"
      subject="Metadata audit"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.kicker}>MetaCheck Report</Text>
          <Text style={styles.title}>Metadata audit</Text>
          <Text style={styles.urlRow}>{data.url.final}</Text>
          <Text style={styles.metaRow}>
            Requested: {data.url.requested}
            {data.url.requested !== data.url.final ? ' (redirected)' : ''}
            {'  ·  '}Status {data.url.statusCode}
            {'  ·  '}Generated {formattedDate}
          </Text>
        </View>

        <View
          style={[
            styles.scoreCard,
            { backgroundColor: scoreBg, borderColor: scoreBg },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.scoreBig, { color: scoreText }]}>{report.total}</Text>
            <Text style={[styles.scoreOutOf, { color: scoreText }]}>/ 100</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.scoreStatus, { color: scoreText }]}>
              {STATUS_LABEL[report.status]}
            </Text>
            <Text style={styles.scoreSummary}>
              {report.counts.pass} passing · {report.counts.warn} warning · {report.counts.fail} missing
            </Text>
          </View>
        </View>

        <View style={styles.categoriesGrid}>
          {report.categories.map((cat) => (
            <View key={cat.category} style={styles.categoryCell}>
              <Text style={styles.categoryCellLabel}>{cat.label}</Text>
              <Text style={styles.categoryCellScore}>{cat.score}</Text>
              <Text style={styles.categoryCellCounts}>
                {cat.counts.pass}/{cat.counts.pass + cat.counts.warn + cat.counts.fail} pass
              </Text>
            </View>
          ))}
        </View>

        {report.categories.map((cat) => (
          <View key={cat.category} wrap={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{cat.label}</Text>
              <Text style={styles.sectionMeta}>
                {cat.score}/100 · {cat.counts.pass} pass · {cat.counts.warn} warn · {cat.counts.fail} miss
              </Text>
            </View>
            {cat.checks.map((check) => {
              const symbol = CHECK_SYMBOL[check.status];
              return (
                <View key={check.id} style={styles.checkItem}>
                  <View style={styles.checkGlyphBox}>
                    <Text style={[styles.checkGlyph, { color: symbol.color }]}>
                      {symbol.glyph}
                    </Text>
                  </View>
                  <View style={styles.checkBody}>
                    <Text style={styles.checkLabel}>{check.label}</Text>
                    {check.message ? (
                      <Text style={styles.checkMessage}>{check.message}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}  ·  MetaCheck  ·  ${formattedDate}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
