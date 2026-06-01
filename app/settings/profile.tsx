import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { AppPalette, AppScreen, ContentContainer, PrimaryButton, ScreenHeader, SurfaceCard } from '@/components/layout/AppScreen';
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
  const themedStyles = createStyles(palette);
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [showDate, setShowDate] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
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
    await updateProfile({
      ...draft,
      username: draft.username.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      location: draft.location.trim(),
      gender,
      passwordHash: password.next || profile.passwordHash,
    });
    router.back();
  };

  return (
    <AppScreen keyboardSafe>
      <ContentContainer style={themedStyles.header}>
        <ScreenHeader title="Edit Profile" />
      </ContentContainer>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={themedStyles.scroll}>
        <ProfilePhotoEditor uri={draft.avatarUri} onPress={() => pickImage('avatarUri')} palette={palette} />

        <FormSection title="Public profile" palette={palette}>
          <ProfileField label="Username" icon="person-outline" value={draft.username} onChangeText={(value) => updateDraft('username', value)} palette={palette} />
          <SectionDivider palette={palette} />
          <ProfileField label="Location" icon="location-outline" value={draft.location} onChangeText={(value) => updateDraft('location', value)} placeholder="Add location" palette={palette} />
          <SectionDivider palette={palette} />
          <View style={styles.bio}>
            <View style={styles.bioHeading}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <Text style={styles.count}>{draft.bio.length}/160</Text>
            </View>
            <TextInput
              value={draft.bio}
              onChangeText={(value) => updateDraft('bio', value)}
              placeholder="Share a little about yourself"
              placeholderTextColor={palette.secondaryText}
              multiline
              maxLength={160}
              style={[styles.bioInput, themedStyles.bioInput]}
            />
          </View>
        </FormSection>

        <FormSection title="Personal details" palette={palette}>
          <ProfileField label="Email" icon="mail-outline" value={draft.email} onChangeText={(value) => updateDraft('email', value)} placeholder="Add email" keyboardType="email-address" autoCapitalize="none" palette={palette} />
          <SectionDivider palette={palette} />
          <ProfileField label="Phone" icon="call-outline" value={draft.phone} onChangeText={(value) => updateDraft('phone', value)} placeholder="Add phone number" keyboardType="phone-pad" palette={palette} />
          <SectionDivider palette={palette} />
          <Pressable accessibilityRole="button" onPress={() => setShowDate((current) => !current)} style={styles.dateRow}>
            <View style={styles.fieldIcon}><SemanticIcon name="calendar-outline" size={19} color={palette.accentStrong} /></View>
            <View style={styles.fieldCopy}>
              <Text style={styles.fieldLabel}>Birthday</Text>
              <Text style={[styles.dateValue, themedStyles.dateValue, !draft.dateOfBirth && styles.placeholder]}>{draft.dateOfBirth || 'Add birthday'}</Text>
            </View>
            <SemanticIcon name={showDate ? 'chevron-up' : 'chevron-down'} size={18} color={palette.secondaryText} />
          </Pressable>
          {showDate ? (
            <View style={styles.datePicker}>
              <DateTimePicker
                value={draft.dateOfBirth ? new Date(draft.dateOfBirth) : new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={(_, date) => {
                  if (Platform.OS !== 'ios') setShowDate(false);
                  if (date) updateDraft('dateOfBirth', date.toISOString().slice(0, 10));
                }}
              />
            </View>
          ) : null}
          <SectionDivider palette={palette} />
          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.chips}>
            {genderOptions.map((option) => (
              <Pressable key={option} onPress={() => updateDraft('gender', option)} style={[styles.chip, draft.gender === option && styles.chipActive]}>
                <Text style={[styles.chipText, draft.gender === option && styles.chipTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
          {draft.gender === 'Custom' ? (
            <ProfileField label="Custom gender" value={customGender} onChangeText={setCustomGender} placeholder="How should we describe you?" palette={palette} />
          ) : null}
        </FormSection>

        <FormSection title="Profile cover" palette={palette}>
          <Pressable accessibilityRole="button" onPress={() => pickImage('coverPhotoUri')} style={styles.coverPicker}>
            {draft.coverPhotoUri ? (
              <Image source={{ uri: draft.coverPhotoUri }} style={styles.banner} resizeMode="cover" />
            ) : (
              <View style={styles.coverPlaceholder}>
                <SemanticIcon name="images-outline" size={28} color={palette.accentStrong} />
              </View>
            )}
            <View style={styles.coverAction}>
              <SemanticIcon name="camera-outline" size={17} color="#ffffff" />
              <Text style={styles.coverActionText}>Change cover photo</Text>
            </View>
          </Pressable>
        </FormSection>

        <FormSection title="Security" palette={palette}>
          <Pressable accessibilityRole="button" onPress={() => setPasswordOpen((current) => !current)} style={styles.securityRow}>
            <View style={styles.fieldIcon}><SemanticIcon name="lock-closed-outline" size={19} color={palette.accentStrong} /></View>
            <Text style={[styles.securityLabel, themedStyles.securityLabel]}>Change password</Text>
            <SemanticIcon name={passwordOpen ? 'chevron-up' : 'chevron-down'} size={18} color={palette.secondaryText} />
          </Pressable>
          {passwordOpen ? (
            <View style={styles.passwordFields}>
              <ProfileField label="Current password" secureTextEntry value={password.current} onChangeText={(current) => setPassword((value) => ({ ...value, current }))} palette={palette} />
              <ProfileField label="New password" secureTextEntry value={password.next} onChangeText={(next) => setPassword((value) => ({ ...value, next }))} palette={palette} />
              <ProfileField label="Confirm password" secureTextEntry value={password.confirm} onChangeText={(confirm) => setPassword((value) => ({ ...value, confirm }))} palette={palette} />
            </View>
          ) : null}
        </FormSection>

        <PrimaryButton title="Save Changes" icon="checkmark" onPress={save} />
      </ScrollView>
    </AppScreen>
  );
}

function ProfilePhotoEditor({
  uri,
  onPress,
  palette,
}: {
  uri?: string;
  onPress: () => void;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Change profile picture" onPress={onPress} style={styles.avatarEditor}>
      <View style={[styles.avatar, { backgroundColor: palette.accent }]}>
        {uri ? <Image source={{ uri }} style={styles.avatarImage} /> : <Icon name="profile-selected" size={66} color="#253021" />}
      </View>
      <View style={[styles.avatarAction, { backgroundColor: palette.accentStrong }]}>
        <SemanticIcon name="camera-outline" size={17} color="#ffffff" />
      </View>
      <Text style={[styles.avatarLabel, { color: palette.accentStrong }]}>Change profile picture</Text>
    </Pressable>
  );
}

function FormSection({
  title,
  children,
  palette,
}: {
  title: string;
  children: React.ReactNode;
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: palette.secondaryText }]}>{title}</Text>
      <SurfaceCard style={styles.sectionCard}>{children}</SurfaceCard>
    </View>
  );
}

function SectionDivider({ palette }: { palette: typeof AppPalette.light | typeof AppPalette.dark }) {
  return <View style={[styles.divider, { backgroundColor: palette.divider }]} />;
}

function ProfileField({
  label,
  icon,
  palette,
  style,
  ...props
}: TextInputProps & {
  label: string;
  icon?: React.ComponentProps<typeof SemanticIcon>['name'];
  palette: typeof AppPalette.light | typeof AppPalette.dark;
}) {
  return (
    <View style={styles.field}>
      {icon ? <View style={styles.fieldIcon}><SemanticIcon name={icon} size={19} color={palette.accentStrong} /></View> : null}
      <View style={styles.fieldCopy}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput {...props} placeholderTextColor={palette.secondaryText} style={[styles.fieldInput, { color: palette.text }, style]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarEditor: { alignSelf: 'center', alignItems: 'center', paddingVertical: Spacing.sm },
  avatar: { width: 104, height: 104, borderRadius: 52, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: '100%', height: '100%' },
  avatarAction: { position: 'absolute', right: 8, top: 74, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ffffff' },
  avatarLabel: { paddingTop: Spacing.sm, fontSize: Typography.fontSize.sm, fontWeight: '700' },
  section: { gap: Spacing.sm },
  sectionTitle: { paddingHorizontal: Spacing.xs, fontSize: Typography.fontSize.xs, fontWeight: '700', textTransform: 'uppercase' },
  sectionCard: { padding: Spacing.md, borderRadius: BorderRadius.xl, gap: Spacing.md },
  divider: { height: StyleSheet.hairlineWidth },
  field: { minHeight: 49, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  fieldIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  fieldCopy: { flex: 1, minWidth: 0, gap: 2 },
  fieldLabel: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: '#7a7880' },
  fieldInput: { minHeight: 26, paddingVertical: 0, color: '#ffffff', fontSize: Typography.fontSize.md, fontWeight: '600' },
  bio: { gap: Spacing.xs },
  bioHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bioInput: { minHeight: 72, paddingVertical: 0, textAlignVertical: 'top', color: '#ffffff', fontSize: Typography.fontSize.sm, lineHeight: 20 },
  count: { color: '#7a7880', fontSize: Typography.fontSize.xs },
  dateRow: { minHeight: 49, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dateValue: { color: '#ffffff', fontSize: Typography.fontSize.md, fontWeight: '600' },
  placeholder: { color: '#7a7880' },
  datePicker: { alignItems: 'flex-start', paddingLeft: 38 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { minHeight: 34, justifyContent: 'center', paddingHorizontal: Spacing.md, borderRadius: 17, backgroundColor: 'rgba(128,128,128,0.16)' },
  chipActive: { backgroundColor: '#b7d58d' },
  chipText: { color: '#7a7880', fontSize: Typography.fontSize.xs, fontWeight: '700' },
  chipTextActive: { color: '#253021' },
  coverPicker: { height: 132, overflow: 'hidden', borderRadius: BorderRadius.lg },
  banner: { width: '100%', height: '100%' },
  coverPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(128,128,128,0.14)' },
  coverAction: { position: 'absolute', left: Spacing.sm, bottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.56)', borderRadius: 16, paddingHorizontal: Spacing.sm, minHeight: 32 },
  coverActionText: { color: '#ffffff', fontSize: Typography.fontSize.xs, fontWeight: '700' },
  securityRow: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  securityLabel: { flex: 1, color: '#ffffff', fontSize: Typography.fontSize.md, fontWeight: '600' },
  passwordFields: { gap: Spacing.md },
});

const createStyles = (palette: typeof AppPalette.light | typeof AppPalette.dark) => StyleSheet.create({
  header: { paddingTop: Spacing.sm },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl, gap: Spacing.lg },
  fieldInput: { color: palette.text },
  bioInput: { color: palette.text },
  dateValue: { color: palette.text },
  securityLabel: { color: palette.text },
});
