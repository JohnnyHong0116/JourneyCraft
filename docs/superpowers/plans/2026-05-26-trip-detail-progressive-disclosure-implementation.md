# Trip Detail Progressive Disclosure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the misleading static trip detail page with a selected-trip-aware mobile detail experience using pinned chrome and progressive disclosure.

**Architecture:** Add a pure trip-detail model for route-derived presentation data and expense summaries, then rebuild `/trip/[id]` around a fixed header, animated scrolling content, expandable attachment rail, and pinned Expenses disclosure. Update immediately reachable child routes to resolve the same trip ID so navigation remains consistent.

**Tech Stack:** Expo Router, React Native, React Native Reanimated, TypeScript, Node built-in test runner.

---

### Task 1: Trip detail presentation model

**Files:**
- Create: `features/trip/tripDetailModel.ts`
- Create: `features/trip/tripDetailModel.test.ts`

- [ ] **Step 1: Write failing model tests**

Define tests that require a selected trip lookup, honest feature labels, participant clusters, and linked expense totals:

```ts
assert.equal(getTripById(mockTrips, '1')?.title, 'Morning Coffee Run');
assert.equal(getTripFeatures(mockTrips[0]).find((item) => item.id === 'photos')?.value, '1 Photo');
assert.deepEqual(getCompanionCluster(['Amily', 'Johnny', 'Mia']), { initials: ['A', 'J'], overflow: 1, label: '3 people' });
assert.deepEqual(getTripExpenseSummary(statisticsExpenses, '1'), { total: 0, count: 0, label: 'No expenses yet' });
assert.deepEqual(getTripExpenseSummary(statisticsExpenses, '3'), { total: 92, count: 1, label: '¥92.00' });
```

- [ ] **Step 2: Run the test and confirm red**

Run: `node --experimental-strip-types --test features/trip/tripDetailModel.test.ts`

Expected: FAIL because `tripDetailModel.ts` does not yet exist.

- [ ] **Step 3: Implement the model**

Create pure exports:

```ts
export type TripFeatureId = 'photos' | 'location' | 'audio' | 'people';
export function getTripById(trips: readonly Trip[], id?: string): Trip | undefined;
export function getTripFeatures(trip: Trip): TripFeature[];
export function getCompanionCluster(companions?: readonly string[]): CompanionCluster;
export function getTripExpenseSummary(expenses: readonly ExpenseItem[], tripId: string): TripExpenseSummary;
export function formatTripTimestamp(value: string): string;
```

Use actual `Trip` and `ExpenseItem` data only; do not synthesize Chengdu content for another route ID.

- [ ] **Step 4: Verify green**

Run: `node --experimental-strip-types --test features/trip/tripDetailModel.test.ts`

Expected: PASS.

### Task 2: Progressive-disclosure trip detail route

**Files:**
- Modify: `app/trip/[id].tsx`
- Use: `features/trip/tripDetailModel.ts`
- Use: `features/trip/TripUtilityToolbar.tsx`

- [ ] **Step 1: Build fixed chrome and selected-trip rendering**

Replace the `AppScreen scroll` arrangement with an `AppScreen` containing:

```tsx
<TripDetailHeader title={trip.title} compactTitleVisible={scrollOffset > threshold} />
<Animated.ScrollView>{/* large title, participants, features, content */}</Animated.ScrollView>
<ExpensesDisclosure summary={expenseSummary} />
```

Keep `TripUtilityToolbar` as the pinned footer and pass dynamic `/trip/${trip.id}/...` destinations.

- [ ] **Step 2: Add pull-reveal timestamp and expandable rail**

Use Reanimated scroll state:

```tsx
const scrollY = useSharedValue(0);
const timestampStyle = useAnimatedStyle(() => ({
  height: interpolate(scrollY.value, [-70, 0], [42, 0], Extrapolation.CLAMP),
  opacity: interpolate(scrollY.value, [-52, -12], [1, 0], Extrapolation.CLAMP),
}));
```

Render one horizontal rail whose collapsed features display icons and whose selected feature animates into an icon-plus-label capsule. First tap expands; tapping the same expanded feature invokes its route.

- [ ] **Step 3: Add companion cluster and floating Expenses disclosure**

Render zero, one, or multiple-person affordances from `getCompanionCluster`. Render Expenses above the footer as a compact pill; expanding displays the linked total/empty state and a `View expenses` action routing with `tripId`.

- [ ] **Step 4: Typecheck route**

Run: `npx.cmd tsc --noEmit`

Expected: no TypeScript errors.

### Task 3: Trip-context destinations

**Files:**
- Modify: `app/trip/[id]/media.tsx`
- Modify: `app/trip/[id]/location.tsx`
- Modify: `app/trip/[id]/people.tsx`
- Modify: `app/trip/[id]/share.tsx`
- Modify: `app/trip/[id]/edit.tsx`
- Modify: `features/trip/TripEditorScreen.tsx`
- Modify: `app/expenses/index.tsx`
- Modify: `features/expenses/ExpenseBreakdownScreen.tsx`

- [ ] **Step 1: Resolve trip IDs in immediate child routes**

For each trip child screen, obtain:

```ts
const { id } = useLocalSearchParams<{ id: string }>();
const trip = getTripById(mockTrips, id);
```

Use `trip.title`, `trip.location`, `trip.photos`, and `trip.companions` instead of fixed Chengdu labels and gallery records. Preserve each screen's existing action purpose.

- [ ] **Step 2: Pass and filter Expense context**

Navigate with:

```ts
router.push({ pathname: '/expenses', params: { tripId: trip.id } });
```

Update `ExpenseBreakdownScreen` to filter `statisticsExpenses` by optional `tripId`, show the selected trip title, and render an empty/add-expense state for trip `1` rather than Chengdu expenditure.

- [ ] **Step 3: Verify child-route type safety**

Run: `npx.cmd tsc --noEmit`

Expected: no TypeScript errors.

### Task 4: Integrated validation

**Files:**
- Verify: all files above and current branch changes.

- [ ] **Step 1: Run all pure tests**

Run:

```powershell
$tests = rg --files -g '*.test.ts'; node --experimental-strip-types --test $tests
```

Expected: every test passes.

- [ ] **Step 2: Validate compiler, diff, and native bundle**

Run: `npx.cmd tsc --noEmit`

Run: `git diff --check`

Run:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:8081/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable' | Select-Object StatusCode,@{Name='BundleBytes';Expression={$_.Content.Length}}
```

Expected: no TypeScript/diff errors and iOS bundle status `200`.

- [ ] **Step 3: Check iPhone 13 visual interactions**

At `390 x 844`, confirm `/trip/1` shows `Morning Coffee Run`, pinned header controls remain in place when content moves, pull-down timestamp is hidden at rest, a feature expands then routes on second activation, the participant affordance opens People, and Expenses expands to `No expenses yet`. Open `/trip/3` or its Expenses context and confirm it reports its linked spend rather than Chengdu totals.
