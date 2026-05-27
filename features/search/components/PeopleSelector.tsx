import React, { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SemanticIcon } from '@/components/Icon';
import { AppPalette, SurfaceCard } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { useTranslation } from '@/i18n/useTranslation';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';
import type { Person } from '@/types/person';
import { formatPersonDisplayName, getPersonInitials } from '../peopleSearchModel';

interface PeopleSelectorProps {
  people: readonly Person[];
  selectedPersonIds: readonly string[];
  onTogglePerson: (personId: string) => void;
}

export function PeopleSelector({
  people,
  selectedPersonIds,
  onTogglePerson,
}: PeopleSelectorProps) {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});
  const columnCount = width < 360 ? 4 : 5;
  const visiblePeople = useMemo(
    () => expanded ? people : people.slice(0, columnCount),
    [columnCount, expanded, people],
  );

  return (
    <SurfaceCard style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={expanded ? t('common.less') : t('common.more')}
        onPress={() => setExpanded((current) => !current)}
        style={styles.toggle}
      >
        <Text style={styles.toggleText}>{expanded ? t('common.less') : t('common.more')}</Text>
        <SemanticIcon
          name={expanded ? 'chevron-up' : 'chevron-forward'}
          size={18}
          color={palette.accentStrong}
        />
      </Pressable>
      <View style={styles.grid}>
        {visiblePeople.map((person) => {
          const selected = selectedPersonIds.includes(person.id);
          return (
            <Pressable
              key={person.id}
              accessibilityRole="button"
              accessibilityLabel={t('search.filterByPerson', { person: person.displayName })}
              accessibilityState={{ selected }}
              onPress={() => onTogglePerson(person.id)}
              style={[styles.option, { width: `${100 / columnCount}%` }]}
            >
              <View style={[styles.avatarRing, selected && styles.avatarRingSelected]}>
                <View style={styles.initialAvatar}>
                  <Text style={styles.initialText}>{getPersonInitials(person.displayName)}</Text>
                  {person.avatarUri && !failedAvatars[person.id] ? (
                    <Image
                      source={{ uri: person.avatarUri }}
                      style={styles.avatarImage}
                      resizeMode="cover"
                      onError={() => setFailedAvatars((current) => ({ ...current, [person.id]: true }))}
                    />
                  ) : null}
                </View>
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.name}
              >
                {formatPersonDisplayName(person.displayName)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SurfaceCard>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  card: { paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm, paddingBottom: Spacing.md, gap: Spacing.sm },
  toggle: { alignSelf: 'flex-end', minHeight: 28, paddingHorizontal: Spacing.xs, flexDirection: 'row', alignItems: 'center', gap: 3 },
  toggleText: { color: palette.accentStrong, fontWeight: '700', fontSize: Typography.fontSize.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' },
  option: { alignItems: 'center', paddingHorizontal: 3, paddingBottom: Spacing.sm, gap: 5 },
  avatarRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    padding: 3,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  avatarRingSelected: { borderColor: palette.accentStrong },
  initialAvatar: {
    flex: 1,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4d3d3',
  },
  avatarImage: { ...StyleSheet.absoluteFillObject, borderRadius: BorderRadius.round },
  initialText: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: '#151515' },
  name: { maxWidth: 72, color: palette.secondaryText, fontSize: Typography.fontSize.xs, textAlign: 'center' },
});
