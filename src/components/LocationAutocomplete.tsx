// src/components/LocationAutocomplete.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View, TextInput, Pressable, Text, ScrollView,
  StyleSheet, Keyboard, Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../theme/designSystem';
import { searchCitiesLocationIQ, CityHit } from '../services/locationiq';

const SHADOW: any = (Shadows as any)?.medium ?? (Shadows as any)?.small ?? {};

type Props = {
  value: string; // committed text from parent
  onCommit: (displayName: string, hit?: CityHit) => void; // ONLY on pick
  minChars?: number;
  dropdownOffsetY?: number;
  maxDropdownHeight?: number;
  useShortDisplay?: boolean;  // <-- add this: use concise format in textbox
  inputStyle?: any;
  containerStyle?: any;
  language?: string;
  countrycodes?: string;
  limit?: number;
  dedupe?: 0 | 1;
  debug?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export default function LocationAutocomplete({
  value,
  onCommit,
  minChars = 2,
  dropdownOffsetY = 48,
  maxDropdownHeight = 220,
  useShortDisplay = true,  // <-- add this, default to concise format
  inputStyle,
  containerStyle,
  language = 'en',
  countrycodes,
  limit = 8,
  dedupe = 1,
  debug = false,
  onFocus,
  onBlur,
}: Props) {
  const [draft, setDraft] = useState<string>(value);
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<CityHit[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<any>(null);
  const committedRef = useRef<string>(value); // <-- add this for revert logic
  const justPickedRef = useRef<boolean>(false); // <-- add this to prevent search after pick
  const justClearedRef = useRef<boolean>(false); // <-- add this to prevent search after clear
  const justDismissedRef = useRef<boolean>(false); // <-- add this to prevent search after dismiss

  const apiKey = process.env.EXPO_PUBLIC_LOCATIONIQ_KEY || '';

  // Keep committedRef in sync if parent updates programmatically
  useEffect(() => {
    const prevCommitted = committedRef.current;
    committedRef.current = value;
    
    // If parent cleared the value (e.g., clear button), clear everything
    if (!value && prevCommitted) {
      if (debug) console.log('[LocationAutocomplete] parent cleared value, resetting');
      justClearedRef.current = true; // prevent search after clear
      setDraft('');
      setOpen(false);
      setHits([]);
      abortRef.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [value, debug]);

  useEffect(() => {
    const q = (draft || '').trim();
    
    // Prevent search if we just picked a location
    if (justPickedRef.current) {
      if (debug) console.log('[LocationAutocomplete] just picked, skipping search');
      justPickedRef.current = false;
      return;
    }
    
    // Prevent search if we just cleared via clear button
    if (justClearedRef.current) {
      if (debug) console.log('[LocationAutocomplete] just cleared, skipping search');
      justClearedRef.current = false;
      return;
    }
    
    // Prevent search if we just dismissed without commit
    if (justDismissedRef.current) {
      if (debug) console.log('[LocationAutocomplete] just dismissed, skipping search');
      justDismissedRef.current = false;
      return;
    }
    
    // If draft is empty, close list and stop requests
    if (q.length === 0) {
      setHits([]);
      setOpen(false);
      if (debug) console.log('[LocationAutocomplete] empty draft, closing list');
      return;
    }
    
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

      try {
        const results = await searchCitiesLocationIQ(q, {
          apiKey,
          language,
          countrycodes,
          limit,
          dedupe,
          debug,
        }, ac.signal);

        if (debug) console.log('[LocationAutocomplete] results:', results.length);
        setHits(results);
        setOpen(true);  // open even if 0 -> show "No matches"
      } catch (error) {
        if (debug) console.log('[LocationAutocomplete] search error:', error);
        setHits([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timerRef.current);
  }, [draft, minChars, apiKey, language, countrycodes, limit, dedupe, debug]);

  const dismissWithoutCommit = () => {
    if (debug) console.log('[LocationAutocomplete] dismiss → revert to:', committedRef.current);
    abortRef.current?.abort();
    setOpen(false);
    justDismissedRef.current = true; // <-- set flag to prevent search after dismiss
    onBlur?.(); // call onBlur BEFORE setDraft to ensure focus state is updated
    setDraft(committedRef.current); // revert to committed value
    Keyboard.dismiss();
  };

  const pick = (hit: CityHit) => {
    const displayText = useShortDisplay ? hit.shortDisplay : hit.displayName;
    if (debug) console.log('[LocationAutocomplete] pick:', displayText);
    setOpen(false);
    justPickedRef.current = true; // <-- set flag to prevent search
    setDraft(''); // clear draft to avoid triggering new search
    committedRef.current = displayText; // update committed value
    onCommit(displayText, hit); // commit only here
    onBlur?.(); // <-- notify parent that focus is lost
    Keyboard.dismiss();
  };

  // Compute display value: show draft while typing, committed value otherwise
  // This matches AreaCodeInline's displayArea logic
  const displayValue = draft.length > 0 ? draft : (committedRef.current || '');

  return (
    <View style={[styles.wrap, containerStyle, { overflow: 'visible', zIndex: 20, elevation: 20 }]}>
      <TextInput
        value={displayValue}
        onChangeText={setDraft} // don't commit while typing
        placeholder="City"
        placeholderTextColor={Colors.textSecondary}
        autoCapitalize="words"
        autoCorrect={false}
        keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
        onFocus={() => {
          if (debug) console.log('[LocationAutocomplete] focus');
          onFocus?.();
        }}
        style={[styles.text, inputStyle]}
      />

      {open && <Pressable style={styles.overlay} onPress={dismissWithoutCommit} />}

      {open && (
        <View style={[styles.dropdown, { top: dropdownOffsetY, maxHeight: maxDropdownHeight }]}>
          <ScrollView 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={false}
          >
            {hits.map((h) => (
              <Pressable 
                key={h.id} 
                onPress={() => pick(h)} 
                style={({ pressed }) => [
                  styles.option,
                  pressed && { backgroundColor: Colors.calendarGrid }
                ]}
              >
                <Text numberOfLines={1} style={styles.optionText}>
                  {useShortDisplay ? h.shortDisplay : h.displayName}
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
    paddingVertical: 0, paddingHorizontal: 0,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  overlay: { position: 'absolute', left: -1000, right: -1000, top: -1000, bottom: -1000, zIndex: 19 },
  dropdown: {
    position: 'absolute',
    left: 0, right: 0,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.calendarGrid,
    ...SHADOW,
    zIndex: 21, elevation: 21,
    minWidth: 280,  // ensure consistent width like area code
  },
  option: { 
    paddingVertical: 12, 
    paddingHorizontal: 16,  // match area code padding
  },
  optionText: { 
    fontSize: Typography.fontSize.md,  // match area code font size
    fontWeight: '600',                 // match area code font weight
    color: Colors.black 
  },
  loading: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, padding: 10, textAlign: 'center' },
  noMatchRow: { paddingVertical: 10, paddingHorizontal: 14 },
  noMatchText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
});
