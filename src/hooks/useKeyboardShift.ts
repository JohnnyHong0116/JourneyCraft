import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  KeyboardEvent,
  Platform,
  TextInput,
} from 'react-native';

export type FocusableInputRef = { current: TextInput | null };

type Config = {
  safeGap?: number;
  minMoveThreshold?: number;
  maxUpwardShift?: number | null;
  durationMs?: number;
  easing?: (value: number) => number;
  disabled?: boolean;
};

// 1-77行的老版本，专供登录页用
export function useKeyboardShiftOld(safeGap: number = 20) {
  const shiftY = useRef(new Animated.Value(0)).current;
  const keyboardHeightRef = useRef(0);
  const lastFocusedRef = useRef<FocusableInputRef | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTargetRef = useRef(0);
  const minMoveThreshold = 10;

  const animateTo = (toValue: number) => {
    if (Math.abs(lastTargetRef.current - toValue) < 1) return;
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
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      inputRef.current?.measureInWindow?.((_x, y, _w, h) => {
        const windowH = Dimensions.get('window').height;
        const keyboardTop = windowH - keyboardHeightRef.current;
        const inputBottom = y + h;
        const limit = keyboardTop - safeGap;
        const needed = inputBottom - limit;
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

// 最新完整版，专供注册页用
export function useKeyboardShift(config: Config = {}) {
  const {
    safeGap = 20,
    minMoveThreshold = 10,
    maxUpwardShift = null,
    durationMs = Platform.OS === 'ios' ? 160 : 120,
    easing = Easing.out(Easing.quad),
    disabled = false,
  } = config;

  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  const shiftY = useRef(new Animated.Value(0)).current;
  const keyboardHeightRef = useRef(0);
  const lastFocusedRef = useRef<FocusableInputRef | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTargetRef = useRef(0);
  const winHRef = useRef(Dimensions.get('window').height);

  const clearRaf = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const animateTo = (toValue: number) => {
    if (disabled) return;
    if (Math.abs(lastTargetRef.current - toValue) < 0.5) return;
    lastTargetRef.current = toValue;
    Animated.timing(shiftY, {
      toValue,
      duration: durationMs,
      easing,
      useNativeDriver: true,
    }).start();
  };

  const clampUpward = (value: number) => {
    if (maxUpwardShift == null) return value;
    return Math.max(value, maxUpwardShift);
  };

  const computeAndShift = (ref?: FocusableInputRef) => {
    if (disabled) return;
    const inputRef = ref || lastFocusedRef.current;
    if (!inputRef?.current) return;
    clearRaf();
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        inputRef.current?.measureInWindow?.((_x, y, _w, h) => {
          const windowH = winHRef.current;
          const keyboardTop = windowH - keyboardHeightRef.current;
          const inputBottom = y + h;
          const limit = keyboardTop - safeGap - insets.bottom;
          const overlap = inputBottom - limit;
          const needed = overlap > minMoveThreshold ? -overlap : 0;
          const target = clampUpward(needed);
          animateTo(target);
        });
      });
    });
  };

  const onKeyboardShow = (e: KeyboardEvent) => {
    keyboardHeightRef.current = e.endCoordinates?.height ?? 0;
    computeAndShift();
  };
  const onKeyboardHide = () => {
    keyboardHeightRef.current = 0;
    clearRaf();
    animateTo(0);
  };

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      onKeyboardShow
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      onKeyboardHide
    );
    return () => {
      showSub.remove();
      hideSub.remove();
      clearRaf();
    };
  }, [disabled, safeGap, minMoveThreshold, durationMs, easing]);

  const onFocus = (ref: FocusableInputRef) => {
    lastFocusedRef.current = ref;
    if (keyboardHeightRef.current > 0) computeAndShift(ref);
  };
  const ensureVisible = (ref?: FocusableInputRef) => {
    if (keyboardHeightRef.current > 0) computeAndShift(ref);
  };
  const shiftStyle = useMemo(
    () => ({ transform: [{ translateY: shiftY }] }),
    [shiftY]
  );
  return { shiftStyle, onFocus, ensureVisible };
}