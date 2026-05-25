import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppPalette, AppScreen, Chip, ContentContainer, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { ExpenseItem, expenseItems } from '@/data/mockApp';
import { Spacing, Typography } from '@/theme/designSystem';

export type ExpenseFilter = 'dates' | 'category' | 'people';

const categoryColors: Record<ExpenseItem['category'], string> = {
  Transportation: '#8d77f6',
  Hotel: '#ff8988',
  Food: '#45c7df',
  Entertainment: '#ff5f83',
  Shopping: '#67c246',
  Others: '#67c246',
};

export function ExpenseBreakdownScreen({ initialFilter = 'category' }: { initialFilter?: ExpenseFilter }) {
  const [filter, setFilter] = useState<ExpenseFilter>(initialFilter);
  const total = expenseItems.reduce((sum, item) => sum + item.amount, 0);
  const grouped = useMemo(() => {
    if (filter === 'category') {
      return Object.entries(
        expenseItems.reduce<Record<string, number>>((items, item) => {
          items[item.category] = (items[item.category] ?? 0) + item.amount;
          return items;
        }, {}),
      ).map(([title, amount]) => ({ title, subtitle: 'Simple description', amount, route: '/expenses/category' }));
    }
    if (filter === 'people') {
      return ['Amily Zhang', 'Johnny He', 'Mia Liu'].map((person, index) => ({
        title: person,
        subtitle: `${index + 1} shared expenses`,
        amount: [108, 72, 20][index],
        route: '/expenses/people',
      }));
    }
    return [1, 2, 3, 4].map((day) => ({
      title: `Day ${day}`,
      subtitle: `July ${23 + day}, 2025`,
      amount: expenseItems.filter((item) => item.day === day).reduce((sum, item) => sum + item.amount, 0),
      route: '/expenses/day',
    }));
  }, [filter]);

  return (
    <AppScreen mode="dark" scroll bottomInset={Spacing.xxl}>
      <ContentContainer style={styles.content}>
        <ScreenHeader
          title="Chengdu Trip"
          mode="dark"
          right={
            <Pressable onPress={() => router.push('/expenses/new')} style={styles.add}>
              <Ionicons name="add" size={24} color={AppPalette.dark.text} />
            </Pressable>
          }
        />
        <Text style={styles.summary}>Summary</Text>
        <SurfaceCard mode="dark" style={styles.graph}>
          <View style={styles.donut}><View style={styles.center} /></View>
          <View style={styles.legend}>
            {Object.entries(categoryColors).slice(0, 4).map(([name, color]) => (
              <View key={name} style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: color }]} />
                <Text style={styles.muted}>{name}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.graphTotal}>¥{total}</Text>
        </SurfaceCard>
        <View style={styles.filters}>
          <Chip mode="dark" label="Dates" icon="calendar-outline" active={filter === 'dates'} onPress={() => setFilter('dates')} />
          <Chip mode="dark" label="Category" icon="grid-outline" active={filter === 'category'} onPress={() => setFilter('category')} />
          <Chip mode="dark" label="People" icon="people-outline" active={filter === 'people'} onPress={() => setFilter('people')} />
        </View>
        <Text style={styles.summary}>Expenditure</Text>
        <SurfaceCard mode="dark" style={styles.list}>
          {grouped.map((item) => (
            <Pressable key={item.title} style={styles.row} onPress={() => router.push(item.route as any)}>
              <Ionicons name={filter === 'dates' ? 'calendar-outline' : filter === 'people' ? 'person-outline' : 'pricetag-outline'} size={25} color={filter === 'category' ? categoryColors[item.title as ExpenseItem['category']] : AppPalette.dark.accent} />
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.muted}>{item.subtitle}</Text>
              </View>
              <Text style={styles.amount}>¥{item.amount.toFixed(2)}</Text>
              <Ionicons name="chevron-forward" size={20} color={AppPalette.dark.text} />
            </Pressable>
          ))}
          {filter === 'category' ? (
            <Pressable style={styles.newCategory} onPress={() => router.push('/expenses/new')}>
              <Text style={styles.rowTitle}>+ Add Category</Text>
            </Pressable>
          ) : null}
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md, paddingTop: Spacing.sm },
  add: { width: 38, height: 38, borderRadius: 19, backgroundColor: AppPalette.dark.cardMuted, alignItems: 'center', justifyContent: 'center' },
  summary: { color: AppPalette.dark.text, fontSize: Typography.fontSize.xl, fontWeight: '700' },
  graph: { minHeight: 164, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  donut: { height: 102, width: 102, borderRadius: 51, borderWidth: 27, borderColor: '#43bfd8', borderTopColor: '#8d77f6', borderRightColor: '#ff8988' },
  center: { flex: 1 },
  legend: { gap: 7 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { height: 8, width: 8, borderRadius: 4 },
  muted: { fontSize: Typography.fontSize.sm, color: AppPalette.dark.secondaryText },
  graphTotal: { position: 'absolute', bottom: 10, right: 16, color: AppPalette.dark.text, fontWeight: '600' },
  filters: { flexDirection: 'row', gap: Spacing.sm },
  list: { paddingVertical: Spacing.sm },
  row: { minHeight: 67, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: AppPalette.dark.divider, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rowBody: { flex: 1 },
  rowTitle: { color: AppPalette.dark.text, fontWeight: '700', fontSize: Typography.fontSize.md },
  amount: { color: AppPalette.dark.text, fontSize: Typography.fontSize.lg, fontWeight: '600' },
  newCategory: { alignItems: 'center', paddingVertical: Spacing.md },
});
