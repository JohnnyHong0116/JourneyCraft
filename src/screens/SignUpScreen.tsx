import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/designSystem';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { WeChatIcon, AppleIcon, GoogleIcon } from '../components/SocialIcons';
import { useNavigation } from '@react-navigation/native';
import SegmentedAuthControl from '../components/SegmentedAuthControl';
import AuthHeader from '../components/AuthHeader';

const CONTENT_WIDTH = 360;
const SEGMENTED_WIDTH = 360;
const SEGMENTED_HEIGHT = 36;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [dobDate, setDobDate] = useState<Date | undefined>(undefined);
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [gender, setGender] = useState('Male');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formatDate = (d?: Date) => {
    if (!d) return 'Select date of birth';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundTop, '#E3EDDC', Colors.backgroundGreen]}
      locations={[0, 0.6, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          keyboardVerticalOffset={Platform.select({ ios: 10, android: (StatusBar.currentHeight ?? 0) + 10 })}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={{ width: CONTENT_WIDTH, alignSelf: 'center' }}>
              <AuthHeader />
            </View>

            {/* Segmented Selector */}
            <View style={{ width: CONTENT_WIDTH, alignSelf: 'center' }}>
              <SegmentedAuthControl
                active="signup"
                onChange={(next) => {
                  if (next === 'login') (navigation as any).navigate('Login');
                }}
              />
            </View>

            {/* Form */}
            <View style={[styles.form, { marginTop: Spacing.lg, width: CONTENT_WIDTH, alignSelf: 'center' }]}>
              {/* Username */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="account" size={24} color={Colors.black} />
                  <TextInput
                    style={styles.textInput}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter username"
                    placeholderTextColor={Colors.textSecondary}
                  />
                  <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                </View>
              </View>

              {/* Date of Birth */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <TouchableOpacity style={styles.inputContainer} activeOpacity={0.7} onPress={() => setDobModalVisible(true)}>
                  <MaterialCommunityIcons name="calendar" size={24} color={Colors.black} />
                  <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                    <Text style={styles.selectorText}>{formatDate(dobDate)}</Text>
                  </View>
                  <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                </TouchableOpacity>
              </View>

              {/* Gender (Selector) */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gender</Text>
                <TouchableOpacity style={styles.inputContainer} activeOpacity={0.7} onPress={() => setGenderModalVisible(true)}>
                  <MaterialCommunityIcons name="human-male-female" size={24} color={Colors.black} />
                  <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                    <Text style={styles.selectorText}>{gender}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-down" size={22} color={Colors.black} />
                </TouchableOpacity>
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="phone" size={24} color={Colors.black} />
                  <View style={styles.phoneRow}>
                    <TextInput
                      style={styles.countryCode}
                      value={countryCode}
                      onChangeText={setCountryCode}
                      placeholder="+86"
                      keyboardType="phone-pad"
                      placeholderTextColor={Colors.textSecondary}
                    />
                    <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.black} />
                    <TextInput
                      style={styles.phoneNumber}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      placeholderTextColor={Colors.textSecondary}
                    />
                  </View>
                  <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="email" size={24} color={Colors.black} />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors.textSecondary}
                  />
                  <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="lock" size={24} color={Colors.black} />
                  <TextInput
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Enter password"
                    placeholderTextColor={Colors.textSecondary}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color={Colors.black} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Re-enter  Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="lock-check" size={24} color={Colors.black} />
                  <TextInput
                    style={styles.textInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="Re-enter password"
                    placeholderTextColor={Colors.textSecondary}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color={Colors.black} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="map-marker" size={24} color={Colors.black} />
                  <TextInput
                    style={styles.textInput}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Select location"
                    placeholderTextColor={Colors.textSecondary}
                  />
                  <MaterialCommunityIcons name="chevron-down" size={22} color={Colors.black} />
                </View>
              </View>

              {/* CTA */}
              <TouchableOpacity style={styles.cta}>
                <Text style={styles.ctaText}>Sign Up</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or Signup with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social */}
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}><WeChatIcon size={28} /></TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}><AppleIcon size={28} /></TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}><GoogleIcon size={28} /></TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}><Ionicons name="call" size={28} color="#000" /></TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* DOB Modal */}
          <Modal
            transparent
            visible={dobModalVisible}
            animationType="fade"
            onRequestClose={() => setDobModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDobModalVisible(false)}>
              <View style={styles.modalSheet}>
                <View style={styles.modalHandle} />
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={dobDate ?? new Date(2000, 0, 1)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, d) => {
                      if (Platform.OS === 'android') {
                        setDobModalVisible(false);
                      }
                      if (d) setDobDate(d);
                    }}
                    maximumDate={new Date()}
                    themeVariant="light"
                    textColor="#000000"
                    style={{ alignSelf: 'center' }}
                  />
                </View>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity style={styles.modalDone} onPress={() => setDobModalVisible(false)}>
                    <Text style={styles.modalDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Gender Modal */}
          <Modal
            transparent
            visible={genderModalVisible}
            animationType="fade"
            onRequestClose={() => setGenderModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setGenderModalVisible(false)}>
              <View style={styles.modalSheet}>
                <View style={styles.modalHandle} />
                {['Male', 'Female', 'Other'].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.modalOption}
                    onPress={() => { setGender(opt); setGenderModalVisible(false); }}
                  >
                    <Text style={styles.modalOptionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },
  header: { alignItems: 'center', marginTop: Spacing.xxxl, marginBottom: Spacing.xl },
  logo: { fontSize: Typography.fontSize.xl, fontWeight: 'bold', color: Colors.black, marginBottom: Spacing.md },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: 'bold', color: Colors.black, textAlign: 'center', marginBottom: Spacing.md },
  subtitle: { fontSize: Typography.fontSize.xs, color: Colors.black, textAlign: 'center', lineHeight: Typography.fontSize.xs * Typography.lineHeight.relaxed, letterSpacing: Typography.letterSpacing.widest, maxWidth: 222, alignSelf: 'center' },
  form: { flex: 1, marginTop: Spacing.lg },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: Typography.fontSize.md, fontWeight: 'bold', color: Colors.black, marginBottom: Spacing.sm },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, borderWidth: 0 },
  textInput: { flex: 1, marginLeft: Spacing.sm, fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.black },
  selectorText: { fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.black },
  phoneRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: Spacing.sm },
  countryCode: { width: 56, fontSize: Typography.fontSize.md, color: Colors.black },
  phoneNumber: { flex: 1, fontSize: Typography.fontSize.md, color: Colors.black },
  cta: { backgroundColor: Colors.addButton, borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, alignItems: 'center', marginBottom: Spacing.md, ...Shadows.small },
  ctaText: { fontSize: Typography.fontSize.md, fontWeight: 'bold', color: Colors.white },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.calendarGrid },
  dividerText: { fontSize: Typography.fontSize.xs, color: Colors.black, marginHorizontal: Spacing.lg },
  socialButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.lg },
  socialButton: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: Colors.calendarGrid, height: 45, padding: 0 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 8, paddingBottom: 16, alignItems: 'center' },
  modalHandle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', marginBottom: 8 },
  pickerContainer: { width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  modalDone: { padding: 16, alignItems: 'center' },
  modalDoneText: { fontSize: Typography.fontSize.md, color: Colors.black },
});

export default SignUpScreen;
