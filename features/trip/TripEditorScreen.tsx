import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppPalette, AppScreen, Chip, ContentContainer, ScreenHeader } from '@/components/layout/AppScreen';
import { Spacing, Typography } from '@/theme/designSystem';

export function TripEditorScreen({ creating = false }: { creating?: boolean }) {
  const [title, setTitle] = useState(creating ? '' : 'Trip to Chengdu');
  const [content, setContent] = useState(creating ? '' : 'A joyful summer memory in Chengdu.');
  const [mood, setMood] = useState('🙂');

  return (
    <AppScreen mode="dark" scroll keyboardSafe contentContainerStyle={styles.screen} bottomInset={80}>
      <ContentContainer>
        <ScreenHeader
          mode="dark"
          title={creating ? 'New Trip' : 'Trip to Chengdu'}
          right={<Pressable onPress={() => router.replace('/(tabs)/home')}><Text style={styles.done}>Done</Text></Pressable>}
        />
        <View style={styles.photo}>
          {creating ? (
            <View style={styles.emptyPhoto}>
              <Ionicons name="camera-outline" size={40} color={AppPalette.dark.secondaryText} />
              <Text style={styles.help}>Add a cover photo</Text>
            </View>
          ) : (
            <Image source={{ uri: 'https://picsum.photos/id/1025/700/700' }} style={styles.photoImage} />
          )}
        </View>
        <View style={styles.editorCard}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Trip title"
            placeholderTextColor={AppPalette.dark.secondaryText}
            style={styles.titleInput}
          />
          <Pressable onPress={() => router.push('/trip/1/mood')} style={styles.mood}>
            <Text style={styles.moodText}>{mood}</Text>
          </Pressable>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write about this trip..."
            placeholderTextColor={AppPalette.dark.secondaryText}
            multiline
            style={styles.bodyInput}
          />
          <Text style={styles.date}>July 24, 2025</Text>
        </View>
        <View style={styles.chips}>
          <Chip mode="dark" label="Location" icon="location-outline" onPress={() => router.push('/trip/1/location')} />
          <Chip mode="dark" label="People" icon="people-outline" onPress={() => router.push('/trip/1/people')} />
        </View>
      </ContentContainer>
      <View style={styles.toolbar}>
        {['color-wand-outline', 'text-outline', 'image-outline', 'camera-outline', 'mic-outline', 'send-outline', 'add-circle-outline'].map((icon) => (
          <Ionicons key={icon} name={icon as any} color={AppPalette.dark.text} size={23} />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: 0 },
  done: { color: AppPalette.dark.accentStrong, fontWeight: '700', fontSize: Typography.fontSize.md },
  photo: { width: '100%', aspectRatio: 1, borderRadius: 15, overflow: 'hidden', backgroundColor: AppPalette.dark.card },
  photoImage: { width: '100%', height: '100%' },
  emptyPhoto: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  help: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.md },
  editorCard: { backgroundColor: AppPalette.dark.card, marginTop: -1, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, padding: Spacing.md, minHeight: 174 },
  titleInput: { color: AppPalette.dark.text, fontSize: 25, fontWeight: '700', padding: 0, paddingRight: 58 },
  mood: { position: 'absolute', right: Spacing.md, top: Spacing.md },
  moodText: { fontSize: 31 },
  bodyInput: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, minHeight: 66, textAlignVertical: 'top', paddingTop: Spacing.lg },
  date: { color: AppPalette.dark.text, fontSize: Typography.fontSize.xl, fontWeight: '700', textAlign: 'center' },
  chips: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  toolbar: { minHeight: 66, marginTop: Spacing.lg, backgroundColor: '#2e2d2d', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: Spacing.sm, paddingHorizontal: Spacing.md },
});
