import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppPalette, AppScreen, Chip, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

export default function AddExpenseScreen() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <AppScreen mode="dark" keyboardSafe>
      <ContentContainer style={styles.content}>
        <ScreenHeader mode="dark" title="Add an expense" backLabel="Cancel" right={<Pressable onPress={() => router.replace('/expenses')}><Text style={styles.done}>Done</Text></Pressable>} />
        <Text style={styles.date}>2025/07/24</Text>
        <View style={styles.mediaRow}>
          <View style={styles.imagePlaceholder} />
          <Pressable style={styles.addPhoto}><Ionicons name="add" size={48} color={AppPalette.dark.secondaryText} /></Pressable>
        </View>
        <Text style={styles.label}>Expense name</Text>
        <View style={styles.inputRow}>
          <Text style={styles.currency}>USD⌄</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Enter Expenses" placeholderTextColor={AppPalette.dark.secondaryText} />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.currency}>¥</Text>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={styles.input} placeholder="0.00" placeholderTextColor={AppPalette.dark.secondaryText} />
        </View>
        <View style={styles.bottom}>
          <View style={styles.chips}>
            <Chip mode="dark" label="Categories" icon="pricetags-outline" onPress={() => router.push('/expenses/category')} />
            <Chip mode="dark" label="People" icon="person-outline" onPress={() => router.push('/expenses/people')} />
          </View>
          <Pressable style={styles.location} onPress={() => router.push('/expenses/location')}>
            <Ionicons name="location-outline" size={22} color={AppPalette.dark.text} />
            <Text style={styles.locationText}>Tag Location</Text>
            <Ionicons name="chevron-forward" size={21} color={AppPalette.dark.text} />
          </Pressable>
        </View>
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingTop: Spacing.sm },
  done: { color: AppPalette.dark.accentStrong, fontSize: Typography.fontSize.md, fontWeight: '600' },
  date: { textAlign: 'center', color: AppPalette.dark.text, fontSize: Typography.fontSize.xl },
  mediaRow: { flexDirection: 'row', gap: Spacing.md, marginVertical: Spacing.md },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 15, backgroundColor: '#fff' },
  addPhoto: { width: 80, height: 80, borderRadius: 15, backgroundColor: '#747a7d', justifyContent: 'center', alignItems: 'center' },
  label: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.lg, marginTop: Spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: AppPalette.dark.divider, minHeight: 52 },
  currency: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, borderRightWidth: StyleSheet.hairlineWidth, borderColor: AppPalette.dark.secondaryText, paddingRight: Spacing.sm },
  input: { flex: 1, color: AppPalette.dark.text, fontSize: Typography.fontSize.md, paddingLeft: Spacing.sm },
  bottom: { marginTop: 'auto', marginBottom: Spacing.md },
  chips: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  location: { flexDirection: 'row', minHeight: 50, alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderColor: AppPalette.dark.divider, gap: Spacing.sm },
  locationText: { flex: 1, color: AppPalette.dark.text, fontSize: Typography.fontSize.md },
});
