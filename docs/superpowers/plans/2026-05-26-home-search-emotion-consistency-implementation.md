# Home Search And Emotion Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Home-launched search mode-aware and type-aware while applying one canonical five-emotion representation throughout affected screens.

**Architecture:** Add a small shared emotion configuration and a pure Home search model operating on existing `Trip` records. Route Home's active timeline mode into search screens, then update category-specific UI consumers to use filtered records and shared emotion icons.

**Tech Stack:** Expo Router, React Native, TypeScript, Node built-in test runner.

---

### Task 1: Canonical Emotion Configuration And Search Model

**Files:**
- Create: `src/constants/emotions.ts`
- Create: `features/search/homeSearchModel.ts`
- Create: `features/search/homeSearchModel.test.ts`
- Modify: `src/data/appData.ts`

- [ ] **Step 1: Write failing pure model tests**

Create tests asserting that the five emotion IDs are unique and ordered as the design assets, `getHomeSearchTrips('visited' | 'planned')` returns only the selected collection, and `filterHomeTrips` supports text, photos, emotion, and date without returning unrelated records.

- [ ] **Step 2: Run the test to verify red**

Run: `node --experimental-strip-types --test features/search/homeSearchModel.test.ts`

Expected: FAIL because `homeSearchModel.ts` and `src/constants/emotions.ts` do not exist.

- [ ] **Step 3: Implement configuration and filtering**

Export `EMOTIONS`, `EMOTION_BY_ID`, `getEmotionConfig`, `HomeTimelineMode`, `HomeSearchCategory`, `getHomeSearchTrips`, and `filterHomeTrips`. Keep filtering based on `Trip` model properties: `id`, `title`, `location`, `displayDate`, `photos`, `mood`, `companions`, `audioCount`, and `isSaved`.

- [ ] **Step 4: Run tests to verify green**

Run: `node --experimental-strip-types --test features/search/homeSearchModel.test.ts`

Expected: PASS for configuration and search filtering tests.

### Task 2: Home And Search UI Behavior

**Files:**
- Modify: `app/(tabs)/home.tsx`
- Modify: `app/search/index.tsx`
- Modify: `app/search/[category].tsx`
- Modify: `features/cards/components/TripCard.tsx`

- [ ] **Step 1: Route active timeline context**

Change Home search navigation to pass `timelineMode: selectedTab`; preserve that parameter as users select a search category.

- [ ] **Step 2: Render real category results**

Replace static search results with `Trip` data from `getHomeSearchTrips` and `filterHomeTrips`. Add an input on the result page, an emotion selector for emotion mode, photo thumbnail/count evidence for photos, date emphasis for date mode, and themed no-results messaging.

- [ ] **Step 3: Remove the extra card emotion frame**

Render the existing SVG mood icon in the Home card footer without a colored square wrapper background while retaining footer alignment.

- [ ] **Step 4: Type-check UI integration**

Run: `npx tsc --noEmit`

Expected: exit code 0.

### Task 3: Shared Emotion Consumers

**Files:**
- Modify: `app/(tabs)/calendar.tsx`
- Modify: `features/trip/TripEditorScreen.tsx`
- Modify: `app/trip/[id]/mood.tsx`
- Modify: `app/(tabs)/stats.tsx`
- Modify: `src/data/appData.ts`

- [ ] **Step 1: Replace character-array mood presentation**

Render `Icon` components from `EMOTIONS` in calendar, mood selector, editor, and statistics. Use `TripMood` state in the editor rather than storing a raw Unicode face string.

- [ ] **Step 2: Tie statistics color data to canonical emotion IDs**

Give mood metrics stable emotion IDs and derive icon/color presentation from `getEmotionConfig`, retaining current percentages.

- [ ] **Step 3: Verify all affected emotion consumers**

Run: `rg -n "😄|🙂|😐|☹|😣|☺" app features src --glob "*.{ts,tsx}"`

Expected: no legacy emotion character arrays or raw editor mood strings in affected application code.

### Task 4: Completion Verification

**Files:**
- Verify only; do not modify `UI/`

- [ ] **Step 1: Run all available pure tests**

Run: `node --experimental-strip-types --test src/**/*.test.ts features/**/*.test.ts`

Expected: all tests pass.

- [ ] **Step 2: Run TypeScript checking**

Run: `npx tsc --noEmit`

Expected: exit code 0.

- [ ] **Step 3: Inspect final repository changes**

Run: `git status --short --branch` and `git diff --name-only -- UI` and `git diff --cached --name-only -- UI`

Expected: intended source/docs/test changes are listed; both `UI` diff commands produce no paths.
