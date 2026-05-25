# Theme Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make JourneyCraft follow iPhone appearance by default and consistently apply a persistent Light/Dark manual override across authenticated screens.

**Architecture:** Theme preference is persisted with app session state, with a pure resolver mapping `system | light | dark` plus device appearance into a runtime mode. Shared layout primitives and navigation obtain the resolved mode from context, and screens stop forcing permanent modes. High-traffic legacy tab surfaces receive palette-driven styling where their current static light values would otherwise break dark mode.

**Tech Stack:** Expo Router, React Native, TypeScript, AsyncStorage, `useColorScheme`, Node test runner for pure theme logic.

---

### Task 1: Theme Preference Model And Persistent State

**Files:**
- Create: `src/state/themeModel.ts`
- Create: `src/state/themeModel.test.ts`
- Modify: `src/state/AppStateContext.tsx`
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Write the failing theme resolver test**

Create tests that import `resolveThemeMode` and assert that `system` follows a supplied system scheme while manual overrides win:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveThemeMode } from './themeModel.ts';

test('system preference follows device appearance', () => {
  assert.equal(resolveThemeMode('system', 'dark'), 'dark');
  assert.equal(resolveThemeMode('system', 'light'), 'light');
  assert.equal(resolveThemeMode('system', null), 'light');
});

test('manual theme preference overrides device appearance', () => {
  assert.equal(resolveThemeMode('dark', 'light'), 'dark');
  assert.equal(resolveThemeMode('light', 'dark'), 'light');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test src/state/themeModel.test.ts`

Expected: FAIL because `themeModel.ts` does not exist.

- [ ] **Step 3: Implement model and persisted provider behavior**

Create:

```ts
export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedThemeMode = 'light' | 'dark';

export function resolveThemeMode(
  preference: ThemePreference,
  systemScheme: ResolvedThemeMode | null | undefined,
): ResolvedThemeMode {
  return preference === 'system' ? systemScheme ?? 'light' : preference;
}
```

Extend stored session/context with `themePreference`, derive `mode` using
`useColorScheme()` and `resolveThemeMode`, default hydrated data to `system`,
and expose an async `setThemePreference`. Set the root `StatusBar` style from
`mode`.

- [ ] **Step 4: Verify resolver and typecheck**

Run: `node --experimental-strip-types --test src/state/themeModel.test.ts`

Expected: PASS, 2 tests.

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 2: Shared Theme-Aware Surfaces And Settings Control

**Files:**
- Modify: `src/components/layout/AppScreen.tsx`
- Modify: `features/settings/SettingsRow.tsx`
- Modify: `app/settings/index.tsx`
- Modify: `components/ui/BottomNavBar.tsx`
- Modify: `app/(tabs)/_layout.tsx`

- [ ] **Step 1: Use provider mode as the layout default**

Change shared primitives to call `useAppState().mode` whenever no explicit
`mode` is supplied, so `AppScreen`, `ScreenHeader`, `SurfaceCard`, `Chip`,
`PrimaryButton`, `FormField`, `IconCircleButton`, and `StatePanel` respond to
the runtime preference.

- [ ] **Step 2: Make Settings change persisted preference**

Use `themePreference`, `mode`, and `setThemePreference` from app state.
The Dark Mode switch sets manual `dark` or `light`; add a `Use System
Appearance` row showing `On` only when preference is `system` and resetting
to `system` on press. Use resolved palette values for settings text and rows.

- [ ] **Step 3: Align bottom navigation and tab shell**

Replace direct `useColorScheme()` in `BottomNavBar` with context `mode`, use
the resolved palette for nav color and blur tint, and apply resolved app
background to the tab shell.

- [ ] **Step 4: Typecheck**

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 3: Remove Forced Dark Detail Flows

**Files:**
- Modify: `app/settings/*.tsx`
- Modify: `app/settings/help/*.tsx`
- Modify: `app/trip/[id].tsx`
- Modify: `app/trip/[id]/*.tsx`
- Modify: `app/expenses/*.tsx`
- Modify: `app/stats/summary.tsx`
- Modify: `features/trip/TripEditorScreen.tsx`
- Modify: `features/expenses/ExpenseBreakdownScreen.tsx`

- [ ] **Step 1: Replace fixed mode props**

Remove fixed `mode="dark"` props from shared primitives in authenticated
flows so they resolve through context.

- [ ] **Step 2: Replace fixed palette reads**

In each screen, obtain `mode` from `useAppState()` and `const palette =
AppPalette[mode]`. Convert text, divider, surface, and icon values currently
read from `AppPalette.dark` to the resolved `palette`.

- [ ] **Step 3: Typecheck**

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 4: Main Tab And Search Surface Consistency

**Files:**
- Modify: `app/(tabs)/home.tsx`
- Modify: `app/(tabs)/calendar.tsx`
- Modify: `app/(tabs)/location.tsx`
- Modify: `app/(tabs)/stats.tsx`
- Modify: `app/(tabs)/profile.tsx`
- Modify: `app/search/index.tsx`
- Modify: `app/search/[category].tsx`
- Modify: `features/home/components/*.tsx`
- Modify: `features/cards/components/TripCard.tsx`

- [ ] **Step 1: Connect tab backgrounds and text to resolved palette**

Use the resolved `mode` and palette for tab backgrounds, cards, labels, and
controls presently fixed to the light `Colors` export or `AppPalette.light`.
Keep layout and interaction behavior unchanged.

- [ ] **Step 2: Connect search surfaces**

Use the same palette for search backgrounds, text, rows, icons, and dividers
so navigation out of tabs does not switch appearance unexpectedly.

- [ ] **Step 3: Typecheck**

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 5: Native And Visual Verification

**Files:**
- No new source files expected.

- [ ] **Step 1: Run automated verification**

Run:

```powershell
node --experimental-strip-types --test src/state/themeModel.test.ts
npx.cmd tsc --noEmit
npx.cmd expo-doctor
```

Expected: theme tests pass, TypeScript exits `0`, Expo Doctor reports all
checks passed.

- [ ] **Step 2: Preview core states at iPhone 13 dimensions**

With Expo running and Codex browser fixed at `390 x 844`, check Home, Profile,
Settings, and one dark/detail flow after selecting Light, Dark, and System
appearance. Confirm surfaces, text contrast, status bar, and bottom navigation
stay in the selected resolved mode.

- [ ] **Step 3: Native handoff**

Ask the user to refresh Expo Go on iPhone 13 and verify the same Light, Dark,
and System states, since native iOS rendering is authoritative.
