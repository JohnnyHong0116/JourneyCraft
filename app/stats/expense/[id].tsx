import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SemanticIcon } from '@/components/Icon';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { mockTrips, statisticsExpenses } from '@/data/appData';
import { getExpenseRecordById } from '@features/stats/statisticsModel';
import { useTranslation } from '@/i18n/useTranslation';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';

export default function StatsExpenseDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    period?: string;
    year?: string;
    month?: string;
    drawer?: string;
    snap?: string;
  }>();
  const { mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const record = getExpenseRecordById(statisticsExpenses, mockTrips, params.id);

  const goBackToStats = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace({
      pathname: '/(tabs)/stats',
      params: {
        period: params.period ?? 'monthly',
        year: params.year ?? '2025',
        month: params.month ?? '7',
        drawer: params.drawer ?? 'open',
        snap: params.snap ?? 'collapsed',
      },
    } as any);
  };

  return (
    <AppScreen scroll bottomInset={Spacing.xxl}>
      <ContentContainer style={styles.content}>
        <ScreenHeader title={t('stats.expenseDetails')} backLabel={t('common.back')} onBack={goBackToStats} />
        {!record ? (
          <SurfaceCard style={styles.empty}>
            <SemanticIcon name="receipt-outline" size={30} color={palette.secondaryText} />
            <Text style={styles.emptyText}>{t('stats.noExpenses')}</Text>
          </SurfaceCard>
        ) : (
          <>
            <SurfaceCard style={styles.hero}>
              <Text style={styles.title}>{record.title}</Text>
              <Text style={styles.muted}>{record.route}</Text>
              <Text style={styles.muted}>{formatDateRange(record.startDate, record.endDate)}</Text>
              <Text style={styles.total}>{record.currency}{record.totalAmount.toFixed(2)}</Text>
            </SurfaceCard>
            <SurfaceCard style={styles.metaCard}>
              {record.budgetAmount ? <DetailRow label={t('stats.budget')} value={`${record.currency}${record.budgetAmount.toFixed(2)}`} /> : null}
              {record.paidBy ? <DetailRow label={t('stats.paidBy')} value={record.paidBy} /> : null}
              <DetailRow label={t('stats.splitWith')} value={record.splitParticipants.join(', ') || '-'} />
            </SurfaceCard>
            <Text style={styles.sectionTitle}>{t('stats.itemsCount', { count: record.items.length })}</Text>
            <SurfaceCard style={styles.items}>
              {record.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemCopy}>
                    <Text style={styles.itemTitle}>{item.label}</Text>
                    <Text style={styles.muted}>{item.category} · {item.occurredOn}</Text>
                  </View>
                  <Text style={styles.itemAmount}>{record.currency}{item.amount.toFixed(2)}</Text>
                </View>
              ))}
            </SurfaceCard>
          </>
        )}
      </ContentContainer>
    </AppScreen>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function formatDateRange(startDate: string, endDate: string): string {
  if (startDate === endDate) return startDate;
  return `${startDate} - ${endDate}`;
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.md },
  hero: { gap: Spacing.xs },
  title: { color: palette.text, fontSize: Typography.fontSize.xxl, fontWeight: '700' },
  muted: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  total: { color: palette.text, fontSize: 42, fontWeight: '700', marginTop: Spacing.sm },
  metaCard: { gap: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md, paddingVertical: Spacing.xs },
  detailLabel: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
  detailValue: { color: palette.text, fontSize: Typography.fontSize.sm, fontWeight: '700', flex: 1, textAlign: 'right' },
  sectionTitle: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700', marginTop: Spacing.sm },
  items: { paddingVertical: Spacing.xs },
  itemRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.divider },
  itemCopy: { flex: 1 },
  itemTitle: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  itemAmount: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  empty: { minHeight: 220, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: BorderRadius.xl },
  emptyText: { color: palette.secondaryText, fontSize: Typography.fontSize.md },
});
