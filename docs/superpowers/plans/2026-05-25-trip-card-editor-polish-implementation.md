# Trip Card And Editor Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine JourneyCraft's compact memory cards and make trip detail/edit navigation and utility tools behave naturally on iPhone.

**Architecture:** Keep the existing Expo Router route structure, correcting reverse navigation at the action source by popping pushed screens. Add a focused `TripUtilityToolbar` component and extend `AppScreen` with an optional footer region so detail and editor content can scroll while the toolbar stays attached to the bottom safe area and keyboard avoidance boundary. Recompose the existing `TripCard` into a compact summary plus integrated footer rail using the resolved theme palette.

**Tech Stack:** Expo Router, React Native, TypeScript, safe-area context, Ionicons/repository icon assets, Codex iPhone-size web preview plus Expo Go native validation.

---

### Task 1: Bottom-Anchored Screen Footer Primitive

**Files:**
- Modify: `src/components/layout/AppScreen.tsx`
- Test: `src/components/layout/appScreenModel.test.ts`
- Create: `src/components/layout/appScreenModel.ts`

- [ ] **Step 1: Write a failing pure layout test**

Create `src/components/layout/appScreenModel.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { getScrollBottomInset } from './appScreenModel.ts';

test('adds fixed footer height to scroll clearance', () => {
  assert.equal(getScrollBottomInset(20, 68), 88);
});

test('keeps existing scroll clearance without a footer', () => {
  assert.equal(getScrollBottomInset(20), 20);
});
```

- [ ] **Step 2: Run the test to verify red**

Run: `node --experimental-strip-types --test src/components/layout/appScreenModel.test.ts`

Expected: FAIL because `appScreenModel.ts` does not exist.

- [ ] **Step 3: Implement scroll clearance and footer layout**

Create `src/components/layout/appScreenModel.ts`:

```ts
export function getScrollBottomInset(bottomInset: number, footerHeight = 0): number {
  return bottomInset + footerHeight;
}
```

Add optional `footer?: React.ReactNode` and `footerHeight?: number` props to `AppScreen`. For scrolling screens, apply `getScrollBottomInset(bottomInset, footer ? footerHeight : 0)` to content padding and render `footer` after the scroll area inside the safe-area/keyboard-aware body.

- [ ] **Step 4: Verify green and typecheck**

Run:

```powershell
node --experimental-strip-types --test src/components/layout/appScreenModel.test.ts
npx.cmd tsc --noEmit
```

Expected: two layout tests pass and TypeScript exits `0`.

### Task 2: Shared Trip Utility Toolbar And Route Behavior

**Files:**
- Create: `features/trip/TripUtilityToolbar.tsx`
- Modify: `app/trip/[id].tsx`
- Modify: `features/trip/TripEditorScreen.tsx`

- [ ] **Step 1: Create a reusable toolbar**

Add `TripUtilityToolbar` that receives action items:

```ts
export interface TripUtilityAction {
  key: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  active?: boolean;
  accessibilityLabel: string;
  onPress?: () => void;
}
```

It renders six 44-point pressable tools on a themed, lightly separated surface, with active accent state and `borderCurve: 'continuous'`.

- [ ] **Step 2: Correct reverse navigation and anchor detail tools**

In `app/trip/[id].tsx`, replace the visible Home callback:

```tsx
onBack={() => router.back()}
```

Pass `TripUtilityToolbar` as `AppScreen`'s fixed `footer`, and remove the old trailing in-scroll toolbar. Supply actions for text/edit, media, camera, audio, share, and add.

- [ ] **Step 3: Anchor the editor toolbar and preserve context**

In `TripEditorScreen`, change `Done` to `router.back()` so new trips return to Home while edits return to their originating detail screen. Reuse `TripUtilityToolbar` via the fixed `footer` prop, keeping it inside `keyboardSafe` placement so iOS keyboard avoidance lifts it to the keyboard boundary.

- [ ] **Step 4: Typecheck**

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 3: Compact Memory Card Redesign

**Files:**
- Modify: `features/cards/components/TripCard.tsx`

- [ ] **Step 1: Recompose the card summary**

Keep navigation and menu state logic, but restructure rendering into:

```tsx
<Pressable style={styles.card} onPress={handleCardPress}>
  <View style={styles.summaryRow}>
    <View style={styles.copy}>...</View>
    <Image style={styles.cover} />
  </View>
  <View style={styles.footer}>...</View>
</Pressable>
```

Use `Ionicons` for location/calendar/media/overflow controls in a consistent stroke style; retain mood display as a small personal signal. Keep the title single-line, metadata compact, and photo size stable.

- [ ] **Step 2: Polish themed styles and action hit targets**

Apply the resolved palette to a clean card surface, subtle footer divider, quiet metadata, rounded thumbnail, and 44-point overflow button. Stop propagation on the overflow press so opening its menu does not navigate into the trip.

- [ ] **Step 3: Typecheck**

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 4: Rendered And Native Verification

**Files:**
- No expected source additions.

- [ ] **Step 1: Run automated checks**

Run:

```powershell
node --experimental-strip-types --test src/components/layout/appScreenModel.test.ts src/state/themeModel.test.ts
npx.cmd tsc --noEmit
```

Expected: four tests pass and TypeScript exits `0`.

- [ ] **Step 2: Check phone-sized rendering**

At `390 x 844`, inspect Home, a trip detail screen, and `/card/new` in both resolved appearances. Confirm card footer alignment, toolbar flushness at the lower safe-area edge, and non-overlapping content.

- [ ] **Step 3: Verify navigation and keyboard behavior**

Open a card from Home, use its Home/back action, and confirm it behaves as reverse navigation. In Expo Go on the user's iPhone 13, open add/edit with the keyboard visible and confirm the toolbar sits immediately above the keyboard and above the home indicator when the keyboard is hidden.
