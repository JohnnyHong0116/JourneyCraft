import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Modal, Animated, Easing, Keyboard, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../theme/designSystem';
import { useKeyboardShiftOld, useKeyboardShift } from '../hooks/useKeyboardShift';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WeChatIcon, AppleIcon, GoogleIcon } from '@ui/SocialIcons';
import SegmentedAuthControl, { AuthTab } from '../components/SegmentedAuthControl';
import AuthHeader from '@ui/AuthHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../tokens';
import AreaCodeInline from '../components/AreaCodeInline';
import LocationAutocomplete from '../components/LocationAutocomplete';

const CONTENT_WIDTH = 360;

type Props = { initialTab?: AuthTab };

// ClearButton component for text input fields
const ClearButton = ({
  visible,
  onPress,
}: { visible: boolean; onPress: () => void }) => {
  if (!visible) return null;
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel="Clear text"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.clearBtn}
    >
      <Ionicons
        name="close"
        size={14}
        color={colors.light.utilities}
      />
    </TouchableOpacity>
  );
};

const AuthScreen: React.FC<Props> = ({ initialTab = 'login' }) => {
  const [active, setActive] = useState<AuthTab>(initialTab);
  const slideX = useRef(new Animated.Value(0)).current;

  // Login state
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  // Login uses the old version for性能
  const { shiftY: loginShiftY, onFocus: onLoginFocus } = useKeyboardShiftOld(20);
  // Sign up uses the new improved version
  const { shiftStyle: signupShiftStyle, onFocus: onSignupFocus, ensureVisible: ensureKeyboardVisible } = useKeyboardShift({
    safeGap: 20,
    maxUpwardShift: -280,
    minMoveThreshold: 10,
  });

  // Sign up state
  const [suUsername, setSuUsername] = useState('');
  const [dobDate, setDobDate] = useState<Date | null>(null); // 初始为 null
  const [tempDobDate, setTempDobDate] = useState<Date | null>(null); // 临时日期
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [gender, setGender] = useState(''); // 初始为 ''
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [suLocation, setSuLocation] = useState('');
  const [suShowPassword, setSuShowPassword] = useState(false);
  const [suShowConfirmPassword, setSuShowConfirmPassword] = useState(false);
  const [suUsernameFocused, setSuUsernameFocused] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [suPwFocused, setSuPwFocused] = useState(false);
  const [suCpwFocused, setSuCpwFocused] = useState(false);
  const [suLocationFocused, setSuLocationFocused] = useState(false);
  const suUsernameRef = useRef<TextInput>(null);
  const suEmailRef = useRef<TextInput>(null);
  const suPasswordRef = useRef<TextInput>(null);
  const suConfirmRef = useRef<TextInput>(null);
  const suLocationRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);

  // Check LocationIQ API key on app start
  useEffect(() => {
    console.log('LIQ KEY?', process.env.EXPO_PUBLIC_LOCATIONIQ_KEY ? 'present' : 'missing');
  }, []);

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

  const formatDate = (d?: Date | null) => {
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
     Keyboard.dismiss();
   };
  // ensureVisible is now handled by useKeyboardShift hook

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

  const isDobSelected = !!dobDate;
  const isGenderSelected = gender !== '';

  return (
    <LinearGradient
      colors={[Colors.backgroundTop, Colors.backgroundGreen, Colors.backgroundGreen]}
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
                             onScroll={(e) => { setScrollY(e.nativeEvent.contentOffset.y); }}
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
                <Animated.View style={{ width: CONTENT_WIDTH, transform: [{ translateY: loginShiftY }] }}>
                  {/* Username/Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username / Email</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="account" size={24} color={Colors.black} />
                      <TextInput 
                        ref={usernameRef} 
                        style={styles.textInput} 
                        value={username} 
                        onChangeText={setUsername} 
                        placeholder="Enter username or email" 
                        placeholderTextColor={Colors.textSecondary} 
                        onFocus={() => { handleInputFocus(); onLoginFocus(usernameRef); setUsernameFocused(true); }} 
                        onBlur={() => setUsernameFocused(false)}
                        keyboardType="email-address" 
                        textContentType="emailAddress" 
                        autoComplete="email" 
                        autoCorrect={false} 
                        allowFontScaling={false} 
                      />
                      <ClearButton
                        visible={usernameFocused && username.length > 0}
                        onPress={() => setUsername('')}
                      />
                    </View>
                  </View>
                  {/* Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="lock" size={24} color={Colors.black} />
                      <TextInput 
                        ref={passwordRef} 
                        style={styles.textInput} 
                        value={password} 
                        onChangeText={setPassword} 
                        secureTextEntry={!showPassword} 
                        placeholder="Enter password" 
                        placeholderTextColor={Colors.textSecondary} 
                        onFocus={() => { handleInputFocus(); onLoginFocus(passwordRef); setPasswordFocused(true); }} 
                        onBlur={() => setPasswordFocused(false)}
                        textContentType="password" 
                        autoComplete="password" 
                        allowFontScaling={false} 
                      />
                      <ClearButton
                        visible={passwordFocused && password.length > 0}
                        onPress={() => setPassword('')}
                      />
                      {password.length > 0 && (
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon} accessibilityRole="button" accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color={Colors.black} />
                        </TouchableOpacity>
                      )}
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
                <Animated.View style={[{ width: CONTENT_WIDTH }, active === 'signup' ? signupShiftStyle : null]}>
                  {/* Username */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="account" size={24} color={Colors.black} />
                      <TextInput 
                        ref={suUsernameRef} 
                        style={styles.textInput} 
                        value={suUsername} 
                        onChangeText={setSuUsername} 
                        placeholder="Enter username" 
                        placeholderTextColor={Colors.textSecondary} 
                        onFocus={() => {
                          handleInputFocus();
                          onSignupFocus!(suUsernameRef);
                          ensureKeyboardVisible!(suUsernameRef);
                          setSuUsernameFocused(true);
                        }} 
                        onBlur={() => setSuUsernameFocused(false)}
                        autoCorrect={false} 
                        allowFontScaling={false} 
                      />
                      <ClearButton
                        visible={suUsernameFocused && suUsername.length > 0}
                        onPress={() => setSuUsername('')}
                      />
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
                        <Text style={[styles.selectorText, { color: isDobSelected ? colors.light.utilities : Colors.textSecondary }]}>{formatDate(dobDate)}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Gender */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Gender</Text>
                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.7} onPress={() => setGenderModalVisible(true)}>
                      <MaterialCommunityIcons name="human-male-female" size={24} color={Colors.black} />
                      <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                        <Text style={[styles.selectorText, { color: isGenderSelected ? colors.light.utilities : Colors.textSecondary }]}>{isGenderSelected ? gender : 'Select gender'}</Text>
                      </View>
                      <MaterialCommunityIcons name="chevron-down" size={22} color={Colors.black} />
                    </TouchableOpacity>
                  </View>

                                     {/* Phone */}
                   <View style={styles.inputGroup}>
                     <Text style={styles.inputLabel}>Phone</Text>
                     <View style={styles.inputContainer}>
                       <MaterialCommunityIcons name="phone" size={24} color={Colors.black} />
                       
                       {/* Area code (no bounding box) + "|" + phone input; auto layout */}
                       <AreaCodeInline value={countryCode} onSelect={setCountryCode} />

                       <TextInput
                         style={[styles.textInput, { flex: 1 }]}
                         value={phone}
                         onChangeText={(t) => setPhone(t.replace(/\D/g, ''))}
                         placeholder="Phone number"
                         placeholderTextColor={Colors.textSecondary}
                         keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                         onFocus={() => {
                           handleInputFocus();
                           onSignupFocus!(phoneNumberRef);
                           ensureKeyboardVisible!(phoneNumberRef);
                           setPhoneFocused(true);
                         }}
                         onBlur={() => setPhoneFocused(false)}
                         textContentType="telephoneNumber"
                         autoComplete="tel"
                         allowFontScaling={false}
                       />

                       {/* Clear button for phone ONLY */}
                       {phoneFocused && phone.length > 0 ? (
                         <TouchableOpacity
                           onPress={() => setPhone('')}
                           accessibilityLabel="Clear phone"
                           hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                           style={{
                             width: 22,
                             height: 22,
                             borderRadius: 11,
                             alignItems: 'center',
                             justifyContent: 'center',
                             marginLeft: Spacing.xs,
                             marginRight: Spacing.xs,
                             backgroundColor: colors.light.buttonBg,
                           }}
                         >
                           <Ionicons name="close" size={14} color={colors.light.utilities} />
                         </TouchableOpacity>
                       ) : null}

                     </View>
                   </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="email" size={24} color={Colors.black} />
                      <TextInput 
                        ref={suEmailRef} 
                        style={styles.textInput} 
                        value={email} 
                        onChangeText={setEmail} 
                        placeholder="Enter email" 
                        keyboardType="email-address" 
                        autoCapitalize="none" 
                        placeholderTextColor={Colors.textSecondary} 
                        onFocus={() => {
                          handleInputFocus();
                          onSignupFocus!(suEmailRef);
                          ensureKeyboardVisible!(suEmailRef);
                          setEmailFocused(true);
                        }} 
                        onBlur={() => setEmailFocused(false)}
                        textContentType="emailAddress" 
                        autoComplete="email" 
                        autoCorrect={false} 
                        allowFontScaling={false} 
                      />
                      <ClearButton
                        visible={emailFocused && email.length > 0}
                        onPress={() => setEmail('')}
                      />
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
                      <TextInput 
                        ref={suPasswordRef} 
                        style={styles.textInput} 
                        value={suPassword} 
                        onChangeText={setSuPassword} 
                        secureTextEntry={!suShowPassword} 
                        placeholder="Enter password" 
                        placeholderTextColor={Colors.textSecondary} 
                        onFocus={() => {
                          handleInputFocus();
                          onSignupFocus!(suPasswordRef);
                          ensureKeyboardVisible!(suPasswordRef);
                          setSuPwFocused(true);
                        }} 
                        onBlur={() => setSuPwFocused(false)}
                        textContentType="newPassword" 
                        autoComplete="password-new" 
                        allowFontScaling={false} 
                      />
                      <ClearButton
                        visible={suPwFocused && suPassword.length > 0}
                        onPress={() => setSuPassword('')}
                      />
                      {suPassword.length > 0 && (
                        <TouchableOpacity onPress={() => setSuShowPassword(!suShowPassword)}>
                          <Ionicons name={suShowPassword ? 'eye' : 'eye-off'} size={24} color={Colors.black} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Confirm Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Re-enter  Password</Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons name="lock-check" size={24} color={Colors.black} />
                      <TextInput 
                        ref={suConfirmRef} 
                        style={styles.textInput} 
                        value={confirmPassword} 
                        onChangeText={setConfirmPassword} 
                        secureTextEntry={!suShowConfirmPassword} 
                        placeholder="Re-enter password" 
                        placeholderTextColor={Colors.textSecondary} 
                        onFocus={() => {
                          handleInputFocus();
                          onSignupFocus!(suConfirmRef);
                          ensureKeyboardVisible!(suConfirmRef);
                          setSuCpwFocused(true);
                        }} 
                        onBlur={() => setSuCpwFocused(false)}
                        allowFontScaling={false} 
                      />
                      <ClearButton
                        visible={suCpwFocused && confirmPassword.length > 0}
                        onPress={() => setConfirmPassword('')}
                      />
                      {confirmPassword.length > 0 && (
                        <TouchableOpacity onPress={() => setSuShowConfirmPassword(!suShowConfirmPassword)}>
                          <Ionicons name={suShowConfirmPassword ? 'eye' : 'eye-off'} size={24} color={Colors.black} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Location */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Location</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        // ensure dropdown isn't clipped by the row container
                        { overflow: 'visible', zIndex: 20 }
                      ]}
                    >
                      <MaterialCommunityIcons name="map-marker" size={24} color={Colors.black} />

                      <LocationAutocomplete
                        value={suLocation}
                        onCommit={(displayName, hit) => {
                          setSuLocation(displayName);
                          if (hit) {
                            // Optional: save coordinates and country for later use
                            // setGeo({ lat: hit.lat, lon: hit.lon, country: hit.country });
                          }
                        }}
                        minChars={2}            // 2 while testing; consider 3 in prod
                        dropdownOffsetY={48}
                        maxDropdownHeight={220}  // match AreaCodeInline height
                        useShortDisplay={true}   // use concise format: "City, State, Country"
                        language="en"
                        // countrycodes="us,gb" // optional narrowing
                        debug={true}            // turn off later
                        onFocus={() => setSuLocationFocused(true)}
                        onBlur={() => setSuLocationFocused(false)}
                      />

                      <ClearButton
                        visible={suLocationFocused && suLocation.length > 0}
                        onPress={() => setSuLocation('')}
                      />
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
                </Animated.View>
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
                      value={tempDobDate || new Date()} 
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
                        setDobDate(tempDobDate || null);
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

            {/* LocationIQ Attribution (required for free plan) */}
            <View style={styles.attributionContainer}>
              <Text style={styles.attributionText}>
                Search by <Text style={styles.attributionLink}>LocationIQ.com</Text>
              </Text>
            </View>
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

  errorCallout: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: BorderRadius.xl, borderWidth: 2, borderColor: Colors.error, backgroundColor: Colors.white },
  errorCalloutText: { color: Colors.black, fontSize: Typography.fontSize.lg, fontWeight: 'bold' },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
    marginRight: Spacing.xs,
    backgroundColor: colors.light.buttonBg,
  },
  attributionContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  attributionText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    opacity: 0.6,
  },
  attributionLink: {
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;
