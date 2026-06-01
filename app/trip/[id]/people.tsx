import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon } from '@/components/Icon';
import { AppPalette, AppScreen, ContentContainer, PrimaryButton, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
import { mockTrips } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';
import { addCompanion, removeCompanion } from '../../../features/people/peopleModel';
import { loadCompanionOverrides, saveCompanions } from '../../../features/people/peopleStorage';
import { SwipeToDeleteRow } from '../../../features/people/SwipeToDeleteRow';
import { getTripById } from '../../../features/trip/tripDetailModel';

const suggestions = ['Amily Zhang', 'Johnny He', 'Mia Liu', 'Chris Wong'];

export default function TripPeopleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTripById(mockTrips, id);
  const [selected, setSelected] = useState<string[]>(trip?.companions ?? []);
  const [draft, setDraft] = useState('');
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);

  useEffect(() => {
    if (!id) return;
    void loadCompanionOverrides().then((overrides) => {
      if (Object.prototype.hasOwnProperty.call(overrides, id)) setSelected(overrides[id] ?? []);
    });
  }, [id]);

  const availableSuggestions = useMemo(() => suggestions.filter((person) => !selected.includes(person)), [selected]);
  const addDraft = () => {
    const next = addCompanion(selected, draft);
    if (next.length === selected.length) return;
    setSelected(next);
    setDraft('');
  };
  const save = () => {
    if (!id) return;
    void saveCompanions(id, selected).then(() => router.back());
  };

  return (
    <AppScreen scroll keyboardSafe>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="People" />
        <Text style={styles.heading}>{trip ? `People in ${trip.title}` : 'People in this memory'}</Text>
        <Text style={styles.helper}>Swipe a person left to remove them.</Text>
        <SurfaceCard style={styles.list}>
          {selected.length ? selected.map((person) => (
            <SwipeToDeleteRow key={person} name={person} onDelete={() => setSelected((current) => removeCompanion(current, person))} palette={palette} />
          )) : <Text style={styles.empty}>No people added yet.</Text>}
        </SurfaceCard>
        <View style={styles.composer}>
          <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={addDraft} placeholder="Add a name" placeholderTextColor={palette.secondaryText} style={styles.input} returnKeyType="done" />
          <Pressable accessibilityRole="button" accessibilityLabel="Add person" onPress={addDraft} style={styles.add}>
            <Icon name="add" size={21} color="#253021" />
          </Pressable>
        </View>
        {availableSuggestions.length ? (
          <View style={styles.suggestions}>
            {availableSuggestions.map((person) => (
              <Pressable key={person} onPress={() => setSelected((current) => addCompanion(current, person))} style={styles.suggestion}>
                <Text style={styles.suggestionText}>+ {person}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <PrimaryButton title={`Save ${selected.length} ${selected.length === 1 ? 'person' : 'people'}`} icon="checkmark" onPress={save} />
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { gap: Spacing.md, paddingTop: Spacing.sm },
  heading: { color: palette.text, fontSize: Typography.fontSize.lg, fontWeight: '700' },
  helper: { color: palette.secondaryText, fontSize: Typography.fontSize.xs },
  list: { gap: 3, padding: Spacing.xs },
  empty: { color: palette.secondaryText, fontSize: Typography.fontSize.sm, padding: Spacing.md },
  composer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  input: { flex: 1, minHeight: 46, borderRadius: BorderRadius.xl, backgroundColor: palette.card, color: palette.text, paddingHorizontal: Spacing.md, fontSize: Typography.fontSize.sm },
  add: { width: 42, height: 42, borderRadius: 21, backgroundColor: palette.accent, alignItems: 'center', justifyContent: 'center' },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  suggestion: { minHeight: 34, paddingHorizontal: Spacing.sm, borderRadius: 17, backgroundColor: palette.cardMuted, alignItems: 'center', justifyContent: 'center' },
  suggestionText: { color: palette.text, fontSize: Typography.fontSize.xs, fontWeight: '600' },
});
