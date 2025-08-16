import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/designSystem';
import { 
  ChevronDownIcon, 
  PhoneIcon 
} from '../components/SvgIcon';
import { WeChatIcon, AppleIcon, GoogleIcon } from '../components/SocialIcons';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import SegmentedAuthControl from '../components/SegmentedAuthControl';
import AuthHeader from '../components/AuthHeader';
import { useKeyboardShift } from '../hooks/useKeyboardShift';

const CONTENT_WIDTH = 360;
const SEGMENTED_WIDTH = 360;
const SEGMENTED_HEIGHT = 36;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const { shiftY, onFocus } = useKeyboardShift(20);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  const pillX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(pillX, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [pillX]);

  const onPressLogin = () => {
    Animated.timing(pillX, { toValue: 0, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  };
  const onPressSignUp = () => {
    Animated.timing(pillX, { toValue: SEGMENTED_WIDTH / 2, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() => {
      // navigate after animation for smoothness
      (navigation as any).navigate('SignUp');
    });
  };

  const pillStyle = {
    transform: [{ translateX: pillX }],
  };

  return (
    <LinearGradient
      colors={[Colors.backgroundTop, '#E3EDDC', Colors.backgroundGreen]}
      locations={[0, 0.6, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />

        <KeyboardAvoidingView style={{ flex: 1 }} enabled={false}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: Spacing.xxxl }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            scrollEnabled={false}
          >
            {/* Header Section */}
            <View style={{ width: CONTENT_WIDTH, alignSelf: 'center' }}>
              <AuthHeader />
            </View>

            {/* Segmented Control */}
            <View style={{ width: CONTENT_WIDTH, alignSelf: 'center' }}>
              <SegmentedAuthControl
                active="login"
                onChange={(next) => {
                  if (next === 'signup') (navigation as any).navigate('SignUp');
                }}
              />
            </View>

            {/* Form Section */}
            <Animated.View style={[styles.form, { marginTop: Spacing.lg, width: CONTENT_WIDTH, alignSelf: 'center', transform: [{ translateY: shiftY }] }]}>
              {/* Username/Email Field */}
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
                    onFocus={() => onFocus(usernameRef)}
                  />
                </View>
              </View>

              {/* Password Field */}
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
                    onFocus={() => onFocus(passwordRef)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={24}
                      color={Colors.black}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Location Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="map-marker" size={24} color={Colors.black} />
                  <TextInput
                    ref={locationRef}
                    style={styles.textInput}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Select location"
                    placeholderTextColor={Colors.textSecondary}
                    onFocus={() => onFocus(locationRef)}
                  />
                  <ChevronDownIcon width={24} height={24} color={Colors.black} />
                </View>
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.rememberSection}>
                <View style={styles.rememberMe}>
                  <TouchableOpacity
                    style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                    onPress={() => setRememberMe(!rememberMe)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: rememberMe }}
                  >
                    <View style={styles.checkboxInner} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Log in</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or Login with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.socialButton}>
                  <WeChatIcon size={28} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <AppleIcon size={28} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <GoogleIcon size={28} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <PhoneIcon width={28} height={28} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { flexGrow: 1, paddingHorizontal: Spacing.lg },
  header: { alignItems: 'center', marginTop: Spacing.xxxl, marginBottom: Spacing.xl },
  logo: { fontSize: Typography.fontSize.xl, fontWeight: 'bold', color: Colors.black, marginBottom: Spacing.md, letterSpacing: Typography.letterSpacing.tight },
  title: { fontSize: Typography.fontSize.xxl, fontWeight: 'bold', color: Colors.black, textAlign: 'center', marginBottom: Spacing.md, letterSpacing: Typography.letterSpacing.tight, lineHeight: Typography.fontSize.xxl * Typography.lineHeight.normal },
  subtitle: { fontSize: Typography.fontSize.xs, color: Colors.black, textAlign: 'center', lineHeight: Typography.fontSize.xs * Typography.lineHeight.relaxed, letterSpacing: Typography.letterSpacing.widest, maxWidth: 222 },
  segmentedControl: { flexDirection: 'row', backgroundColor: Colors.inputSearchBackground, borderRadius: 10, padding: 2, marginBottom: Spacing.xl, width: SEGMENTED_WIDTH, height: SEGMENTED_HEIGHT, alignSelf: 'center', overflow: 'hidden' },
  pill: { position: 'absolute', left: 2, top: 2, width: SEGMENTED_WIDTH / 2 - 2, height: SEGMENTED_HEIGHT - 4, borderRadius: 7, backgroundColor: Colors.white, ...Shadows.small },
  segment: { flex: 1, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  activeSegmentText: { color: Colors.black },
  segmentText: { fontSize: Typography.fontSize.sm, fontWeight: 'bold', color: Colors.black, letterSpacing: Typography.letterSpacing.wider },
  form: { flex: 1 },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: Typography.fontSize.md, fontWeight: 'bold', color: Colors.black, marginBottom: Spacing.sm, letterSpacing: Typography.letterSpacing.wide },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, borderWidth: 0 },
  textInput: { flex: 1, marginLeft: Spacing.sm, fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.black, letterSpacing: Typography.letterSpacing.normal },
  eyeIcon: { marginLeft: Spacing.sm },
  rememberSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  rememberMe: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  checkbox: { width: 16, height: 16, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.borderBrandTertiary, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  checkboxInner: { width: 10, height: 10, borderRadius: BorderRadius.sm, backgroundColor: Colors.addButton },
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
});

export default LoginScreen;
