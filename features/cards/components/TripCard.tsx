import React, { useState, useRef, useEffect } from 'react';
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
import { CardMenu } from '@/components/ui/CardMenu';

const { width: screenWidth } = Dimensions.get('window');

interface TripCardProps {
  trip: Trip;
  showGroupLabel?: boolean;
  groupLabel?: string;
  onPinToggle?: (tripId: string) => void;
  onDelete?: (tripId: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  showGroupLabel = false,
  groupLabel,
  onPinToggle,
  onDelete
}) => {
  const colorScheme = useColorScheme() || 'light';
  const [cardMenuVisible, setCardMenuVisible] = useState(false);
  const moreButtonRef = useRef<any>(null);
  
  // 本地状态管理，用于立即更新UI
  const [localIsSaved, setLocalIsSaved] = useState(trip.isSaved || false);
  const [localIsLocked, setLocalIsLocked] = useState(trip.isLocked || false);

  // 当trip props更新时，同步本地状态
  useEffect(() => {
    setLocalIsSaved(trip.isSaved || false);
    setLocalIsLocked(trip.isLocked || false);
  }, [trip.isSaved, trip.isLocked, trip.isPinned]);

  const handleCardPress = () => {
    router.push(`/trip/${trip.id}` as any);
  };

  const handleMorePress = () => {
    setCardMenuVisible(true);
  };

  const handlePin = () => {
    // 调用父组件的回调
    if (onPinToggle) {
      onPinToggle(trip.id);
    }
    // TODO: 这里可以添加API调用来持久化状态
    console.log('Pin/Unpin trip:', trip.id);
  };

  const handleSave = () => {
    // 立即更新本地状态
    setLocalIsSaved(!localIsSaved);
    // TODO: 这里可以添加API调用来持久化状态
    console.log('Save/Unsave trip:', trip.id, !localIsSaved);
  };

  const handleLock = () => {
    // 立即更新本地状态
    setLocalIsLocked(!localIsLocked);
    // TODO: 这里可以添加API调用来持久化状态
    console.log('Lock/Unlock trip:', trip.id, !localIsLocked);
  };

  const handleDelete = () => {
    // 调用父组件的回调
    if (onDelete) {
      onDelete(trip.id);
    }
    // TODO: 这里可以添加API调用来持久化删除
    console.log('Delete trip:', trip.id);
  };



  const hasMedia = trip.photos.length > 0 || trip.audioCount > 0 || trip.videoCount > 0;
  const hasCompanions = trip.companions && trip.companions.length > 0;
  const isNewCard = !hasMedia && !trip.mood;

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
          <View style={styles.leftIcons}>
            <View style={styles.iconContainer}>
              <Icon name="cardsave" size={15} color={localIsSaved ? Colors.addButton : Colors.navbarUnselected} />
            </View>
            <View style={styles.iconContainer}>
              <Icon name="cardlock" size={15} color={localIsLocked ? Colors.addButton : Colors.navbarUnselected} />
            </View>
            <View style={styles.iconContainer}>
              <Icon name="cardpeople" size={15} color={hasCompanions ? Colors.addButton : Colors.navbarUnselected} />
            </View>
          </View>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>{trip.title}</Text>
            <Text style={styles.date}>
              {new Date(trip.displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
            <Text style={styles.location} numberOfLines={1}>{trip.location}</Text>
            <View style={styles.middleDivider} />
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
          <View style={styles.moodIconContainer}>
            <Icon name={trip.mood} size={25} color={Colors.textPrimary} />
          </View>
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
          <TouchableOpacity 
            ref={moreButtonRef}
            style={styles.moreButton}
            onPress={handleMorePress}
          >
            <Icon name="threedotsSmaller" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <CardMenu
        visible={cardMenuVisible}
        onDismiss={() => setCardMenuVisible(false)}
        anchor={moreButtonRef.current}
        onPin={handlePin}
        onSave={handleSave}
        onLock={handleLock}
        onDelete={handleDelete}
        isPinned={trip.isPinned}
        isSaved={localIsSaved}
        isLocked={localIsLocked}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: Spacing.md, },
  groupLabelContainer: { marginBottom: Spacing.sm, paddingLeft: Spacing.lg, },
  groupLabel: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.black, textTransform: 'capitalize', },
  cardContainer: {
    flexDirection: 'row', backgroundColor: Colors.cardTheme, borderRadius: BorderRadius.xl, padding: Spacing.md,
    marginHorizontal: Spacing.lg, marginVertical: Spacing.sm, ...Shadows.small, elevation: 3, minHeight: 140, position: 'relative', paddingBottom: Spacing.xxl,
  },
  leftContent: { flexDirection: 'row', flex: 1, marginRight: Spacing.sm, alignItems: 'flex-start', paddingTop: Spacing.sm, },
  title: { fontSize: 25, fontWeight: '700', color: Colors.textPrimary, lineHeight: 30, marginBottom: Spacing.md, flexBasis: '100%', },
  date: { fontSize: Typography.fontSize.sm, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.xs, marginRight: Spacing.lg, marginTop: Spacing.sm, },
  location: { fontSize: Typography.fontSize.sm, fontWeight: '800', color: Colors.textPrimary, flexShrink: 1, marginTop: Spacing.sm, },
  leftIcons: { width: 28, marginRight: Spacing.sm, alignItems: 'flex-start', gap: Spacing.xs, },
  iconContainer: { width: 28, height: 20, justifyContent: 'center', alignItems: 'center', },
  leftIcon: { tintColor: Colors.black, } as any,
  textContent: { flex: 1, justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', },
  coverImageContainer: { width: 70, height: 70, borderRadius: BorderRadius.lg, overflow: 'hidden', alignSelf: 'flex-start', marginTop: Spacing.sm, },
  coverImage: { width: '100%', height: '100%', },
  coverPlaceholder: { width: '100%', height: '100%', backgroundColor: Colors.textPrimary, borderRadius: BorderRadius.lg, },
  bottomSection: { position: 'absolute', left: Spacing.lg, right: Spacing.lg, bottom: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moodIconContainer: { width: 25, height: 25, justifyContent: 'center', alignItems: 'center', marginLeft: Spacing.lg, },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginLeft: -Spacing.md, },
  moreButton: { width: 24, height: 30, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.lg, },
  moreIcon: { tintColor: Colors.black, } as any,
  middleDivider: {height: StyleSheet.hairlineWidth, backgroundColor: Colors.textPrimary, marginTop: Spacing.md, marginLeft: -(40 + Spacing.sm), width: screenWidth - Spacing.lg * 2, alignSelf: 'stretch', },
  mediaIcons: { flexDirection: 'row', gap: Spacing.xs, },
  mediaIconContainer: { width: 18, height: 30, justifyContent: 'center', alignItems: 'center', },
  mediaIcon: { tintColor: Colors.black, } as any,
});
