# Signed-In Icon System And Native Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify JourneyCraft's signed-in icons with the bottom navigation language and remove the iPhone safe-area gap beneath trip utility toolbars.

**Architecture:** Keep the current SVG-backed `Icon` component as the app-owned visual layer, expanding it with small recolorable action glyphs and converting common signed-in controls away from mixed third-party glyphs. Adjust `AppScreen` so a footer screen can paint through the bottom safe-area inset while its toolbar controls add the inset internally, preserving scroll clearance and keyboard avoidance.

**Tech Stack:** Expo Router, React Native, `react-native-safe-area-context`, `react-native-svg-transformer`, TypeScript, Node test runner, Codex iPhone-size preview and Expo Go.

---

### Task 1: Footer Safe-Area Geometry

**Files:**
- Modify: `src/components/layout/appScreenModel.test.ts`
- Modify: `src/components/layout/appScreenModel.ts`
- Modify: `src/components/layout/AppScreen.tsx`
- Modify: `features/trip/TripUtilityToolbar.tsx`

- [ ] **Step 1: Write the failing safe-area clearance test**

Extend `src/components/layout/appScreenModel.test.ts`:

```ts
import { getFooterVisualHeight, getScrollBottomInset } from './appScreenModel.ts';

test('extends a footer surface through the bottom safe-area inset', () => {
  assert.equal(getFooterVisualHeight(68, 34), 102);
  assert.equal(getScrollBottomInset(12, getFooterVisualHeight(68, 34)), 114);
});
```

- [ ] **Step 2: Run the test to verify red**

Run:

```powershell
node --experimental-strip-types --test src/components/layout/appScreenModel.test.ts
```

Expected: FAIL because `getFooterVisualHeight` is not exported.

- [ ] **Step 3: Implement footer height and safe-area ownership**

Add to `src/components/layout/appScreenModel.ts`:

```ts
export function getFooterVisualHeight(toolbarHeight: number, safeAreaBottom: number): number {
  return toolbarHeight + safeAreaBottom;
}
```

In `AppScreen`, obtain `insets.bottom` with `useSafeAreaInsets()`. Change the footer prop to `footer?: (bottomInset: number) => React.ReactNode`; for screens with a footer, remove `'bottom'` from the outer `SafeAreaView` edges, calculate `visualFooterHeight = getFooterVisualHeight(footerHeight, insets.bottom)`, reserve that height in scrolling content, and render `footer(insets.bottom)`.

In `TripUtilityToolbar`, accept `bottomInset?: number`, set its total height to `TRIP_UTILITY_TOOLBAR_HEIGHT + bottomInset`, and use `paddingBottom: bottomInset` so icon controls stay above the home indicator while the surface continues behind it. Update detail and editor callers to supply `footer={(bottomInset) => <TripUtilityToolbar bottomInset={bottomInset} ... />}`.

- [ ] **Step 4: Verify footer behavior**

Run:

```powershell
node --experimental-strip-types --test src/components/layout/appScreenModel.test.ts
npx.cmd tsc --noEmit
```

Expected: footer tests pass and TypeScript exits `0`.

### Task 2: JourneyCraft Recolorable Action Icons

**Files:**
- Create: `src/assets/icons/back.svg`
- Create: `src/assets/icons/chevron.svg`
- Create: `src/assets/icons/camera.svg`
- Create: `src/assets/icons/check.svg`
- Create: `src/assets/icons/microphone.svg`
- Create: `src/assets/icons/send.svg`
- Create: `src/assets/icons/text-format.svg`
- Create: `src/assets/icons/trash.svg`
- Modify: `src/assets/icons/setting-selected.svg`
- Modify: `src/assets/icons/setting-unselected.svg`
- Modify: `src/assets/icons/cardimage.svg`
- Modify: `src/assets/icons/cardlock.svg`
- Modify: `src/assets/icons/cardmic.svg`
- Modify: `src/assets/icons/cardpeople.svg`
- Modify: `src/assets/icons/cardsave.svg`
- Modify: `src/assets/icons/cardvideo.svg`
- Modify: `src/assets/icons/threedots-smaller.svg`
- Modify: `src/assets/icons.ts`
- Modify: `src/components/Icon.tsx`
- Create: `src/components/iconModel.test.ts`
- Create: `src/components/iconModel.ts`

- [ ] **Step 1: Write a failing semantic icon mapping test**

Create `src/components/iconModel.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAppIconName } from './iconModel.ts';

test('maps common signed-in actions onto JourneyCraft assets', () => {
  assert.equal(resolveAppIconName('location-outline'), 'location-unselected');
  assert.equal(resolveAppIconName('images-outline'), 'cardimage');
  assert.equal(resolveAppIconName('mic-outline'), 'microphone');
  assert.equal(resolveAppIconName('people-outline'), 'cardpeople');
  assert.equal(resolveAppIconName('checkmark'), 'check');
});
```

- [ ] **Step 2: Run the test to verify red**

Run:

```powershell
node --experimental-strip-types --test src/components/iconModel.test.ts
```

Expected: FAIL because `iconModel.ts` does not exist.

- [ ] **Step 3: Implement semantic mapping and themeable SVG pack**

