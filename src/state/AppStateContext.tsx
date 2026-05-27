import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { DEFAULT_PROFILE, mergeProfile, UserProfile, usernameFromCredential } from './profileModel';
import type { AppLanguage } from '@/i18n/translations';
import {
  getThemeTransitionPlan,
  resolveThemeMode,
  ResolvedThemeMode,
  ThemePreference,
  THEME_TRANSITION_REVEAL_MS,
} from './themeModel';

const STORAGE_KEY = 'journeycraft.session.v1';
const WEB_TRANSITION_COVER_MS = 100;

interface StoredSession {
  profile: UserProfile;
  authenticated: boolean;
  themePreference: ThemePreference;
  language: AppLanguage;
}

interface AppStateValue {
  profile: UserProfile;
  authenticated: boolean;
  hydrated: boolean;
  themePreference: ThemePreference;
  language: AppLanguage;
  mode: ResolvedThemeMode;
  signIn: (username: string) => Promise<void>;
  signUp: (profile: Partial<UserProfile>) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  setLanguage: (language: AppLanguage) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: StoredSession = {
  profile: DEFAULT_PROFILE,
  authenticated: false,
  themePreference: 'system',
  language: 'en',
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredSession>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const systemScheme = useColorScheme();
  const resolvedMode = resolveThemeMode(session.themePreference, systemScheme);
  const [mode, setMode] = useState<ResolvedThemeMode>(resolvedMode);
  const [transitionVisual, setTransitionVisual] = useState<'snapshot' | 'web-veil' | null>(null);
  const [transitionSnapshotUri, setTransitionSnapshotUri] = useState<string | null>(null);
  const [webOverlayColor, setWebOverlayColor] = useState('#0e0e0e');
  const initialThemeResolvedRef = useRef(false);
  const transitionInFlightRef = useRef(false);
  const pendingSnapshotModeRef = useRef<ResolvedThemeMode | null>(null);
  const appRootRef = useRef<View>(null);
  const overlayOpacity = useSharedValue(0);
  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          const saved = JSON.parse(stored) as Partial<StoredSession>;
          setSession({
            profile: mergeProfile(DEFAULT_PROFILE, saved.profile ?? {}),
            authenticated: saved.authenticated ?? false,
            themePreference: saved.themePreference ?? 'system',
            language: saved.language === 'zh' ? 'zh' : 'en',
          });
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const persist = useCallback(async (next: StoredSession) => {
    setSession(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const finishThemeTransition = useCallback(() => {
    transitionInFlightRef.current = false;
    pendingSnapshotModeRef.current = null;
    setTransitionVisual(null);
    setTransitionSnapshotUri(null);
  }, []);

  const fadeOutTransition = useCallback((nextMode: ResolvedThemeMode) => {
    setMode(nextMode);
    overlayOpacity.value = withTiming(
      0,
      { duration: THEME_TRANSITION_REVEAL_MS, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished) {
          runOnJS(finishThemeTransition)();
        }
      },
    );
  }, [finishThemeTransition, overlayOpacity]);

  const revealSnapshot = useCallback(() => {
    const nextMode = pendingSnapshotModeRef.current;
    if (!nextMode) return;

    pendingSnapshotModeRef.current = null;
    fadeOutTransition(nextMode);
  }, [fadeOutTransition]);

  const abortSnapshotTransition = useCallback(() => {
    const nextMode = pendingSnapshotModeRef.current;
    if (nextMode) {
      setMode(nextMode);
    }
    finishThemeTransition();
  }, [finishThemeTransition]);

  const beginWebTransition = useCallback((nextMode: ResolvedThemeMode) => {
    setWebOverlayColor(nextMode === 'dark' ? '#0e0e0e' : '#f3f2ed');
    setTransitionVisual('web-veil');
    overlayOpacity.value = 0;
    requestAnimationFrame(() => {
      overlayOpacity.value = withTiming(
        1,
        { duration: WEB_TRANSITION_COVER_MS, easing: Easing.in(Easing.quad) },
        (finished) => {
          if (finished) {
            runOnJS(fadeOutTransition)(nextMode);
          }
        },
      );
    });
  }, [fadeOutTransition, overlayOpacity]);

  const beginThemeTransition = useCallback(async (nextMode: ResolvedThemeMode) => {
    const transition = getThemeTransitionPlan(mode, nextMode);
    if (!transition.shouldAnimate) {
      setMode(nextMode);
      return;
    }

    transitionInFlightRef.current = true;
    if (process.env.EXPO_OS === 'web') {
      beginWebTransition(nextMode);
      return;
    }

    if (!appRootRef.current) {
      setMode(nextMode);
      finishThemeTransition();
      return;
    }

    try {
      const uri = await captureRef(appRootRef.current, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      pendingSnapshotModeRef.current = nextMode;
      overlayOpacity.value = 1;
      setTransitionSnapshotUri(uri);
      setTransitionVisual('snapshot');
    } catch {
      setMode(nextMode);
      finishThemeTransition();
    }
  }, [beginWebTransition, finishThemeTransition, mode, overlayOpacity]);

  useEffect(() => {
    if (!hydrated) return;

    if (!initialThemeResolvedRef.current) {
      initialThemeResolvedRef.current = true;
      setMode(resolvedMode);
      return;
    }

    if (resolvedMode !== mode && !transitionInFlightRef.current) {
      beginThemeTransition(resolvedMode);
    }
  }, [beginThemeTransition, hydrated, mode, resolvedMode, transitionVisual]);

  const signIn = useCallback(async (username: string) => {
    await persist({
      authenticated: true,
      themePreference: session.themePreference,
      language: session.language,
      profile: mergeProfile(session.profile, {
        username: usernameFromCredential(username, session.profile.username),
      }),
    });
  }, [persist, session]);

  const signUp = useCallback(async (updates: Partial<UserProfile>) => {
    await persist({
      authenticated: true,
      themePreference: session.themePreference,
      language: session.language,
      profile: mergeProfile(session.profile, updates),
    });
  }, [persist, session]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    await persist({
      ...session,
      profile: mergeProfile(session.profile, updates),
    });
  }, [persist, session]);

  const setThemePreference = useCallback(async (themePreference: ThemePreference) => {
    await persist({ ...session, themePreference });
  }, [persist, session]);

  const setLanguage = useCallback(async (language: AppLanguage) => {
    await persist({ ...session, language });
  }, [persist, session]);

  const logout = useCallback(async () => {
    await persist({ ...session, authenticated: false });
  }, [persist, session]);

  const value = useMemo<AppStateValue>(() => ({
    profile: session.profile,
    authenticated: session.authenticated,
    hydrated,
    themePreference: session.themePreference,
    language: session.language,
    mode,
    signIn,
    signUp,
    updateProfile,
    setThemePreference,
    setLanguage,
    logout,
  }), [hydrated, logout, mode, session, setLanguage, setThemePreference, signIn, signUp, updateProfile]);

  return (
    <AppStateContext.Provider value={value}>
      <View ref={appRootRef} collapsable={false} style={styles.root}>
        {children}
        {transitionVisual === 'snapshot' && transitionSnapshotUri ? (
          <Animated.Image
            testID="theme-transition-snapshot"
            source={{ uri: transitionSnapshotUri }}
            resizeMode="cover"
            onLoad={revealSnapshot}
            onError={abortSnapshotTransition}
            style={[styles.transitionOverlay, overlayStyle]}
          />
        ) : null}
        {transitionVisual === 'web-veil' ? (
          <Animated.View
            testID="theme-transition-web-veil"
            pointerEvents="auto"
            style={[
              styles.transitionOverlay,
              { backgroundColor: webOverlayColor },
              overlayStyle,
            ]}
          />
        ) : null}
      </View>
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return value;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  transitionOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
});
