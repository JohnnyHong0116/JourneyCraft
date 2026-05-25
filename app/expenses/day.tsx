import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { expenseItems } from '@/data/mockApp';
import { Spacing, Typography } from '@/theme/designSystem';

export default function ExpenseDayScreen() {
  const items = expenseItems.filter((item) => item.day === 1);
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  return (
    <AppScreen mode="dark">
      <ContentContainer style={styles.content}>
        <ScreenHeader mode="dark" title="Day 1" backLabel="Back" right={<Ionicons name="ellipsis-horizontal-circle" color="#fff" size={29} />} />
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

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm },
  total: { color: AppPalette.dark.text, fontSize: 49, fontWeight: '500', textAlign: 'center', marginVertical: Spacing.lg },
  row: { minHeight: 55, borderBottomColor: AppPalette.dark.divider, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center' },
  body: { flex: 1 },
  title: { color: AppPalette.dark.text, fontSize: Typography.fontSize.lg },
  amount: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md },
  receipt: { color: AppPalette.dark.accent, fontSize: Typography.fontSize.sm },
});
