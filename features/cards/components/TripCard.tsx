import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
  Icon
} from '@/components/Icon';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/theme/designSystem';
import { Trip } from '@/types/trip';

const { width: screenWidth } = Dimensions.get('window');

interface TripCardProps {
  trip: Trip;
  showGroupLabel?: boolean;
  groupLabel?: string;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  showGroupLabel = false,
  groupLabel
}) => {
  const colorScheme = useColorScheme() || 'light';

  const handleCardPress = () => {
    router.push(`/trip/${trip.id}` as any);
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'overjoyed': return '#FF6B6B';
      case 'happy': return '#4ECDC4';
      case 'neutral': return '#45B7D1';
      case 'sad': return '#96CEB4';
      case 'depressed': return '#FFEAA7';
      default: return '#DDA0DD';
    }
  };

  const hasMedia = trip.photos.length > 0 || trip.audioCount > 0 || trip.videoCount > 0;
  const hasCompanions = trip.companions && trip.companions.length > 0;
  const isNewCard = !hasMedia && !trip.mood && !trip.isSaved && !trip.isLocked && !hasCompanions;

  return (
    <View style={styles.container}>
      {showGroupLabel && groupLabel && (
        <View style={styles.groupLabelContainer}>
          <Text style={styles.groupLabel}>{groupLabel}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.cardContainer}
        onPress={handleCardPress}
        activeOpacity={0.9}
      >
        <View style={styles.leftContent}>
          {!isNewCard && (
            <View style={styles.leftIcons}>
              {trip.isSaved && (
                <View style={styles.iconContainer}>
                  <Icon name="cardsave" size={15} color={Colors.black} />
                </View>
              )}
              {trip.isLocked && (
                <View style={styles.iconContainer}>
                  <Icon name="cardlock" size={15} color={Colors.black} />
                </View>
              )}
              {hasCompanions && (
                <View style={styles.iconContainer}>
                  <Icon name="cardpeople" size={15} color={Colors.black} />
                </View>
              )}
            </View>
          )}
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>{trip.title}</Text>
            <Text style={styles.date}>
              {new Date(trip.displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
            <Text style={styles.location} numberOfLines={1}>{trip.location}</Text>
          </View>
        </View>

        <View style={styles.coverImageContainer}>
          {trip.photos.length > 0 ? (
            <Image source={{ uri: trip.photos[0] }} style={styles.coverImage} resizeMode="cover" />
          ) : (
            <View style={styles.coverPlaceholder} />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.bottomSection}>
        {trip.mood && !isNewCard && (
          <View style={[styles.moodDot, { backgroundColor: getMoodColor(trip.mood) }]} />
        )}
        <View style={styles.rightSection}>
          {!isNewCard && (
            <View style={styles.mediaIcons}>
              {trip.photos.length > 0 && (
                <View style={styles.mediaIconContainer}>
                  <Icon name="cardimage" size={16} color={Colors.black} />
                </View>
              )}
              {trip.audioCount > 0 && (
                <View style={styles.mediaIconContainer}>
                  <Icon name="cardmic" size={16} color={Colors.black} />
                </View>
              )}
              {trip.videoCount > 0 && (
                <View style={styles.mediaIconContainer}>
                  <Icon name="cardvideo" size={16} color={Colors.black} />
                </View>
              )}
            </View>
          )}
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="threedotsSmaller" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: Spacing.md, },
  groupLabelContainer: { marginBottom: Spacing.sm, paddingLeft: Spacing.lg, },
  groupLabel: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.black, textTransform: 'capitalize', },
  cardContainer: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.md,
    marginHorizontal: Spacing.lg, ...Shadows.small, elevation: 3, minHeight: 115,
  },
  leftContent: { flexDirection: 'row', flex: 1, marginRight: Spacing.md, },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: '700', color: Colors.black, lineHeight: Typography.lineHeight.tight, marginBottom: Spacing.sm, },
  date: { fontSize: Typography.fontSize.sm, fontWeight: '800', color: Colors.black, marginBottom: Spacing.xs, },
  location: { fontSize: Typography.fontSize.sm, fontWeight: '800', color: Colors.black, },
  leftIcons: { width: 28, marginRight: Spacing.sm, alignItems: 'flex-start', gap: Spacing.xs, },
  iconContainer: { width: 28, height: 20, justifyContent: 'center', alignItems: 'center', },
  leftIcon: { tintColor: Colors.black, } as any,
  textContent: { flex: 1, justifyContent: 'space-between', },
  coverImageContainer: { width: 60, height: 60, borderRadius: BorderRadius.lg, overflow: 'hidden', alignSelf: 'flex-start', marginTop: Spacing.sm, },
  coverImage: { width: '100%', height: '100%', },
  coverPlaceholder: { width: '100%', height: '100%', backgroundColor: Colors.black, borderRadius: BorderRadius.lg, },
  bottomSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginTop: Spacing.sm, },
  moodDot: { width: 25, height: 25, borderRadius: 12.5, borderWidth: 2, borderColor: Colors.white, ...Shadows.small, },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, },
  moreButton: { width: 24, height: 30, justifyContent: 'center', alignItems: 'center', },
  moreIcon: { tintColor: Colors.black, } as any,
  mediaIcons: { flexDirection: 'row', gap: Spacing.xs, },
  mediaIconContainer: { width: 18, height: 30, justifyContent: 'center', alignItems: 'center', },
  mediaIcon: { tintColor: Colors.black, } as any,
});
