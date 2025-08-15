import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Modal, Animated, Easing, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../theme/designSystem';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WeChatIcon, AppleIcon, GoogleIcon } from '@ui/SocialIcons';
import SegmentedAuthControl, { AuthTab } from '@ui/SegmentedAuthControl';
import AuthHeader from '@ui/AuthHeader';
import DateTimePicker from '@react-native-community/datetimepicker';

const CONTENT_WIDTH = 360;

type Props = { initialTab?: AuthTab };

const AuthScreen: React.FC<Props> = ({ initialTab = 'login' }) => {
  const [active, setActive] = useState<AuthTab>(initialTab);
  const slideX = useRef(new Animated.Value(0)).current;

  // Login state
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  // Sign up state
  const [suUsername, setSuUsername] = useState('');
  const [dobDate, setDobDate] = useState<Date>(new Date());
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [gender, setGender] = useState('Male');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [suLocation, setSuLocation] = useState('');
  const [suShowPassword, setSuShowPassword] = useState(false);
  const [suShowConfirmPassword, setSuShowConfirmPassword] = useState(false);

  // Dismiss keyboard when tapping outside of text inputs
  // Reference to the ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [keyboardShown, setKeyboardShown] = useState(false);
  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardShown(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardShown(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // We'll use the built-in keyboard avoiding behavior instead of custom listeners

  const formatDate = (d?: Date) => {
    if (!d) return 'Select date of birth';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const animateTo = (tab: AuthTab) => {
    Animated.timing(slideX, {
      toValue: tab === 'signup' ? -CONTENT_WIDTH : 0,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const handleTabChange = (next: AuthTab) => {
    if (next === active) return;
    // Dismiss keyboard when switching tabs
    Keyboard.dismiss();
    setActive(next);
    animateTo(next);
  };

  const suppressNextFocusRef = useRef(false);

  const handleInputFocus = () => {
    if (suppressNextFocusRef.current) {
      suppressNextFocusRef.current = false;
      Keyboard.dismiss();
    }
  };

  const isValidEmail = (val: string) => {
    // Simplified RFC5322-compatible check; matches common cases from Figma behavior
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(val.trim());
  };

  const handleLoginSubmit = () => {
    // ...submit auth when backend is ready
  };

  const handleSignupSubmit = () => {
    // Email is validated inline; prevent submit if invalid
    if (email.trim().length === 0 || !isValidEmail(email)) return;
    // ...submit signup when backend is ready
  };

  const emailInvalid = email.trim().length > 0 && !isValidEmail(email);

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
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.select({ ios: 4, android: 2 })}
            enabled>
            <ScrollView 
              ref={scrollViewRef}
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: keyboardShown ? 32 : 12 }} 
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View>
            {/* Header */}
            <View style={{ width: CONTENT_WIDTH, alignSelf: 'center' }}>
              <AuthHeader />
            </View>

            {/* Segmented Selector */}
            <View style={{ width: CONTENT_WIDTH, alignSelf: 'center' }}>
              <SegmentedAuthControl active={active} onChange={handleTabChange} />
            </View>

            {/* Animated forms area (only below selector moves) */}
            <View style={{ width: CONTENT_WIDTH, alignSelf: 'center', marginTop: Spacing.lg, overflow: 'hidden' }}>
              <Animated.View style={{ width: CONTENT_WIDTH * 2, flexDirection: 'row', transform: [{ translateX: slideX }] }}>
                {/* Login form */}
                <View style={{ width: CONTENT_WIDTH }}>
                  {/* Username/Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username / Email</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="account" size={24} color={Colors.black} />
                      <TextInput style={styles.textInput} value={username} onChangeText={setUsername} placeholder="Enter username or email" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                    </View>
                  </View>
                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="lock" size={24} color={Colors.black} />
                      <TextInput style={styles.textInput} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholder="Enter password" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon} accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                        <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color={Colors.black} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* Location */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Location</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="map-marker" size={24} color={Colors.black} />
                      <TextInput style={styles.textInput} value={location} onChangeText={setLocation} placeholder="Select location" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                      <MaterialCommunityIcons name="chevron-down" size={22} color={Colors.black} />
                    </View>
                  </View>

                  {/* Remember & Forgot */}
                  <View style={styles.rememberSection}>
                    <TouchableOpacity
                      style={styles.rememberMeTouch}
                      onPress={() => setRememberMe(!rememberMe)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: rememberMe }}
                    >
                      <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
                      <Text style={styles.rememberText}>Remember me</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>

                  {/* CTA */}
                  <TouchableOpacity style={styles.loginButton} onPress={handleLoginSubmit}>
                    <Text style={styles.loginButtonText}>Log in</Text>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Or Login with</Text>
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

                {/* Sign Up form */}
                <View style={{ width: CONTENT_WIDTH }}>
                  {/* Username */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="account" size={24} color={Colors.black} />
                      <TextInput style={styles.textInput} value={suUsername} onChangeText={setSuUsername} placeholder="Enter username" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                      <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                    </View>
                  </View>

                  {/* DOB */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Date of Birth</Text>
                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.7} onPress={() => { suppressNextFocusRef.current = true; Keyboard.dismiss(); setDobModalVisible(true); }}>
                      <MaterialCommunityIcons name="calendar" size={24} color={Colors.black} />
                      <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                        <Text style={styles.selectorText}>{formatDate(dobDate)}</Text>
                      </View>
                      <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                    </TouchableOpacity>
                  </View>

                  {/* Gender */}
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
                    <View style={[styles.inputContainer, styles.inputContainerPhone]}>
                      <MaterialCommunityIcons name="phone" size={24} color={Colors.black} />
                      <View style={styles.phoneRow}>
                        <TextInput style={styles.countryCode} value={countryCode} onChangeText={setCountryCode} placeholder="+86" keyboardType="phone-pad" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                        <MaterialCommunityIcons name="chevron-down" size={18} color={Colors.black} />
                        <TextInput style={styles.phoneNumber} value={phone} onChangeText={setPhone} placeholder="Enter phone number" keyboardType="phone-pad" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                      </View>
                      <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                    </View>
                  </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="email" size={24} color={Colors.black} />
                      <TextInput style={styles.textInput} value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                      <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                    </View>
                    {emailInvalid && (
                      <View style={styles.errorCallout}>
                        <MaterialCommunityIcons name="alert" size={20} color={Colors.error} />
                        <Text style={styles.errorCalloutText}>Invalid Email Address!!!</Text>
                      </View>
                    )}
                  </View>

                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="lock" size={24} color={Colors.black} />
                      <TextInput style={styles.textInput} value={suPassword} onChangeText={setSuPassword} secureTextEntry={!suShowPassword} placeholder="Enter password" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                      <TouchableOpacity onPress={() => setSuShowPassword(!suShowPassword)}>
                        <Ionicons name={suShowPassword ? 'eye' : 'eye-off'} size={24} color={Colors.black} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirm Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Re-enter  Password</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="lock-check" size={24} color={Colors.black} />
                      <TextInput style={styles.textInput} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!suShowConfirmPassword} placeholder="Re-enter password" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                      <TouchableOpacity onPress={() => setSuShowConfirmPassword(!suShowConfirmPassword)}>
                        <Ionicons name={suShowConfirmPassword ? 'eye' : 'eye-off'} size={24} color={Colors.black} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Location */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Location</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="map-marker" size={24} color={Colors.black} />
                      <TextInput style={styles.textInput} value={suLocation} onChangeText={setSuLocation} placeholder="Select location" placeholderTextColor={Colors.textSecondary} onFocus={handleInputFocus} />
                      <MaterialCommunityIcons name="chevron-down" size={22} color={Colors.black} />
                    </View>
                  </View>

                  {/* CTA */}
                  <TouchableOpacity style={styles.loginButton} onPress={handleSignupSubmit}>
                    <Text style={styles.loginButtonText}>Sign Up</Text>
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
              </Animated.View>
            </View>
            </View>
            </TouchableWithoutFeedback>
            
            {/* DOB Modal */}
            <Modal transparent visible={dobModalVisible} animationType="fade" onRequestClose={() => setDobModalVisible(false)}>
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => {
                Keyboard.dismiss();
                setDobModalVisible(false);
              }}>
                <View style={styles.modalSheet}>
                  <View style={styles.modalHandle} />
                  <View style={styles.pickerContainer}>
                    <DateTimePicker value={dobDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { if (Platform.OS === 'android') { setDobModalVisible(false); if (d) setDobDate(d); } else if (d) { setDobDate(d); } }} maximumDate={new Date()} themeVariant="light" textColor="#000000" style={{ alignSelf: 'center' }} />
                  </View>
                                      {Platform.OS === 'ios' && (
                      <TouchableOpacity style={styles.modalDone} onPress={() => {
                        Keyboard.dismiss();
                        setDobModalVisible(false);
                      }}>
                        <Text style={styles.modalDoneText}>Done</Text>
                      </TouchableOpacity>
                    )}
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Gender Modal */}
            <Modal transparent visible={genderModalVisible} animationType="fade" onRequestClose={() => setGenderModalVisible(false)}>
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => {
                Keyboard.dismiss();
                setGenderModalVisible(false);
              }}>
                <View style={styles.modalSheet}>
                  <View style={styles.modalHandle} />
                  {['Male', 'Female', 'Other'].map((opt) => (
                    <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => { 
                      Keyboard.dismiss();
                      setGender(opt); 
                      setGenderModalVisible(false); 
                    }}>
                      <Text style={styles.modalOptionText}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: Typography.fontSize.md, fontWeight: 'bold', color: Colors.black, marginBottom: Spacing.sm },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, borderWidth: 0 },
  inputContainerPhone: { paddingHorizontal: Spacing.md, height: 53 },
  textInput: { flex: 1, marginLeft: Spacing.sm, fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.black },
  selectorText: { fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.black },
  eyeIcon: { marginLeft: Spacing.sm },
  rememberSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  rememberMeTouch: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8 },
  checkbox: { width: 16, height: 16, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.borderBrandTertiary, backgroundColor: Colors.white },
  checkboxChecked: { backgroundColor: Colors.addButton, borderColor: Colors.addButton },
  rememberText: { fontSize: Typography.fontSize.sm, fontWeight: '500', color: Colors.black, letterSpacing: Typography.letterSpacing.wider },
  forgotPassword: { fontSize: Typography.fontSize.sm, fontWeight: '500', color: Colors.black, letterSpacing: Typography.letterSpacing.wider },
  loginButton: { backgroundColor: Colors.addButton, borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, alignItems: 'center', marginBottom: Spacing.md, ...Shadows.small },
  loginButtonText: { fontSize: Typography.fontSize.md, fontWeight: 'bold', color: Colors.white },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.calendarGrid },
  dividerText: { fontSize: Typography.fontSize.xs, color: Colors.black, marginHorizontal: Spacing.lg, letterSpacing: Typography.letterSpacing.widest },
  socialButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.lg },
  socialButton: { flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: Colors.calendarGrid, height: 45, padding: 0 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 16, paddingBottom: 24, paddingHorizontal: 20, alignItems: 'center' },
  modalHandle: { alignSelf: 'center', width: 48, height: 5, borderRadius: 2.5, backgroundColor: '#E0E0E0', marginBottom: 12 },
  pickerContainer: { width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  modalDone: { padding: 16, alignItems: 'center' },
  modalDoneText: { fontSize: Typography.fontSize.md, color: Colors.black },
  modalOption: { paddingVertical: 18, paddingHorizontal: 20, width: '100%' },
  modalOptionText: { fontSize: Typography.fontSize.md, color: Colors.black, textAlign: 'center' },
  phoneRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  countryCode: { width: 60, fontSize: Typography.fontSize.md, color: Colors.black, paddingVertical: 0, marginRight: 4 },
  phoneNumber: { flex: 1, fontSize: Typography.fontSize.md, color: Colors.black, paddingVertical: 0 },
  errorCallout: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: BorderRadius.xl, borderWidth: 2, borderColor: Colors.error, backgroundColor: Colors.white },
  errorCalloutText: { color: Colors.black, fontSize: Typography.fontSize.lg, fontWeight: 'bold' },
});

export default AuthScreen;
