import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SemanticIcon } from '@/components/Icon';
import { AppPalette, AppScreen, Chip, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { ExpenseItem, expenseItems, mockTrips, statisticsExpenses } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import { getTripById } from '../trip/tripDetailModel';

export type ExpenseFilter = 'dates' | 'category' | 'people';

const categoryColors: Record<ExpenseItem['category'], string> = {
  Transportation: '#8d77f6',
  Hotel: '#ff8988',
  Food: '#45c7df',
  Entertainment: '#ff5f83',
  Shopping: '#67c246',
  Others: '#67c246',
};

export function ExpenseBreakdownScreen({
  initialFilter = 'category',
  tripId,
}: {
  initialFilter?: ExpenseFilter;
  tripId?: string;
}) {
  const [filter, setFilter] = useState<ExpenseFilter>(initialFilter);
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const trip = getTripById(mockTrips, tripId);
  const visibleExpenses = useMemo(
    () => (tripId ? statisticsExpenses.filter((item) => item.tripId === tripId) : expenseItems),
    [tripId],
  );
  const total = visibleExpenses.reduce((sum, item) => sum + item.amount, 0);
  const grouped = useMemo(() => {
    if (filter === 'category') {
      return Object.entries(
        visibleExpenses.reduce<Record<string, number>>((items, item) => {
          items[item.category] = (items[item.category] ?? 0) + item.amount;
          return items;
        }, {}),
      ).map(([title, amount]) => ({ title, subtitle: 'Category total', amount, route: '/expenses/category' }));
    }

    if (filter === 'people') {
      const people = trip?.companions?.length ? trip.companions : ['Amily Zhang', 'Johnny He', 'Mia Liu'];
      return people.map((person) => ({
        title: person,
        subtitle: 'Shared total',
        amount: total / people.length,
        route: '/expenses/people',
      }));
    }

    const dayTotals = visibleExpenses.reduce<Record<number, number>>((days, item) => {
      days[item.day] = (days[item.day] ?? 0) + item.amount;
      return days;
    }, {});
    return Object.entries(dayTotals).map(([day, amount]) => ({
      title: `Day ${day}`,
      subtitle: `Day ${day} of this memory`,
      amount,
      route: '/expenses/day',
    }));
  }, [filter, total, trip?.companions, visibleExpenses]);

  const openNewExpense = () => router.push({ pathname: '/expenses/new', params: tripId ? { tripId } : {} } as any);

  return (
    <AppScreen scroll bottomInset={Spacing.xxl}>
      <ContentContainer style={styles.content}>
        <ScreenHeader
          title={trip?.title ?? 'Expenses'}
          right={
            <Pressable accessibilityRole="button" accessibilityLabel="Add expense" onPress={openNewExpense} style={styles.add}>
              <SemanticIcon name="add" size={24} color={palette.text} />
            </Pressable>
          }
        />
        {tripId && visibleExpenses.length === 0 ? (
          <SurfaceCard style={styles.emptyState}>
            <SemanticIcon name="receipt-outline" size={30} color={palette.secondaryText} />
            <Text style={styles.emptyTitle}>No expenses yet</Text>
            <Text style={styles.emptyCopy}>Add the first cost for this memory when you are ready.</Text>
            <Pressable accessibilityRole="button" onPress={openNewExpense} style={styles.emptyAdd}>
              <Text style={styles.emptyAddText}>Add Expense</Text>
            </Pressable>
          </SurfaceCard>
        ) : (
          <>
            <Text style={styles.summary}>Summary</Text>
            <SurfaceCard style={styles.graph}>
              <View style={styles.donut}><View style={styles.center} /></View>
              <View style={styles.legend}>
                {Object.entries(categoryColors).slice(0, 4).map(([name, color]) => (
                  <View key={name} style={styles.legendRow}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Text style={styles.muted}>{name}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.graphTotal}>{`\u00a5${total.toFixed(2)}`}</Text>
            </SurfaceCard>
            <View style={styles.filters}>
              <Chip label="Dates" icon="calendar-outline" active={filter === 'dates'} onPress={() => setFilter('dates')} />
              <Chip label="Category" icon="grid-outline" active={filter === 'category'} onPress={() => setFilter('category')} />
              <Chip label="People" icon="people-outline" active={filter === 'people'} onPress={() => setFilter('people')} />
            </View>
            <Text style={styles.summary}>Expenditure</Text>
            <SurfaceCard style={styles.list}>
              {grouped.map((item) => (
                <Pressable key={item.title} style={styles.row} onPress={() => router.push(item.route as any)}>
                  <SemanticIcon
                    name={filter === 'dates' ? 'calendar-outline' : filter === 'people' ? 'person-outline' : 'pricetag-outline'}
                    size={25}
                    color={filter === 'category' ? categoryColors[item.title as ExpenseItem['category']] : palette.accent}
                  />
                  <View style={styles.rowBody}>
                    <Text style={styles.rowTitle}>{item.title}</Text>
                    <Text style={styles.muted}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.amount}>{`\u00a5${item.amount.toFixed(2)}`}</Text>
                  <SemanticIcon name="chevron-forward" size={20} color={palette.text} />
                </Pressable>
              ))}
              {filter === 'category' ? (
                <Pressable style={styles.newCategory} onPress={openNewExpense}>
                  <Text style={styles.rowTitle}>+ Add Category</Text>
                </Pressable>
              ) : null}
            </SurfaceCard>
          </>
        )}
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { gap: Spacing.md, paddingTop: Spacing.sm },
  add: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.cardMuted, alignItems: 'center', justifyContent: 'center' },
  summary: { color: palette.text, fontSize: Typography.fontSize.xl, fontWeight: '700' },
  emptyState: { marginTop: Spacing.xl, minHeight: 254, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  emptyTitle: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  emptyCopy: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, lineHeight: 20, textAlign: 'center', maxWidth: 238 },
  emptyAdd: { marginTop: Spacing.md, minHeight: 44, borderRadius: 22, backgroundColor: palette.accent, paddingHorizontal: Spacing.lg, alignItems: 'center', justifyContent: 'center' },
  emptyAddText: { color: '#24301e', fontSize: Typography.fontSize.sm, fontWeight: '700' },
  graph: { minHeight: 164, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  donut: { height: 102, width: 102, borderRadius: 51, borderWidth: 27, borderColor: '#43bfd8', borderTopColor: '#8d77f6', borderRightColor: '#ff8988' },
  center: { flex: 1 },
  legend: { gap: 7 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { height: 8, width: 8, borderRadius: 4 },
  muted: { fontSize: Typography.fontSize.sm, color: palette.secondaryText },
  graphTotal: { position: 'absolute', bottom: 10, right: 16, color: palette.text, fontWeight: '600' },
  filters: { flexDirection: 'row', gap: Spacing.sm },
  list: { paddingVertical: Spacing.sm },
  row: { minHeight: 67, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.divider, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rowBody: { flex: 1 },
  rowTitle: { color: palette.text, fontWeight: '700', fontSize: Typography.fontSize.md },
  amount: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '600' },
  newCategory: { alignItems: 'center', paddingVertical: Spacing.md },
});