Create `src/components/iconModel.ts` exporting `AppIconName` and `resolveAppIconName(name: string): AppIconName`, mapping existing screen semantic names to app-owned glyphs.

Add minimal 24-point `currentColor` outline SVG glyphs for back, chevron, camera, microphone, send, text format, trash, and check. Rewrite the broken settings and card action SVG assets so they use `currentColor` and contain no embedded background rectangles. Register every new asset in `src/assets/icons.ts`, and update `Icon` prop typing to accept the resulting `AppIconName`.

- [ ] **Step 4: Verify semantic mapping**

Run:

```powershell
node --experimental-strip-types --test src/components/iconModel.test.ts
npx.cmd tsc --noEmit
```

Expected: mapping test passes and TypeScript exits `0`.

### Task 3: Reusable Controls And Trip/Home Migration

**Files:**
- Modify: `src/components/layout/AppScreen.tsx`
- Modify: `features/trip/TripUtilityToolbar.tsx`
- Modify: `features/trip/TripEditorScreen.tsx`
- Modify: `app/trip/[id].tsx`
- Modify: `features/cards/components/TripCard.tsx`
- Modify: `features/home/components/PinnedSection.tsx`
- Modify: `src/components/ui/CardMenu.tsx`

- [ ] **Step 1: Move shared controls to app icons**

Change `ScreenHeader`, `IconCircleButton`, and `Chip` in `AppScreen` to render `<Icon>` via `resolveAppIconName`; preserve text and accessibility behavior. Keep unsupported form/help illustration icons on `Ionicons` until Task 4 covers their surfaces.

- [ ] **Step 2: Replace high-visibility trip and Home glyphs**

Change `TripUtilityToolbar` actions to use `AppIconName` values:

```tsx
{ key: 'edit', icon: 'textformat', accessibilityLabel: 'Edit trip note' }
{ key: 'photos', icon: 'cardimage', accessibilityLabel: 'View photos' }
{ key: 'camera', icon: 'camera', accessibilityLabel: 'Add a photo' }
{ key: 'audio', icon: 'microphone', accessibilityLabel: 'Record audio' }
{ key: 'share', icon: 'send', accessibilityLabel: 'Share trip' }
{ key: 'add', icon: 'add', accessibilityLabel: 'Add trip item' }
```

Convert TripCard metadata/footer actions and its menu actions to app icons; convert the Home pinned chevron to the app chevron. Maintain 44-point action hit targets and menu propagation behavior.

- [ ] **Step 3: Typecheck and visually inspect trip surfaces**

Run:

```powershell
npx.cmd tsc --noEmit
```

At `390 x 844`, inspect Home, trip detail, and `/card/new` in dark mode. Expected: unified glyph weight and toolbar background extending through the bottom edge.

### Task 4: Signed-In Secondary Surface Migration

**Files:**
- Modify: `app/(tabs)/profile.tsx`
- Modify: `features/settings/SettingsRow.tsx`
- Modify: `app/settings/profile.tsx`
- Modify: `app/(tabs)/location.tsx`
- Modify: `app/(tabs)/stats.tsx`
- Modify: `features/expenses/ExpenseBreakdownScreen.tsx`
- Modify: `app/expenses/new.tsx`
- Modify: `app/search/index.tsx`
- Modify: `app/search/[category].tsx`

- [ ] **Step 1: Replace profile/settings inconsistency**

Use the corrected `<Icon name="setting-unselected" color={palette.text} />` in Profile. In `SettingsRow`, resolve its existing semantic `icon` prop through `resolveAppIconName` and render the app icon when one is defined; use the existing vector icon only for settings-specific symbols without a JourneyCraft equivalent.

- [ ] **Step 2: Migrate common secondary actions**

Replace visible recurring search, location, photo/media, people, chevron, add, and overflow glyphs with app icons on Location, Stats, Expenses, and Search. Leave specialized statistical concepts and platform controls on their existing glyph implementation unless a matching app asset already exists.

- [ ] **Step 3: Verify secondary screens**

At `390 x 844`, inspect Profile in dark mode for removal of the white gear box and sample Settings, Search/Location, Stats, and Expenses views for coherent shared action styling.

### Task 5: Complete Verification

**Files:**
- No expected source additions.

- [ ] **Step 1: Run automated checks**

Run:

```powershell
node --experimental-strip-types --test src/components/layout/appScreenModel.test.ts src/components/iconModel.test.ts src/state/themeModel.test.ts
npx.cmd tsc --noEmit
```

Expected: all focused tests pass and TypeScript exits `0`.

- [ ] **Step 2: Run iPhone-sized rendered checks**

Inspect Home, trip detail, new/edit trip, Profile, Settings, Location/Search, Stats, and Expenses at `390 x 844` in dark appearance and representative light screens. Confirm there is no icon background artifact, no overlapping layout, and the web approximation has no lower toolbar gap.

- [ ] **Step 3: Request native confirmation**

In Expo Go on iPhone 13, confirm:

- trip detail/editor tool surface fills down behind the home indicator;
- keyboard lifts the editor toolbar directly to its boundary;
- profile settings glyph is a clean themed outline without a white square.
