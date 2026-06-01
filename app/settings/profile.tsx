import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { AppPalette, AppScreen, ContentContainer, FormField, PrimaryButton, ScreenHeader } from '@/components/layout/AppScreen';
import { useAppState } from '@/state/AppStateContext';
import { UserProfile } from '@/state/profileModel';
import { BorderRadius, Spacing, Typography } from '@/theme/designSystem';
import { Icon, SemanticIcon } from '@/components/Icon';

const genderOptions = ['Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Custom'];

async function persistPickedImage(uri: string, name: string) {
  const dir = `${FileSystem.documentDirectory}profile`;
  if (!(await FileSystem.getInfoAsync(dir)).exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
  const dest = `${dir}/${name}.${ext}`;
  await FileSystem.deleteAsync(dest, { idempotent: true });
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}

export default function EditProfileScreen() {
  const { profile, updateProfile, mode } = useAppState();
  const palette = AppPalette[mode];
  const styles = createStyles(palette);
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [showDate, setShowDate] = useState(false);
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });
  const [customGender, setCustomGender] = useState('');

  useEffect(() => setDraft(profile), [profile]);

  const updateDraft = (field: keyof UserProfile, value: string | undefined) => setDraft((current) => ({ ...current, [field]: value }));

  const pickImage = async (field: 'avatarUri' | 'coverPhotoUri') => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted && permission.accessPrivileges !== 'limited') {
      Alert.alert('Photo access needed', 'Allow photo library access to update your profile image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      updateDraft(field, await persistPickedImage(result.assets[0].uri, field));
    }
  };

  const validate = () => {
    const emailOk = !draft.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email);
    const phoneOk = !draft.phone || /^[+\d][\d\s().-]{6,}$/.test(draft.phone);
    if (!draft.username.trim()) return 'Username is required.';
    if (!emailOk) return 'Enter a valid email.';
    if (!phoneOk) return 'Enter a valid phone number.';
    if (password.next || password.confirm || password.current) {
      if (profile.passwordHash && password.current !== profile.passwordHash) return 'Current password is incorrect.';
      if (password.next.length < 6) return 'New password must be at least 6 characters.';
      if (password.next !== password.confirm) return 'Passwords do not match.';
    }
    return '';
  };

  const save = async () => {
    const error = validate();
    if (error) return Alert.alert('Cannot save', error);
    const gender = draft.gender === 'Custom' ? customGender.trim() : draft.gender;
    await updateProfile({ ...draft, username: draft.username.trim(), email: draft.email.trim(), phone: draft.phone.trim(), location: draft.location.trim(), gender, passwordHash: password.next || profile.passwordHash });
    router.back();
  };

  return (
    <AppScreen keyboardSafe>
      <ContentContainer style={styles.shell}>
        <ScreenHeader title="Edit Profile" />
      </ContentContainer>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.avatar}>{draft.avatarUri ? <Image source={{ uri: draft.avatarUri }} style={styles.avatarImage} /> : <Icon name="profile-selected" size={94} color="#080909" />}</View>
        <Pressable onPress={() => pickImage('avatarUri')}><Text style={styles.change}>Change Profile Picture</Text></Pressable>
        <FormField label="Username" icon="person-outline" value={draft.username} onChangeText={(value) => updateDraft('username', value)} right={<SemanticIcon name="pencil-outline" size={23} color={palette.text} />} />
        <FormField label="Email" icon="mail-outline" value={draft.email} onChangeText={(value) => updateDraft('email', value)} placeholder="Add your email" keyboardType="email-address" autoCapitalize="none" />
        <FormField label="Phone" icon="call-outline" value={draft.phone} onChangeText={(value) => updateDraft('phone', value)} placeholder="Add your phone" keyboardType="phone-pad" />
        <Pressable onPress={() => setShowDate(true)}><FormField label="Birthday" icon="calendar-outline" value={draft.dateOfBirth} editable={false} placeholder="Add birthday" /></Pressable>
        {showDate ? <DateTimePicker value={draft.dateOfBirth ? new Date(draft.dateOfBirth) : new Date(2000, 0, 1)} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(_, date) => { if (Platform.OS !== 'ios') setShowDate(false); if (date) updateDraft('dateOfBirth', date.toISOString().slice(0, 10)); }} /> : null}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.chips}>{genderOptions.map((option) => <Pressable key={option} onPress={() => updateDraft('gender', option)} style={[styles.chip, draft.gender === option && styles.chipActive]}><Text style={styles.chipText}>{option}</Text></Pressable>)}</View>
        {draft.gender === 'Custom' ? <FormField label="Custom gender" value={customGender} onChangeText={setCustomGender} /> : null}
        <FormField label="Location" icon="location-outline" value={draft.location} onChangeText={(value) => updateDraft('location', value)} placeholder="Add location" />
        <Text style={styles.label}>Bio</Text>
        <View style={styles.bio}><TextInput value={draft.bio} onChangeText={(value) => updateDraft('bio', value)} placeholder="You can write your personal bio here..." placeholderTextColor={palette.secondaryText} multiline maxLength={160} style={styles.bioInput} /><Text style={styles.count}>{draft.bio.length}/160</Text></View>
        <Text style={styles.label}>Password</Text>
        <FormField placeholder="Current Password" secureTextEntry value={password.current} onChangeText={(current) => setPassword((p) => ({ ...p, current }))} />
        <FormField placeholder="New Password" secureTextEntry value={password.next} onChangeText={(next) => setPassword((p) => ({ ...p, next }))} />
        <FormField placeholder="Confirm Password" secureTextEntry value={password.confirm} onChangeText={(confirm) => setPassword((p) => ({ ...p, confirm }))} />
        <Text style={styles.label}>Profile Banner</Text>
        <Pressable style={styles.upload} onPress={() => pickImage('coverPhotoUri')}>
          {draft.coverPhotoUri ? <Image source={{ uri: draft.coverPhotoUri }} style={styles.banner} /> : <><SemanticIcon name="share-outline" size={27} color={palette.text} /><Text style={styles.uploadTitle}>Click to upload</Text><Text style={styles.muted}>PNG, JPG, or GIF</Text></>}
        </Pressable>
        <PrimaryButton title="Save Settings" icon="checkmark" onPress={save} />
      </ScrollView>
    </AppScreen>
  );
}

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  shell: { paddingTop: Spacing.sm },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.md },
  avatar: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#588764', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginVertical: Spacing.sm, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  change: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.md },
  label: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700', marginTop: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 9, borderRadius: 20, backgroundColor: palette.card },
  chipActive: { backgroundColor: palette.accent },
  chipText: { color: palette.text, fontWeight: '700' },
  bio: { height: 118, backgroundColor: palette.card, borderRadius: 15, padding: Spacing.md },
  bioInput: { color: palette.text, flex: 1, textAlignVertical: 'top', fontSize: Typography.fontSize.sm },
  count: { textAlign: 'right', color: palette.secondaryText, fontSize: Typography.fontSize.xs },
  upload: { backgroundColor: palette.card, minHeight: 150, borderRadius: 15, marginBottom: Spacing.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, overflow: 'hidden' },
  banner: { width: '100%', height: 150 },
  uploadTitle: { color: palette.text, fontSize: Typography.fontSize.md, fontWeight: '700' },
  muted: { color: palette.secondaryText, fontSize: Typography.fontSize.sm },
});
