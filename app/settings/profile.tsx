import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AppPalette, AppScreen, ContentContainer, FormField, PrimaryButton, ScreenHeader } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { UserProfile } from '@/state/profileModel';
import { Spacing, Typography } from '@/theme/designSystem';
import { Icon, SemanticIcon } from '@/components/Icon';

export default function EditProfileScreen() {
  const { profile, updateProfile, mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
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
    <AppScreen scroll keyboardSafe>
      <ContentContainer style={styles.content}>
        <ScreenHeader title="Edit Profile" />
        <View style={styles.avatar}>
          <Icon name="profile-selected" size={94} color="#080909" />
        </View>
        <Text style={styles.change}>Change Profile Picture</Text>
        <FormField label="Username" icon="person-outline" value={draft.username} onChangeText={(value) => updateDraft('username', value)} right={<SemanticIcon name="pencil-outline" size={23} color={palette.text} />} />
        <FormField label="Password" icon="lock-closed-outline" value="****************" editable={false} right={<SemanticIcon name="pencil-outline" size={23} color={palette.text} />} />
        <FormField label="Date of Birth" icon="calendar-outline" value={draft.dateOfBirth} onChangeText={(value) => updateDraft('dateOfBirth', value)} placeholder="Add your date of birth" right={<SemanticIcon name="pencil-outline" size={23} color={palette.text} />} />
        <FormField label="Email" icon="mail-outline" value={draft.email} onChangeText={(value) => updateDraft('email', value)} placeholder="Add your email" keyboardType="email-address" autoCapitalize="none" right={<SemanticIcon name="pencil-outline" size={23} color={palette.text} />} />
        <FormField label="Phone" icon="call-outline" value={draft.phone} onChangeText={(value) => updateDraft('phone', value)} placeholder="Add your phone" keyboardType="phone-pad" right={<SemanticIcon name="pencil-outline" size={23} color={palette.text} />} />
        <FormField label="Gender" icon="people-outline" value={draft.gender} onChangeText={(value) => updateDraft('gender', value)} placeholder="Add gender" right={<SemanticIcon name="pencil-outline" size={23} color={palette.text} />} />
        <FormField label="Location" icon="location-outline" value={draft.location} onChangeText={(value) => updateDraft('location', value)} placeholder="Add location" right={<SemanticIcon name="pencil-outline" size={23} color={palette.text} />} />
        <Text style={styles.label}>Personal Bio</Text>
        <View style={styles.bio}>
          <TextInput
            value={draft.bio}
            onChangeText={(value) => updateDraft('bio', value)}
            placeholder="You can write your personal bio here..."
            placeholderTextColor={palette.secondaryText}
            multiline
            maxLength={100}
            style={styles.bioInput}
          />
          <Text style={styles.count}>{draft.bio.length}/100</Text>
        </View>
        <Text style={styles.label}>Profile Banner</Text>
        <Pressable style={styles.upload}>
          <SemanticIcon name="share-outline" size={27} color={palette.text} />
          <Text style={styles.uploadTitle}>Click to upload</Text>
          <Text style={styles.muted}>SVG, PNG, JPG, or GIF (max.50mb)</Text>
        </Pressable>
        <PrimaryButton title="Save Settings" icon="checkmark" onPress={save} />
      </ContentContainer>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  content: { paddingTop: Spacing.sm, paddingBottom: Spacing.xxl },
  avatar: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#588764', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginVertical: Spacing.sm },
  change: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.xl },
  label: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700', marginBottom: Spacing.sm },
  bio: { height: 108, backgroundColor: palette.card, borderRadius: 15, padding: Spacing.md, marginBottom: Spacing.lg },
  bioInput: { color: palette.text, flex: 1, textAlignVertical: 'top', fontSize: Typography.fontSize.sm },
  count: { textAlign: 'right', color: palette.secondaryText, fontSize: Typography.fontSize.xs },
  upload: { backgroundColor: palette.card, minHeight: 150, borderRadius: 15, marginBottom: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  uploadTitle: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  muted: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
});
