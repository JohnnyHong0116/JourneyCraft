import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Keyboard, Platform, TextInput, Easing } from 'react-native';

export type FocusableInputRef = { current: TextInput | null };

// Shift a container vertically so the focused input stays above the keyboard.
// Intended for non-scrollable screens (e.g., Login). On hide, it resets.
export function useKeyboardShift(safeGap: number = 20) {
  const shiftY = useRef(new Animated.Value(0)).current;
  const keyboardHeightRef = useRef(0);
  const lastFocusedRef = useRef<FocusableInputRef | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTargetRef = useRef(0);
  const minMoveThreshold = 10; // px; avoid moving for inputs that are already safe

  const animateTo = (toValue: number) => {
    if (Math.abs(lastTargetRef.current - toValue) < 1) return; // avoid tiny jitter
    lastTargetRef.current = toValue;
    Animated.timing(shiftY, {
      toValue,
      duration: Platform.OS === 'ios' ? 160 : 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const computeAndShift = (ref?: FocusableInputRef) => {
    const inputRef = ref || lastFocusedRef.current;
    if (!inputRef?.current) return;
    // Use rAF to wait one frame after focus/keyboard event to reduce flicker
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      inputRef.current?.measureInWindow?.((_x, y, _w, h) => {
        const windowH = Dimensions.get('window').height;
        const keyboardTop = windowH - keyboardHeightRef.current;
        const inputBottom = y + h;
        const limit = keyboardTop - safeGap;
        const needed = inputBottom - limit;
        // Only shift if overlap exceeds a small threshold to prevent top fields from moving
        const shift = needed > minMoveThreshold ? -needed : 0;
        animateTo(shift);
      });
    });
  };

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        keyboardHeightRef.current = e.endCoordinates?.height ?? 0;
        computeAndShift();
      },
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        keyboardHeightRef.current = 0;
        animateTo(0);
      },
    );
    return () => {
      show.remove();
      hide.remove();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onFocus = (ref: FocusableInputRef) => {
    lastFocusedRef.current = ref;
    if (keyboardHeightRef.current > 0) computeAndShift(ref);
  };

  return { shiftY, onFocus };
}


