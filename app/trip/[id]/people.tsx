import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, PrimaryButton, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { mockTrips } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import { getTripById } from '../../../features/trip/tripDetailModel';

export default function TripPeopleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTripById(mockTrips, id);
  const people = Array.from(new Set([...(trip?.companions ?? []), 'Amily Zhang', 'Johnny He', 'Mia Liu', 'Chris Wong']));
  const [selected, setSelected] = useState<string[]>(trip?.companions ?? []);
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);

  return (
    <AppScreen scroll>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="People" />
        <Text style={styles.heading}>{trip ? `People in ${trip.title}` : 'People in this memory'}</Text>
        <SurfaceCard style={styles.list}>
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
                <Ionicons name={checked ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={checked ? palette.accent : palette.secondaryText} />
              </Pressable>
            );
          })}
        </SurfaceCard>
        <PrimaryButton title={`Save ${selected.length} ${selected.length === 1 ? 'person' : 'people'}`} icon="checkmark" />
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { gap: Spacing.lg, paddingTop: Spacing.sm },
  heading: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  list: { gap: Spacing.sm },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.divider },
  avatar: { width: 38, height: 38, borderRadius: 20, backgroundColor: palette.cardMuted, alignItems: 'center', justifyContent: 'center' },
  initial: { color: palette.text, fontWeight: '700' },
  person: { flex: 1, color: palette.text, fontSize: Typography.fontSize.md },
});
