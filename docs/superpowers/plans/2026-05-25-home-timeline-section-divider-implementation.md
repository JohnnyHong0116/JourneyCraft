# Home Timeline Section Divider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Home timeline label/card collisions and introduce quiet, theme-aware frosted chronological dividers.

**Architecture:** Keep the existing `SectionList` and trip grouping behavior, but make its section headers non-sticky. Put presentation decisions for section material into a small pure model, use that model from `SectionHeader`, and render blur through the already-installed `expo-blur` dependency.

**Tech Stack:** Expo Router, React Native, TypeScript, Expo Blur, Node test runner, in-app phone-size browser preview, Expo Go.

---

### Task 1: Timeline Presentation Contract

**Files:**
- Create: `features/home/components/homeTimelineModel.ts`
- Create: `features/home/components/homeTimelineModel.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSectionHeaderMaterial,
  HOME_TIMELINE_STICKY_SECTION_HEADERS,
} from './homeTimelineModel.ts';

test('timeline date headers remain inline instead of covering trip cards', () => {
  assert.equal(HOME_TIMELINE_STICKY_SECTION_HEADERS, false);
});

test('date headers use adaptive frosted materials', () => {
  assert.deepEqual(getSectionHeaderMaterial('dark'), {
    tint: 'dark',
    intensity: 70,
    washColor: 'rgba(30, 30, 30, 0.42)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  });
  assert.deepEqual(getSectionHeaderMaterial('light'), {
    tint: 'systemUltraThinMaterial',
    intensity: 72,
    washColor: 'rgba(255, 255, 255, 0.26)',
    borderColor: 'rgba(24, 32, 26, 0.08)',
  });
});
```

- [ ] **Step 2: Run the test to verify red**

Run: `node --experimental-strip-types --test features/home/components/homeTimelineModel.test.ts`

Expected: FAIL because `homeTimelineModel.ts` does not exist.

- [ ] **Step 3: Add minimal pure presentation model**

```ts
export const HOME_TIMELINE_STICKY_SECTION_HEADERS = false;

export function getSectionHeaderMaterial(mode: 'light' | 'dark') {
  return mode === 'dark'
    ? {
        tint: 'dark' as const,
        intensity: 70,
        washColor: 'rgba(30, 30, 30, 0.42)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
      }
    : {
        tint: 'systemUltraThinMaterial' as const,
        intensity: 72,
        washColor: 'rgba(255, 255, 255, 0.26)',
        borderColor: 'rgba(24, 32, 26, 0.08)',
      };
}
```

- [ ] **Step 4: Run the test to verify green**

Run: `node --experimental-strip-types --test features/home/components/homeTimelineModel.test.ts`

Expected: two tests pass.

### Task 2: Inline Frosted Date Divider

**Files:**
- Modify: `app/(tabs)/home.tsx`
- Modify: `features/home/components/SectionHeader.tsx`

- [ ] **Step 1: Disable sticky chronological headers**

Import `HOME_TIMELINE_STICKY_SECTION_HEADERS` and apply:

```tsx
stickySectionHeadersEnabled={HOME_TIMELINE_STICKY_SECTION_HEADERS}
```

This retains grouping and rendering while eliminating the overlap layer.

- [ ] **Step 2: Render the adaptive material capsule**

In `SectionHeader`, use `getSectionHeaderMaterial(mode)` and `BlurView`:

```tsx
<View style={styles.container}>
  <BlurView
    tint={material.tint}
    intensity={material.intensity}
    style={[styles.material, { borderColor: material.borderColor }]}
  >
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: material.washColor }]} />
    <Text style={styles.title}>{title}</Text>
  </BlurView>
</View>
```

Give the capsule rounded continuous corners, a hairline border, stable minimum height, and the same horizontal gutter as trip cards.

- [ ] **Step 3: Typecheck**

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 3: Verification

**Files:**
- No additional source files expected.

- [ ] **Step 1: Run focused automated verification**

Run:

```powershell
node --experimental-strip-types --test features/home/components/homeTimelineModel.test.ts src/state/themeModel.test.ts src/components/iconAssets.test.ts src/components/iconModel.test.ts src/components/layout/appScreenModel.test.ts
npx.cmd tsc --noEmit
git diff --check
```

Expected: tests pass, TypeScript exits `0`, and the diff contains no whitespace errors.

- [ ] **Step 2: Check rendered Home interaction**

At `http://localhost:8083/home`, render at iPhone-like width and scroll past `Yesterday` into `January 2025`. Confirm each frosted label scrolls away naturally and never covers `Evening Walk`, `Weekend Trip to Chicago`, or later cards.

- [ ] **Step 3: Native check**

Reload the same Expo QR session on the user's iPhone 13 and confirm the frosted dividers render cleanly in dark and light appearance, without overlap while scrolling.
