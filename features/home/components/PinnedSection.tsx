import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/theme/designSystem';
import { Trip } from '@/types/trip';
import { TripCard } from '../../cards/components/TripCard';

interface PinnedSectionProps {
  pinnedTrips: Trip[];
  onPinToggle: (tripId: string) => void;
  onDelete: (tripId: string) => void;
}

export const PinnedSection: React.FC<PinnedSectionProps> = ({
  pinnedTrips,
  onPinToggle,
  onDelete,
}) => {
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
        <Text style={styles.title}>Pinned</Text>
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
          <Ionicons name="chevron-down" size={20} color={Colors.textPrimary} />
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
          <TripCard
            key={trip.id}
            trip={trip}
            onPinToggle={onPinToggle}
            onDelete={onDelete}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: Colors.textPrimary,
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
