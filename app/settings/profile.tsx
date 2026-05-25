import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, FormField, PrimaryButton, ScreenHeader } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { UserProfile } from '@/state/profileModel';
import { Spacing, Typography } from '@/theme/designSystem';

export default function EditProfileScreen() {
  const { profile, updateProfile } = useAppState();
  const [draft, setDraft] = useState<UserProfile>(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const updateDraft = (field: keyof UserProfile, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const save = async () => {
    await updateProfile(draft);
    router.back();
  };

  return (
    <AppScreen mode="dark" scroll keyboardSafe>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Edit Profile" mode="dark" />
        <View style={styles.avatar}>
          <Ionicons name="person" size={94} color="#080909" />
        </View>
        <Text style={styles.change}>Change Profile Picture</Text>
        <FormField mode="dark" label="Username" icon="person-outline" value={draft.username} onChangeText={(value) => updateDraft('username', value)} right={<Ionicons name="pencil-outline" size={23} color="#fff" />} />
        <FormField mode="dark" label="Password" icon="lock-closed-outline" value="****************" editable={false} right={<Ionicons name="pencil-outline" size={23} color="#fff" />} />
        <FormField mode="dark" label="Date of Birth" icon="calendar-outline" value={draft.dateOfBirth} onChangeText={(value) => updateDraft('dateOfBirth', value)} placeholder="Add your date of birth" right={<Ionicons name="pencil-outline" size={23} color="#fff" />} />
        <FormField mode="dark" label="Email" icon="mail-outline" value={draft.email} onChangeText={(value) => updateDraft('email', value)} placeholder="Add your email" keyboardType="email-address" autoCapitalize="none" right={<Ionicons name="pencil-outline" size={23} color="#fff" />} />
        <FormField mode="dark" label="Phone" icon="call-outline" value={draft.phone} onChangeText={(value) => updateDraft('phone', value)} placeholder="Add your phone" keyboardType="phone-pad" right={<Ionicons name="pencil-outline" size={23} color="#fff" />} />
        <FormField mode="dark" label="Gender" icon="people-outline" value={draft.gender} onChangeText={(value) => updateDraft('gender', value)} placeholder="Add gender" right={<Ionicons name="pencil-outline" size={23} color="#fff" />} />
        <FormField mode="dark" label="Location" icon="location-outline" value={draft.location} onChangeText={(value) => updateDraft('location', value)} placeholder="Add location" right={<Ionicons name="pencil-outline" size={23} color="#fff" />} />
        <Text style={styles.label}>Personal Bio</Text>
        <View style={styles.bio}>
          <TextInput
            value={draft.bio}
            onChangeText={(value) => updateDraft('bio', value)}
            placeholder="You can write your personal bio here..."
            placeholderTextColor={AppPalette.dark.secondaryText}
            multiline
            maxLength={100}
            style={styles.bioInput}
          />
          <Text style={styles.count}>{draft.bio.length}/100</Text>
        </View>
        <Text style={styles.label}>Profile Banner</Text>
        <Pressable style={styles.upload}>
          <Ionicons name="share-outline" size={27} color={AppPalette.dark.text} />
          <Text style={styles.uploadTitle}>Click to upload</Text>
          <Text style={styles.muted}>SVG, PNG, JPG, or GIF (max.50mb)</Text>
        </Pressable>
        <PrimaryButton mode="dark" title="Save Settings" icon="checkmark" onPress={save} />
      </ContentContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.sm, paddingBottom: Spacing.xxl },
  avatar: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#588764', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginVertical: Spacing.sm },
  change: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.xl },
  label: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, fontWeight: '700', marginBottom: Spacing.sm },
  bio: { height: 108, backgroundColor: AppPalette.dark.card, borderRadius: 15, padding: Spacing.md, marginBottom: Spacing.lg },
  bioInput: { color: AppPalette.dark.text, flex: 1, textAlignVertical: 'top', fontSize: Typography.fontSize.sm },
  count: { textAlign: 'right', color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.xs },
  upload: { backgroundColor: AppPalette.dark.card, minHeight: 150, borderRadius: 15, marginBottom: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  uploadTitle: { color: AppPalette.dark.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  muted: { color: AppPalette.dark.secondaryText, fontSize: Typography.fontSize.sm },
});
