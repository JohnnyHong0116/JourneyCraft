import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { getStatisticsMonthOptions, getStatisticsSummary } from '@/data/appData';
import { Spacing, Typography } from '@/theme/designSystem';

export default function StatsSummaryScreen() {
  const params = useLocalSearchParams<{ period?: string; year?: string; month?: string }>();
  const period = params.period === 'annual' ? 'annual' : 'monthly';
  const year = Number(params.year) || 2025;
  const month = Number(params.month) || 7;
  const summary = getStatisticsSummary(year, period === 'monthly' ? month : undefined);
  const periodTitle = period === 'monthly'
    ? `${getStatisticsMonthOptions(year)[month - 1].name} ${year}`
    : String(year);

  return (
    <AppScreen mode="dark" scroll>
      <ContentContainer style={styles.content}>
        <ScreenHeader mode="dark" title={`${periodTitle} Summary`} right={<Ionicons name="ellipsis-horizontal-circle" size={28} color={AppPalette.dark.text} />} />
        <Pressable onPress={() => router.push('/expenses')}>
          <SurfaceCard mode="dark" style={styles.totalCard}>
            <Text style={styles.label}>Total Expenses</Text>
            <Text style={styles.total}>¥ {summary.total.toFixed(2)}</Text>
            <View style={styles.progress}><View style={styles.progressFill} /></View>
            <Text style={styles.muted}>{summary.tripCount} recorded trips in this period</Text>
          </SurfaceCard>
        </Pressable>
        <SurfaceCard mode="dark" style={styles.chartCard}>
          <View style={styles.donut}>
            <View style={styles.donutInside} />
          </View>
          <View style={styles.legend}>
            {['Transport', 'Hotel', 'Food', 'Others'].map((label, index) => (
              <View key={label} style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: ['#8b76ef', '#ff8884', '#42bbd4', '#ffad52'][index] }]} />
                <Text style={styles.muted}>{label}</Text>
              </View>
            ))}
          </View>
        </SurfaceCard>
        <Pressable onPress={() => router.push('/expenses')} style={styles.expensesButton}>
          <Text style={styles.buttonText}>Open expense breakdown</Text>
          <Ionicons name="chevron-forward" size={20} color={AppPalette.dark.text} />
        </Pressable>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm, gap: Spacing.xxl },
  totalCard: { gap: Spacing.sm },
  label: { color: AppPalette.dark.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  total: { color: AppPalette.dark.text, fontSize: 46, fontWeight: '600' },
  muted: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm },
  progress: { height: 13, backgroundColor: '#737475', borderRadius: 8, overflow: 'hidden' },
  progressFill: { width: '94%', height: '100%', backgroundColor: AppPalette.dark.accent },
  chartCard: { minHeight: 160, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#919493' },
  donut: { width: 110, height: 110, borderRadius: 55, borderWidth: 27, borderColor: '#44c1dc', borderTopColor: '#8b76ef', borderRightColor: '#ff8884' },
  donutInside: { flex: 1 },
  legend: { gap: Spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  expensesButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, borderRadius: 16, backgroundColor: AppPalette.dark.card },
  buttonText: { color: AppPalette.dark.text, fontWeight: '600', fontSize: Typography.fontSize.md },
});
