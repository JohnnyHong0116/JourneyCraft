import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SemanticIcon } from '@/components/Icon';
import { router } from 'expo-router';
import { AppPalette, AppScreen, Chip, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';

export default function AddExpenseScreen() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);

  return (
    <AppScreen keyboardSafe>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Add an expense" backLabel="Cancel" right={<Pressable onPress={() => router.replace('/expenses')}><Text style={styles.done}>Done</Text></Pressable>} />
        <Text style={styles.date}>2025/07/24</Text>
        <View style={styles.mediaRow}>
          <View style={styles.imagePlaceholder} />
          <Pressable style={styles.addPhoto}><SemanticIcon name="add" size={48} color={palette.secondaryText} /></Pressable>
        </View>
        <Text style={styles.label}>Expense name</Text>
        <View style={styles.inputRow}>
          <Text style={styles.currency}>USD⌄</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Enter Expenses" placeholderTextColor={palette.secondaryText} />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.currency}>¥</Text>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={styles.input} placeholder="0.00" placeholderTextColor={palette.secondaryText} />
        </View>
        <View style={styles.bottom}>
          <View style={styles.chips}>
            <Chip label="Categories" icon="pricetags-outline" onPress={() => router.push('/expenses/category')} />
            <Chip label="People" icon="person-outline" onPress={() => router.push('/expenses/people')} />
          </View>
          <Pressable style={styles.location} onPress={() => router.push('/expenses/location')}>
            <SemanticIcon name="location-outline" size={22} color={palette.text} />
            <Text style={styles.locationText}>Tag Location</Text>
            <SemanticIcon name="chevron-forward" size={21} color={palette.text} />
          </Pressable>
        </View>
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { flex: 1, paddingTop: Spacing.sm },
  done: { color: palette.accentStrong, fontSize: Typography.fontSize.md, fontWeight: '600' },
  date: { textAlign: 'center', color: palette.text, fontSize: Typography.fontSize.xl },
  mediaRow: { flexDirection: 'row', gap: Spacing.md, marginVertical: Spacing.md },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 15, backgroundColor: '#fff' },
  addPhoto: { width: 80, height: 80, borderRadius: 15, backgroundColor: palette.cardMuted, justifyContent: 'center', alignItems: 'center' },
  label: { color: palette.secondaryText, fontSize: Typography.fontSize.lg, marginTop: Spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.divider, minHeight: 52 },
  currency: { color: palette.text, fontSize: Typography.fontSize.md, borderRightWidth: StyleSheet.hairlineWidth, borderColor: palette.secondaryText, paddingRight: Spacing.sm },
  input: { flex: 1, color: palette.text, fontSize: Typography.fontSize.md, paddingLeft: Spacing.sm },
  bottom: { marginTop: 'auto', marginBottom: Spacing.md },
  chips: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  location: { flexDirection: 'row', minHeight: 50, alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderColor: palette.divider, gap: Spacing.sm },
  locationText: { flex: 1, color: palette.text, fontSize: Typography.fontSize.md },
});
