import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AppPalette, AppScreen, Chip, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { getEmotionConfig } from '@/constants/emotions';
import { useAppState } from '@/state/AppStateContext';
import { Spacing, Typography } from '@/theme/designSystem';
import type { TripMood } from '@/types/trip';
import { TRIP_UTILITY_TOOLBAR_HEIGHT, TripUtilityToolbar } from './TripUtilityToolbar';
import { Icon } from '@/components/Icon';
import { mockTrips } from '@/data/mockApp';
import { getTripById } from './tripDetailModel';

export function TripEditorScreen({ creating = false, tripId }: { creating?: boolean; tripId?: string }) {
  const trip = tripId ? getTripById(mockTrips, tripId) : undefined;
  const [title, setTitle] = useState(creating ? '' : trip?.title ?? 'Untitled memory');
  const [content, setContent] = useState('');
  const [mood] = useState<TripMood>(trip?.mood ?? 'happy');

  const { mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const emotion = getEmotionConfig(mood);
  const activeTripId = tripId ?? '1';
  const coverUri = trip?.photos[0];
  const displayDate = trip
    ? new Date(trip.displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <AppScreen
      scroll
      keyboardSafe
      contentContainerStyle={styles.screen}
      bottomInset={Spacing.md}
      footerHeight={TRIP_UTILITY_TOOLBAR_HEIGHT}
      footer={(bottomInset) => (
        <TripUtilityToolbar
          bottomInset={bottomInset}
          actions={[
            { key: 'enhance', icon: 'sparkle', accessibilityLabel: 'Enhance note' },
            { key: 'text', icon: 'textformat', accessibilityLabel: 'Format text', active: true },
            { key: 'photo', icon: 'cardimage', accessibilityLabel: 'Choose photo' },
            { key: 'camera', icon: 'camera', accessibilityLabel: 'Take photo' },
            { key: 'audio', icon: 'microphone', accessibilityLabel: 'Record audio' },
            { key: 'share', icon: 'send', accessibilityLabel: 'Share trip' },
            { key: 'add', icon: 'add', accessibilityLabel: 'Add trip item' },
          ]}
        />
      )}
    >
      <ContentContainer>
        <ScreenHeader
          title={creating ? 'New Trip' : trip?.title ?? 'Memory'}
          right={<Pressable onPress={() => router.back()}><Text style={styles.done}>Done</Text></Pressable>}
        />
        <View style={styles.photo}>
          {!coverUri ? (
            <View style={styles.emptyPhoto}>
              <Icon name="camera" size={40} color={palette.secondaryText} />
              <Text style={styles.help}>Add a cover photo</Text>
            </View>
          ) : (
            <Image source={{ uri: coverUri }} style={styles.photoImage} />
          )}
        </View>
        <View style={styles.editorCard}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Trip title"
            placeholderTextColor={palette.secondaryText}
            style={styles.titleInput}
          />
          <Pressable onPress={() => router.push(`/trip/${activeTripId}/mood` as any)} style={styles.mood}>
            <Icon name={emotion.icon} size={31} />
          </Pressable>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write about this trip..."
            placeholderTextColor={palette.secondaryText}
            multiline
            style={styles.bodyInput}
          />
          {displayDate ? <Text style={styles.date}>{displayDate}</Text> : null}
        </View>
        <View style={styles.chips}>
          <Chip label="Location" icon="location-outline" onPress={() => router.push(`/trip/${activeTripId}/location` as any)} />
          <Chip label="People" icon="people-outline" onPress={() => router.push(`/trip/${activeTripId}/people` as any)} />
        </View>
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  screen: { paddingBottom: 0 },
  done: { color: palette.accentStrong, fontWeight: '700', fontSize: Typography.fontSize.md },
  photo: { width: '100%', aspectRatio: 1, borderRadius: 15, overflow: 'hidden', backgroundColor: palette.card },
  photoImage: { width: '100%', height: '100%' },
  emptyPhoto: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  help: { color: palette.secondaryText, fontSize: Typography.fontSize.md },
  editorCard: { backgroundColor: palette.card, marginTop: -1, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: Spacing.md, minHeight: 174 },
  titleInput: { color: palette.text, fontSize: 25, fontWeight: '700', padding: 0, paddingRight: 58 },
  mood: { position: 'absolute', right: Spacing.md, top: Spacing.md },
  bodyInput: { color: palette.text, fontSize: Typography.fontSize.md, minHeight: 66, textAlignVertical: 'top', paddingTop: Spacing.lg },
  date: { color: palette.text, fontSize: Typography.fontSize.xl, fontWeight: '700', textAlign: 'center' },
  chips: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
});
