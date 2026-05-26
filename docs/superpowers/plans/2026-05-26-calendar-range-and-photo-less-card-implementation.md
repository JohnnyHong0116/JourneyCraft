# Calendar Range And Photo-less Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clarify visited-calendar date ranges, limit mood editing to one selected day, and remove empty cover placeholders from trip cards.

**Architecture:** Keep interaction decisions in small pure model functions and let existing Expo Router screens consume those decisions for rendering. The calendar retains its storage and date-anchor behavior; the card remains the same component with a cover URI decision extracted for testing.

**Tech Stack:** Expo Router, React Native, TypeScript, Node built-in test runner.

---

### Task 1: Calendar selection presentation and editor eligibility

**Files:**
- Modify: `features/calendar/visitedCalendarModel.ts`
- Modify: `features/calendar/visitedCalendarModel.test.ts`
- Modify: `app/(tabs)/calendar.tsx`

- [ ] **Step 1: Write failing calendar model tests**

Add expectations for a pure `getDateSelectionPresentation` API and a `getMoodEditorDate` API:

```ts
assert.equal(getDateSelectionPresentation('2025-01-03', ['2025-01-03']), 'single');
assert.equal(getDateSelectionPresentation('2025-01-03', ['2025-01-03', '2025-01-08']), 'rangeStart');
assert.equal(getDateSelectionPresentation('2025-01-05', ['2025-01-03', '2025-01-08']), 'rangeMiddle');
assert.equal(getDateSelectionPresentation('2025-01-08', ['2025-01-03', '2025-01-08']), 'rangeEnd');
assert.equal(getMoodEditorDate(['2025-01-03']), '2025-01-03');
assert.equal(getMoodEditorDate(['2025-01-03', '2025-01-08']), undefined);
```

- [ ] **Step 2: Run test and confirm red**

Run: `node --experimental-strip-types --test features/calendar/visitedCalendarModel.test.ts`

Expected: FAIL because the new pure functions are not exported.

- [ ] **Step 3: Implement pure calendar decisions and render them**

Add the functions to the model, replace the view's last-anchor mood target with `getMoodEditorDate(anchors)`, conditionally render the prompt/buttons only when that target exists, and apply styles for `rangeStart`, `rangeMiddle`, and `rangeEnd` while leaving `single` on the existing selected-day style.

- [ ] **Step 4: Run test and typecheck**

Run: `node --experimental-strip-types --test features/calendar/visitedCalendarModel.test.ts`

Run: `npx.cmd tsc --noEmit`

Expected: PASS and no TypeScript errors.

### Task 2: Photo-less trip card rendering

**Files:**
- Create: `features/cards/components/tripCardModel.ts`
- Create: `features/cards/components/tripCardModel.test.ts`
- Modify: `features/cards/components/TripCard.tsx`

- [ ] **Step 1: Write failing card model test**

Specify the cover URI decision:

```ts
assert.equal(getTripCoverUri([]), undefined);
assert.equal(getTripCoverUri(['https://images.example/cover.jpg']), 'https://images.example/cover.jpg');
```

- [ ] **Step 2: Run test and confirm red**

Run: `node --experimental-strip-types --test features/cards/components/tripCardModel.test.ts`

Expected: FAIL because `tripCardModel.ts` does not exist.

- [ ] **Step 3: Implement the cover decision and component rendering**

Create:

```ts
export function getTripCoverUri(photos: readonly string[]): string | undefined {
  return photos[0];
}
```

In `TripCard`, calculate `coverUri`, render the cover container only when it exists, and continue rendering the footer image icon only when it exists. Remove unused placeholder styles.

- [ ] **Step 4: Run model test and typecheck**

Run: `node --experimental-strip-types --test features/cards/components/tripCardModel.test.ts`

Run: `npx.cmd tsc --noEmit`

Expected: PASS and no TypeScript errors.

### Task 3: Integrated verification

**Files:**
- Verify all modified files from Tasks 1-2.

- [ ] **Step 1: Run focused regression tests**

Run:

```powershell
node --experimental-strip-types --test features\calendar\visitedCalendarModel.test.ts features\cards\components\tripCardModel.test.ts
```

Expected: all tests pass.

- [ ] **Step 2: Run type and bundle validation**

Run: `npx.cmd tsc --noEmit`

Run: `Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:8081/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable' | Select-Object StatusCode,@{Name='BundleBytes';Expression={$_.Content.Length}}`

Expected: no type errors and iOS Metro bundle status `200`.

- [ ] **Step 3: Inspect the running phone-sized preview**

Open the visited calendar, select one day and confirm mood controls show, then select a range and confirm only the range cards remain beneath the label. Open Home and confirm a trip without photos has no empty thumbnail box.
