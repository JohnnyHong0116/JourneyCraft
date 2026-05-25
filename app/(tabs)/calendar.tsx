import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SemanticIcon } from '@/components/Icon';
import { router, useLocalSearchParams } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, SegmentedControl, SurfaceCard } from '@/components/layout/AppScreen';
import { plannedDays } from '@/data/mockApp';
import { useAppState } from '@/state/AppStateContext';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';

type TimelineMode = 'visited' | 'planned';

const dates = Array.from({ length: 35 }, (_, index) => index - 3);

export default function CalendarTab() {
  const params = useLocalSearchParams<{ mode?: TimelineMode }>();
  const [mode, setMode] = useState<TimelineMode>(params.mode === 'planned' ? 'planned' : 'visited');
  const { mode: themeMode } = useAppState();
  const palette = AppPalette[themeMode];
  const styles = createStyles(palette);

  return (
    <AppScreen scroll bottomInset={128}>
      <ContentContainer style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title}>JourneyCraft</Text>
          <Pressable style={styles.circle} onPress={() => router.replace('/(tabs)/home')}>
            <SemanticIcon name="list-outline" size={22} color={palette.text} />
          </Pressable>
        </View>
        <SegmentedControl
          value={mode}
          onChange={setMode}
          options={[{ value: 'visited', label: 'Visited' }, { value: 'planned', label: 'Planned' }]}
        />
        <SurfaceCard style={styles.calendar}>
          <View style={styles.month}>
            <SemanticIcon name="chevron-back" size={23} color={palette.text} />
            <Text style={styles.monthText}>July 2025</Text>
            <SemanticIcon name="chevron-forward" size={23} color={palette.text} />
          </View>
          <View style={styles.week}>
            {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
              <Text key={day} style={styles.weekLabel}>{day}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {dates.map((date, index) => {
              const current = date > 0 && date < 32;
              const selected = current && (mode === 'planned' ? [3, 16, 17, 24, 27].includes(date) : date === 19);
              return (
                <View key={`${date}-${index}`} style={[styles.day, selected && styles.selectedDay]}>
                  <Text style={[styles.dayText, !current && styles.disabled]}>{current ? date : date <= 0 ? 27 + date : date - 31}</Text>
                  {mode === 'visited' && current ? <Text style={styles.mood}>{date % 5 === 0 ? '☺' : '🙂'}</Text> : null}
                </View>
              );
            })}
          </View>
        </SurfaceCard>
        <SurfaceCard style={styles.itinerary}>
          <Text style={styles.range}>•  Tuesday, 24 July - 27 July, 2025</Text>
          {mode === 'planned' ? (
            plannedDays.map((day) => (
              <View key={day.day} style={styles.planRow}>
                <View style={styles.planText}>
                  <Text style={styles.planTitle}>{day.label}</Text>
                  <Text style={styles.location}>{day.location}</Text>
                </View>
                <Ionicons name={day.complete ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={palette.accentStrong} />
              </View>
            ))
          ) : (
            <View style={styles.moodRow}>
              {['😄', '🙂', '😐', '☹', '😣'].map((mood) => <Text key={mood} style={styles.bigMood}>{mood}</Text>)}
            </View>
          )}
        </SurfaceCard>
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.lg, gap: Spacing.lg },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '700', color: palette.text },
  circle: { backgroundColor: palette.cardMuted, width: 34, height: 34, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  calendar: { padding: Spacing.md, borderWidth: 2, borderColor: palette.divider },
  month: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  monthText: { fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  week: { flexDirection: 'row', marginTop: Spacing.md },
  weekLabel: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 10, color: palette.secondaryText },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.sm },
  day: { width: `${100 / 7}%`, minHeight: 45, alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.md },
  selectedDay: { backgroundColor: '#b7d58d' },
  dayText: { fontSize: Typography.fontSize.xs, color: palette.text, fontWeight: '600' },
  disabled: { color: '#adadb1' },
  mood: { fontSize: 17, marginTop: 2 },
  itinerary: { gap: Spacing.md },
  range: { fontSize: Typography.fontSize.sm, color: '#253021', fontWeight: '600' },
  planRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.divider },
  planText: { flex: 1 },
  planTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: palette.text },
  location: { fontSize: Typography.fontSize.xs, color: palette.secondaryText, marginTop: 3 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.md },
  bigMood: { fontSize: 30 },
});
