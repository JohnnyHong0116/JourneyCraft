import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SemanticIcon } from '@/components/Icon';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme/designSystem';
import { AppPalette } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { Trip } from '@/types/trip';
import { TripCard } from '../../cards/components/TripCard';
import { useTranslation } from '@/i18n/useTranslation';

interface PinnedSectionProps {
  pinnedTrips: Trip[];
  onPinToggle: (tripId: string) => void;
  onDelete: (tripId: string) => void;
  renderTrip?: (trip: Trip) => React.ReactNode;
}

export const PinnedSection: React.FC<PinnedSectionProps> = ({
  pinnedTrips,
  onPinToggle,
  onDelete,
  renderTrip,
}) => {
  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const { t } = useTranslation();
  const styles = createStyles(palette);
  const [isExpanded, setIsExpanded] = useState(true);
  const [animation] = useState(new Animated.Value(1));

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  if (pinnedTrips.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Text style={styles.title}>{t('home.pinned')}</Text>
        <Animated.View
          style={[
            styles.chevron,
            {
              transform: [
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-90deg', '0deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <SemanticIcon name="chevron-down" size={20} color={palette.text} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.content,
          {
            maxHeight: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000], // 足够大的高度来容纳所有pinned trips
            }),
            opacity: animation,
          },
        ]}
      >
        {pinnedTrips.map((trip) => (
          <React.Fragment key={trip.id}>
            {renderTrip ? renderTrip(trip) : (
              <TripCard
                trip={trip}
                onPinToggle={onPinToggle}
                onDelete={onDelete}
              />
            )}
          </React.Fragment>
        ))}
      </Animated.View>
    </View>
  );
};

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: palette.text,
    textTransform: 'capitalize',
  },
  chevron: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    overflow: 'hidden',
  },
});
