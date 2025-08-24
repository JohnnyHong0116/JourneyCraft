// src/components/LocationAutocomplete.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../theme/designSystem';
import { searchCities, CityHit } from '../services/cities';

// shadow fallback
const SHADOW: any = (Shadows as any)?.medium ?? (Shadows as any)?.small ?? {};

type Props = {
  /** Committed value. Will NOT change until user picks a suggestion. */
  value: string;
  /** Fires ONLY when a suggestion is picked. */
  onCommit: (displayName: string, hit?: CityHit) => void;
  /** Characters before search; set to 1 for testing. */
  minChars?: number; // default 1 here to help you verify quickly
  maxResults?: number; // default 8
  dropdownOffsetY?: number; // ~48 for a ~45px row
  inputStyle?: any;
  containerStyle?: any;
  /** Identification for providers (use BOTH where possible) */
  userAgent?: string;      // Android UA
  email?: string;          // iOS email fallback
  acceptLanguage?: string;
  referer?: string;
  debug?: boolean;
};

export default function LocationAutocomplete({
  value,
  onCommit,
  minChars = 1,           // ← make it easy to test; raise to 3 later if you want
  maxResults = 8,
  dropdownOffsetY = 48,
  inputStyle,
  containerStyle,
  userAgent,
  email,
  acceptLanguage = 'en',
  referer,
  debug = true,           // turn off later
}: Props) {
  const [draft, setDraft] = useState<string>(value);
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<CityHit[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const q = (draft || '').trim();
    if (q.length < minChars) {
      setHits([]);
      setOpen(false);
      if (debug) console.log('[LocationAutocomplete] too short, closing list');
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading(true);

    timerRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      const results = await searchCities(q, ac.signal, {
        userAgent,
        email,
        acceptLanguage,
        referer,
        max: maxResults,
        debug,
      });

      if (debug) console.log('[LocationAutocomplete] results:', results.length);
      setHits(results);
      setOpen(true); // show panel (even 0 → shows "No matches")
      setLoading(false);
    }, 220);

    return () => clearTimeout(timerRef.current);
  }, [draft, minChars, maxResults, userAgent, email, acceptLanguage, referer, debug]);

  const dismissWithoutCommit = () => {
    if (debug) console.log('[LocationAutocomplete] dismiss → revert');
    abortRef.current?.abort();
    setOpen(false);
    setDraft(value);
    Keyboard.dismiss();
  };

  const pick = (hit: CityHit) => {
    if (debug) console.log('[LocationAutocomplete] pick:', hit.displayName);
    setOpen(false);
    setDraft(hit.displayName);
    onCommit(hit.displayName, hit);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.wrap, containerStyle, { overflow: 'visible', zIndex: 20, elevation: 20 }]}>
      <TextInput
        value={draft}
        onChangeText={setDraft} // DO NOT commit here
        placeholder="City"
        placeholderTextColor={Colors.textSecondary}
        autoCapitalize="words"
        autoCorrect={false}
        keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
        onFocus={() => debug && console.log('[LocationAutocomplete] focus')}
        style={[styles.text, inputStyle]}
      />

      {open && <Pressable style={styles.overlay} onPress={dismissWithoutCommit} />}

      {open && (
        <View style={[styles.dropdown, { top: dropdownOffsetY }]}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {hits.map((h) => (
              <Pressable key={h.id} onPress={() => pick(h)} style={styles.option}>
                <Text numberOfLines={1} style={styles.optionText}>
                  {h.displayName}
                </Text>
              </Pressable>
            ))}
            {hits.length === 0 && !loading && (
              <View style={styles.noMatchRow}>
                <Text style={styles.noMatchText}>No matches</Text>
              </View>
            )}
          </ScrollView>
          {loading ? <Text style={styles.loading}>Loading…</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', flex: 1 },
  text: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.black,
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: -1000, right: -1000, top: -1000, bottom: -1000, zIndex: 19,
  },
  dropdown: {
    position: 'absolute',
    left: 0, right: 0,
    maxHeight: 260,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.calendarGrid,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 21, elevation: 21,
  },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionText: { fontSize: Typography.fontSize.sm, color: Colors.black },
  loading: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, padding: 10, textAlign: 'center' },
  noMatchRow: { paddingVertical: 10, paddingHorizontal: 14 },
  noMatchText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
});
