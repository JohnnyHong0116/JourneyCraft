import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SemanticIcon } from '@/components/Icon';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { expenseItems } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';

export default function ExpenseDayScreen() {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const items = expenseItems.filter((item) => item.day === 1);
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return (
    <AppScreen>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Day 1" backLabel="Back" right={<SemanticIcon name="ellipsis-horizontal-circle" color={palette.text} size={29} />} />
        <Text style={styles.total}>¥{total.toFixed(2)}</Text>
        {items.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.body}>
              <Text style={styles.title}>{item.label}</Text>
              <Text style={styles.amount}>¥{item.amount.toFixed(2)}</Text>
            </View>
            <Pressable onPress={() => router.push('/expenses/receipt')}>
              <Text style={styles.receipt}>View Receipt</Text>
            </Pressable>
          </View>
        ))}
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  total: { color: palette.text, fontSize: 49, fontWeight: '500', textAlign: 'center', marginVertical: Spacing.lg },
  row: { minHeight: 55, borderBottomColor: palette.divider, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center' },
  body: { flex: 1 },
  title: { color: palette.text, fontSize: Typography.fontSize.lg },
  amount: { color: palette.text, fontSize: Typography.fontSize.md },
  receipt: { color: palette.accent, fontSize: Typography.fontSize.sm },
});
