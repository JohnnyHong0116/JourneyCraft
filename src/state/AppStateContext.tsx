import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PROFILE, mergeProfile, UserProfile, usernameFromCredential } from './profileModel';

const STORAGE_KEY = 'journeycraft.session.v1';

interface StoredSession {
  profile: UserProfile;
  authenticated: boolean;
}

interface AppStateValue {
  profile: UserProfile;
  authenticated: boolean;
  hydrated: boolean;
  signIn: (username: string) => Promise<void>;
  signUp: (profile: Partial<UserProfile>) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: StoredSession = {
  profile: DEFAULT_PROFILE,
  authenticated: false,
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoredSession>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          const saved = JSON.parse(stored) as Partial<StoredSession>;
          setSession({
            profile: mergeProfile(DEFAULT_PROFILE, saved.profile ?? {}),
            authenticated: saved.authenticated ?? false,
          });
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const persist = useCallback(async (next: StoredSession) => {
    setSession(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const signIn = useCallback(async (username: string) => {
    await persist({
      authenticated: true,
      profile: mergeProfile(session.profile, {
        username: usernameFromCredential(username, session.profile.username),
      }),
    });
  }, [persist, session.profile]);

  const signUp = useCallback(async (updates: Partial<UserProfile>) => {
    await persist({
      authenticated: true,
      profile: mergeProfile(session.profile, updates),
    });
  }, [persist, session.profile]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    await persist({
      ...session,
      profile: mergeProfile(session.profile, updates),
    });
  }, [persist, session]);

  const logout = useCallback(async () => {
    await persist({ ...session, authenticated: false });
  }, [persist, session]);

  const value = useMemo<AppStateValue>(() => ({
    profile: session.profile,
    authenticated: session.authenticated,
    hydrated,
    signIn,
    signUp,
    updateProfile,
    logout,
  }), [hydrated, logout, session, signIn, signUp, updateProfile]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return value;
}
