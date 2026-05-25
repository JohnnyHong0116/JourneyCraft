export interface UserProfile {
  username: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  bio: string;
  avatarUri?: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  username: 'Journey Traveler',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  location: '',
  bio: 'Collecting moments from every journey.',
};

export function usernameFromCredential(username: string, fallback: string): string {
  return username.trim() || fallback.trim() || DEFAULT_PROFILE.username;
}

export function mergeProfile(current: UserProfile, updates: Partial<UserProfile>): UserProfile {
  return {
    ...current,
    ...updates,
    username: usernameFromCredential(updates.username ?? current.username, current.username),
  };
}
