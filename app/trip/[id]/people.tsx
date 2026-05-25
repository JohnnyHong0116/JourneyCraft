import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPalette, AppScreen, ContentContainer, PrimaryButton, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

const people = ['Amily Zhang', 'Johnny He', 'Mia Liu', 'Chris Wong'];

export default function TripPeopleScreen() {
  const [selected, setSelected] = useState(['Amily Zhang', 'Johnny He']);

  return (
    <AppScreen mode="dark" scroll>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="People" mode="dark" />
        <Text style={styles.heading}>Share this memory with</Text>
        <SurfaceCard mode="dark" style={styles.list}>
          {people.map((person) => {
            const checked = selected.includes(person);
            return (
              <Pressable
                key={person}
                style={styles.row}
                onPress={() => setSelected((current) => checked ? current.filter((item) => item !== person) : [...current, person])}
              >
                <View style={styles.avatar}><Text style={styles.initial}>{person[0]}</Text></View>
                <Text style={styles.person}>{person}</Text>
                <Ionicons name={checked ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={checked ? AppPalette.dark.accent : AppPalette.dark.secondaryText} />
              </Pressable>
            );
          })}
        </SurfaceCard>
        <PrimaryButton mode="dark" title={`Add ${selected.length} people`} icon="checkmark" />
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.lg, paddingTop: Spacing.sm },
  heading: { color: AppPalette.dark.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  list: { gap: Spacing.sm },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: AppPalette.dark.divider },
  avatar: { width: 38, height: 38, borderRadius: 20, backgroundColor: '#47464d', alignItems: 'center', justifyContent: 'center' },
  initial: { color: AppPalette.dark.text, fontWeight: '700' },
  person: { flex: 1, color: AppPalette.dark.text, fontSize: Typography.fontSize.md },
});
