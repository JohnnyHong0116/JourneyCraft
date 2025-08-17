import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Modal, Animated, Easing, Keyboard, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../theme/designSystem';
import { useKeyboardShift } from '../hooks/useKeyboardShift';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WeChatIcon, AppleIcon, GoogleIcon } from '@ui/SocialIcons';
import SegmentedAuthControl, { AuthTab } from '../components/SegmentedAuthControl';
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
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const { shiftY: loginShiftY, onFocus: onLoginFocus } = useKeyboardShift(20);

  // Sign up state
  const [suUsername, setSuUsername] = useState('');
  const [dobDate, setDobDate] = useState<Date>(new Date());
  const [tempDobDate, setTempDobDate] = useState<Date>(new Date()); // Temporary date before confirming
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [gender, setGender] = useState('Male');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [codeSuggestions, setCodeSuggestions] = useState<{ code: string; country: string }[]>([]);
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);
  const [email, setEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [suLocation, setSuLocation] = useState('');
  const [suShowPassword, setSuShowPassword] = useState(false);
  const [suShowConfirmPassword, setSuShowConfirmPassword] = useState(false);
  const suUsernameRef = useRef<TextInput>(null);
  const suEmailRef = useRef<TextInput>(null);
  const suPasswordRef = useRef<TextInput>(null);
  const suConfirmRef = useRef<TextInput>(null);
  const suLocationRef = useRef<TextInput>(null);
  const phoneCodeRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);

  // Dismiss keyboard when tapping outside of text inputs
  // Reference to the ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardShown(true);
        const h = (e as any)?.endCoordinates?.height ?? 0;
        setKeyboardHeight(h);
      },
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardShown(false);
        setKeyboardHeight(0);
        // Never reset scroll position when keyboard hides - keep user's context
        // This ensures the field they were editing stays visible
      },
    );
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
    setShowCodeDropdown(false);
    // Reset scroll position only when going to Login
    if (next === 'login' && scrollViewRef.current) {
      try { (scrollViewRef.current as any).scrollTo({ y: 0, animated: false }); } catch {}
    }
    // When going to Sign Up, keep the scroll position as is
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
  const dismissAll = () => {
    setShowCodeDropdown(false);
    Keyboard.dismiss();
  };
  // Keep the focused field visible for both Login and Sign Up
  const ensureVisible = (inputRef?: any) => {
    if (!scrollViewRef.current || !inputRef) return;
    
    // For both Login and Sign Up, measure and ensure visibility
    const windowH = Dimensions.get('window').height;
    const keyboardTop = windowH - (keyboardShown ? keyboardHeight : 0);
    const safeGap = 20;
    
    // Save the field's position so we can keep it visible after keyboard dismisses
    if (inputRef?.measureInWindow) {
      inputRef.measureInWindow((_x: number, y: number, _w: number, h: number) => {
        const inputBottom = y + h;
        const limit = keyboardTop - safeGap;
        
        // Always scroll to keep the field visible in the middle of available space
        const targetY = Math.max(0, y - 100); // Position field with padding above
        try {
          (scrollViewRef.current as any).scrollTo({ y: targetY, animated: true });
        } catch {}
      });
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
  const bottomPad = active === 'signup' && keyboardShown ? 56 : (active === 'login' ? 4 : 12);

  // Swipe gesture to switch between login/signup without changing existing UI
  const swipeThreshold = 40;
  // (swipe navigation removed per revert)

  // Only reset scroll position when switching to Login tab
  useEffect(() => {
    if (active === 'login' && scrollViewRef.current) {
      try { (scrollViewRef.current as any).scrollTo({ y: 0, animated: false }); } catch {}
    }
    // No scroll reset when switching to Sign Up - keep current position
  }, [active]);

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
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 10 })}
            enabled={active === 'signup'}>
            <ScrollView 
              ref={scrollViewRef}
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: bottomPad }} 
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              automaticallyAdjustKeyboardInsets={active === 'signup'}
              onScroll={(e) => { setScrollY(e.nativeEvent.contentOffset.y); if (showCodeDropdown) setShowCodeDropdown(false); }}
              scrollEventThrottle={16}
              scrollEnabled={active === 'signup'}
              bounces={active === 'signup'}
              overScrollMode="never">
            <TouchableWithoutFeedback onPress={dismissAll} accessible={false}>
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
                <Animated.View style={{ width: CONTENT_WIDTH, transform: [{ translateY: active === 'login' ? loginShiftY : 0 }] }}>
                  {/* Username/Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username / Email</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="account" size={24} color={Colors.black} />
                      <TextInput ref={usernameRef} style={styles.textInput} value={username} onChangeText={setUsername} placeholder="Enter username or email" placeholderTextColor={Colors.textSecondary} onFocus={() => { handleInputFocus(); onLoginFocus(usernameRef); }} keyboardType="email-address" textContentType="emailAddress" autoComplete="email" autoCorrect={false} allowFontScaling={false} />
                    </View>
                  </View>
                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="lock" size={24} color={Colors.black} />
                      <TextInput ref={passwordRef} style={styles.textInput} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholder="Enter password" placeholderTextColor={Colors.textSecondary} onFocus={() => { handleInputFocus(); onLoginFocus(passwordRef); }} textContentType="password" autoComplete="password" allowFontScaling={false} />
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
                      <TextInput ref={locationRef} style={styles.textInput} value={location} onChangeText={setLocation} placeholder="Select location" placeholderTextColor={Colors.textSecondary} onFocus={() => { handleInputFocus(); onLoginFocus(locationRef); }} allowFontScaling={false} />
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
                  <TouchableOpacity style={[styles.loginButton, styles.loginButtonNoShadow]} onPress={handleLoginSubmit}>
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
                </Animated.View>

                {/* Sign Up form */}
                <View style={{ width: CONTENT_WIDTH }}>
                  {/* Username */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="account" size={24} color={Colors.black} />
                      <TextInput ref={suUsernameRef} style={styles.textInput} value={suUsername} onChangeText={setSuUsername} placeholder="Enter username" placeholderTextColor={Colors.textSecondary} onFocus={() => { handleInputFocus(); ensureVisible(suUsernameRef.current); }} autoCorrect={false} allowFontScaling={false} />
                      <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                    </View>
                  </View>

                  {/* DOB */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Date of Birth</Text>
                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.7} onPress={() => { 
                      suppressNextFocusRef.current = true; 
                      Keyboard.dismiss(); 
                      setTempDobDate(dobDate); // Store current date as temp
                      setDobModalVisible(true); 
                    }}>
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
                        <View style={styles.codeBox}>
                          <Text style={{ fontSize: Typography.fontSize.md, color: Colors.black, marginRight: 1 }}>+</Text>
                          <TextInput
                            style={styles.countryCode}
                            value={countryCode}
                            placeholderTextColor={Colors.textSecondary}
                            // Render a leading plus visually without storing it
                            defaultValue={undefined}
                            onChangeText={(txt) => {
                              const digits = txt.replace(/\D/g, '');
                              setCountryCode(digits);
                              // lazy import to avoid top-level weight
                              import('../lib/phone/callingCodes').then(({ filterCallingCodes }) => {
                                setCodeSuggestions(filterCallingCodes(digits));
                                setShowCodeDropdown(true);
                              }).catch(() => {});
                            }}
                            placeholder="86"
                            keyboardType="number-pad"
                            onFocus={() => { handleInputFocus(); ensureVisible(phoneCodeRef.current); setShowCodeDropdown(true); }}
                            allowFontScaling={false}
                          />
                          {showCodeDropdown && codeSuggestions.length > 0 && (
                            <View style={styles.dropdown}>
                              {codeSuggestions.map((opt) => (
                                <TouchableOpacity key={opt.code} style={styles.dropdownItem} onPress={() => {
                                  setCountryCode(opt.code);
                                  setShowCodeDropdown(false);
                                }}>
                                  <Text style={styles.dropdownText}>{`+${opt.code}  ${opt.country}`}</Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.phoneNumberBox}>
                          <TextInput
                            style={styles.phoneNumber}
                            value={phone}
                            onChangeText={(t) => setPhone(t.replace(/\D/g, ''))}
                            placeholder="Enter phone number"
                            keyboardType="number-pad"
                            placeholderTextColor={Colors.textSecondary}
                            onFocus={() => { handleInputFocus(); ensureVisible(phoneNumberRef.current); }}
                            textContentType="telephoneNumber"
                            autoComplete="tel"
                            allowFontScaling={false}
                          />
                        </View>
                      </View>
                      <MaterialCommunityIcons name="pencil" size={22} color={Colors.black} />
                    </View>
                  </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="email" size={24} color={Colors.black} />
                      <TextInput ref={suEmailRef} style={styles.textInput} value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.textSecondary} onFocus={() => { handleInputFocus(); ensureVisible(suEmailRef.current); }} textContentType="emailAddress" autoComplete="email" autoCorrect={false} allowFontScaling={false} />
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
                      <TextInput ref={suPasswordRef} style={styles.textInput} value={suPassword} onChangeText={setSuPassword} secureTextEntry={!suShowPassword} placeholder="Enter password" placeholderTextColor={Colors.textSecondary} onFocus={() => { handleInputFocus(); ensureVisible(suPasswordRef.current); }} textContentType="newPassword" autoComplete="password-new" allowFontScaling={false} />
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
                      <TextInput ref={suConfirmRef} style={styles.textInput} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!suShowConfirmPassword} placeholder="Re-enter password" placeholderTextColor={Colors.textSecondary} onFocus={() => { handleInputFocus(); ensureVisible(suConfirmRef.current); }} allowFontScaling={false} />
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
                      <TextInput ref={suLocationRef} style={styles.textInput} value={suLocation} onChangeText={setSuLocation} placeholder="Select location" placeholderTextColor={Colors.textSecondary} onFocus={() => { handleInputFocus(); ensureVisible(suLocationRef.current); }} allowFontScaling={false} />
                      <MaterialCommunityIcons name="chevron-down" size={22} color={Colors.black} />
                    </View>
                  </View>

                  {/* CTA */}
                  <TouchableOpacity style={[styles.loginButton, styles.signupButton]} onPress={handleSignupSubmit}>
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
                // Cancel without saving changes
                setDobModalVisible(false);
              }}>
                <View style={styles.modalSheet}>
                  <View style={styles.modalHandle} />
                  <View style={styles.pickerContainer}>
                    <DateTimePicker 
                      value={tempDobDate} 
                      mode="date" 
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'} 
                      onChange={(e, d) => { 
                        // On Android, we need to handle the Done action here
                        if (Platform.OS === 'android') { 
                          setDobModalVisible(false); 
                          if (d) setDobDate(d); // Only on Android we commit immediately
                        } else if (d) { 
                          // On iOS, just update temp value until Done is pressed
                          setTempDobDate(d); 
                        } 
                      }} 
                      maximumDate={new Date()} 
                      themeVariant="light" 
                      textColor="#000000" 
                      style={{ alignSelf: 'center' }} 
                    />
                  </View>
                                      {Platform.OS === 'ios' && (
                      <TouchableOpacity style={styles.modalDone} onPress={() => {
                        Keyboard.dismiss();
                        // Save the temporary date when Done is pressed
                        setDobDate(tempDobDate);
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
  loginButton: { backgroundColor: Colors.addButton, borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, alignItems: 'center', marginBottom: Spacing.md },
  loginButtonNoShadow: { },
  signupButton: { marginTop: Spacing.lg },
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
  phoneRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  codeBox: { width: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingRight: 1 },
  countryCode: { flex: 1, fontSize: Typography.fontSize.md, color: Colors.black, paddingVertical: 0, marginLeft: 2, textAlign: 'left' },
  separator: { width: 1, height: 22, backgroundColor: Colors.calendarGrid, marginHorizontal: 2 },
  phoneNumberBox: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  phoneNumber: { flex: 1, fontSize: Typography.fontSize.md, color: Colors.black, paddingVertical: 0 },
  dropdown: { position: 'absolute', top: 42, left: -8, width: 220, backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 0.5, borderColor: Colors.calendarGrid, zIndex: 10, maxHeight: 240 },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
  dropdownText: { fontSize: Typography.fontSize.sm, color: Colors.black },
  errorCallout: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: BorderRadius.xl, borderWidth: 2, borderColor: Colors.error, backgroundColor: Colors.white },
  errorCalloutText: { color: Colors.black, fontSize: Typography.fontSize.lg, fontWeight: 'bold' },
});

export default AuthScreen;
