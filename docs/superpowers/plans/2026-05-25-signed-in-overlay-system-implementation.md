# Signed-In Overlay System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace JourneyCraft's dated signed-in popups with coherent frosted popovers and bottom sheets that are usable on iPhone in both themes.

**Architecture:** Add a pure `overlayModel` for material tokens and anchor placement plus reusable `MaterialPopover`, `ActionSheetModal`, and `OverlayActionRow` primitives. Existing Sort, Card actions, Delete confirmation, and Profile cover controls compose those primitives while preserving their data/actions and Expo Go compatibility.

**Tech Stack:** Expo Router, React Native, TypeScript, `expo-blur`, `react-native-reanimated`, safe-area context, Node test runner, Expo Go.

---

### Task 1: Overlay Presentation And Position Contract

**Files:**
- Create: `src/components/ui/overlayModel.ts`
- Create: `src/components/ui/overlayModel.test.ts`

- [ ] **Step 1: Write failing model tests**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { getOverlayMaterial, getPopoverPosition } from './overlayModel.ts';

test('dark and light overlays use adaptive material styling', () => {
  assert.equal(getOverlayMaterial('dark').tint, 'dark');
  assert.equal(getOverlayMaterial('light').tint, 'systemMaterial');
  assert.equal(getOverlayMaterial('dark').borderColor, 'rgba(255, 255, 255, 0.12)');
});

test('popover is clamped horizontally and flips above a low anchor', () => {
  assert.deepEqual(getPopoverPosition({
    anchorX: 380, anchorY: 720, anchorWidth: 24, anchorHeight: 24,
    panelWidth: 248, panelHeight: 220, viewportWidth: 390, viewportHeight: 844,
  }), { left: 130, top: 492, placement: 'above' });
});

test('popover remains below a high anchor', () => {
  assert.deepEqual(getPopoverPosition({
    anchorX: 270, anchorY: 32, anchorWidth: 42, anchorHeight: 42,
    panelWidth: 248, panelHeight: 250, viewportWidth: 390, viewportHeight: 844,
  }), { left: 64, top: 82, placement: 'below' });
});
```

- [ ] **Step 2: Run the tests to see the missing model fail**

Run: `node --experimental-strip-types --test src/components/ui/overlayModel.test.ts`

Expected: FAIL with missing `overlayModel.ts`.

- [ ] **Step 3: Implement the pure model**

```ts
export type OverlayMode = 'light' | 'dark';

export function getOverlayMaterial(mode: OverlayMode) {
  return mode === 'dark'
    ? { tint: 'dark' as const, backdropColor: 'rgba(0,0,0,0.34)', surfaceWash: 'rgba(36,36,38,0.58)', borderColor: 'rgba(255, 255, 255, 0.12)', selectedWash: 'rgba(98,173,116,0.18)' }
    : { tint: 'systemMaterial' as const, backdropColor: 'rgba(13,17,15,0.18)', surfaceWash: 'rgba(255,255,255,0.34)', borderColor: 'rgba(20,28,22,0.09)', selectedWash: 'rgba(95,175,112,0.13)' };
}

export function getPopoverPosition(input: {
  anchorX: number; anchorY: number; anchorWidth: number; anchorHeight: number;
  panelWidth: number; panelHeight: number; viewportWidth: number; viewportHeight: number;
}) {
  const margin = 12;
  const gap = 8;
  const bottomGuard = 104;
  const left = Math.min(
    Math.max(input.anchorX + input.anchorWidth - input.panelWidth, margin),
    input.viewportWidth - input.panelWidth - margin,
  );
  const below = input.anchorY + input.anchorHeight + gap;
  if (below + input.panelHeight <= input.viewportHeight - bottomGuard) {
    return { left, top: below, placement: 'below' as const };
  }
  return { left, top: Math.max(margin, input.anchorY - input.panelHeight - gap), placement: 'above' as const };
}
```

- [ ] **Step 4: Run the model tests**

Run: `node --experimental-strip-types --test src/components/ui/overlayModel.test.ts`

Expected: three tests pass.

### Task 2: Reusable Material Overlay Components

**Files:**
- Create: `src/components/ui/OverlaySurface.tsx`

- [ ] **Step 1: Add common popover, sheet, and row primitives**

Create components with these public props:

```ts
export function MaterialPopover(props: {
  visible: boolean; onDismiss: () => void; anchor: any;
  width?: number; estimatedHeight: number; children: React.ReactNode;
}): React.JSX.Element;

export function ActionSheetModal(props: {
  visible: boolean; onDismiss: () => void; dismissOnBackdrop?: boolean;
  children: React.ReactNode;
}): React.JSX.Element;

export function OverlayActionRow(props: {
  label: string; onPress: () => void; leading?: React.ReactNode;
  trailing?: React.ReactNode; selected?: boolean; danger?: boolean;
}): React.JSX.Element;
```

`MaterialPopover` measures its trigger and calls `getPopoverPosition`, rendering a clipped `BlurView` surface only after position is known. `ActionSheetModal` uses safe-area bottom padding and a rounded upper sheet with a grabber. Both use `getOverlayMaterial(mode)`, dim backdrop, and Reanimated `FadeIn`/`FadeInUp` entry motion.

- [ ] **Step 2: Typecheck the primitive**

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 3: Sort And Trip Action Popovers

**Files:**
- Modify: `src/components/ui/SortMenu.tsx`
- Modify: `src/components/ui/CardMenu.tsx`
- Modify: `src/components/ui/DeleteConfirmationModal.tsx`

- [ ] **Step 1: Recompose Sort as a material popover**

Replace manual `Modal`, measurements, and divider-heavy styles with:

```tsx
<MaterialPopover visible={visible} onDismiss={onDismiss} anchor={anchor} estimatedHeight={292}>
  <Text style={styles.heading}>Sort trips</Text>
  <Text style={styles.groupLabel}>Date</Text>
  <OverlayActionRow label="Date edited" selected={sortBy === 'edited'} onPress={() => handleSortByChange('edited')} />
  <OverlayActionRow label="Date created" selected={sortBy === 'created'} onPress={() => handleSortByChange('created')} />
  <View style={styles.groupDivider} />
  <Text style={styles.groupLabel}>Order</Text>
  <OverlayActionRow label="Newest first" selected={order === 'desc'} onPress={() => handleOrderChange('desc')} />
  <OverlayActionRow label="Oldest first" selected={order === 'asc'} onPress={() => handleOrderChange('asc')} />
</MaterialPopover>
```

- [ ] **Step 2: Recompose trip actions and separate deletion**

Use `MaterialPopover` with `OverlayActionRow` for Pin, Save, Lock, and Delete. Render `DeleteConfirmationModal` as a sibling, not inside an open popover modal; invoking Delete hides the actions and presents the sheet.

- [ ] **Step 3: Recompose deletion as an action sheet**

Render:

```tsx
<ActionSheetModal visible={visible} onDismiss={onDismiss} dismissOnBackdrop={false}>
  <Text style={styles.title}>Delete this memory?</Text>
  <Text style={styles.message}>This trip entry and its saved moments will be removed.</Text>
  <Pressable style={styles.destructiveButton} onPress={onConfirm}>
    <Text style={styles.destructiveText}>Delete Memory</Text>
  </Pressable>
  <Pressable style={styles.cancelButton} onPress={onDismiss}>
    <Text style={styles.cancelText}>Cancel</Text>
  </Pressable>
</ActionSheetModal>
```

- [ ] **Step 4: Typecheck**

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 4: Profile Cover Photo Action Sheet

**Files:**
- Modify: `app/(tabs)/profile.tsx`

- [ ] **Step 1: Replace native alert state and action**

Remove the `Alert` import, add `const [coverActionsVisible, setCoverActionsVisible] = useState(false)`, and replace `onPressChangeCover()` with `setCoverActionsVisible(true)`.

- [ ] **Step 2: Compose the app action sheet**

Add callbacks that close the sheet before entering the native picker flow:

```ts
const handleChooseCoverFromLibrary = async () => {
  setCoverActionsVisible(false);
  await chooseFromLibrary();
};

const handleTakeCoverPhoto = async () => {
  setCoverActionsVisible(false);
  await takePhoto();
};

const handleResetCoverPhoto = async () => {
  setCoverActionsVisible(false);
  await resetCover();
};
```

Render an `ActionSheetModal` near the end of the screen component:

```tsx
<ActionSheetModal visible={coverActionsVisible} onDismiss={() => setCoverActionsVisible(false)}>
  <Text style={styles.coverSheetTitle}>Change Cover Photo</Text>
  <OverlayActionRow label="Choose from Library" onPress={handleChooseCoverFromLibrary} />
  <OverlayActionRow label="Take Photo" onPress={handleTakeCoverPhoto} />
  <View style={styles.coverSheetDivider} />
  <OverlayActionRow label="Reset Cover Photo" danger onPress={handleResetCoverPhoto} />
  <Pressable style={styles.coverSheetCancel} onPress={() => setCoverActionsVisible(false)}>
    <Text style={styles.coverSheetCancelText}>Cancel</Text>
  </Pressable>
</ActionSheetModal>
```

Each callback dismisses the sheet before invoking the existing picker or reset function.

- [ ] **Step 3: Typecheck**

Run: `npx.cmd tsc --noEmit`

Expected: PASS.

### Task 5: Rendered And Native Verification

**Files:**
- No additional source files expected.

- [ ] **Step 1: Run automated checks**

Run:

```powershell
node --experimental-strip-types --test src/components/ui/overlayModel.test.ts features/home/components/homeTimelineModel.test.ts src/state/themeModel.test.ts src/components/iconAssets.test.ts src/components/iconModel.test.ts src/components/layout/appScreenModel.test.ts
npx.cmd tsc --noEmit
git diff --check
```

Expected: tests pass, TypeScript exits `0`, and no whitespace errors are reported.

- [ ] **Step 2: Render overlay states**

At `390 x 844`, inspect Home Sort, trip action popover, and delete confirmation sheet in dark and light mode. Verify the popover placement, clear selection state, readable destructive sheet, and that Delete never leaves the source popover visible behind it.

- [ ] **Step 3: Render Profile cover actions**

Open Profile's expanded cover-photo action and inspect the bottom sheet in both appearances. Confirm the three actions and Cancel use comfortable touch spacing and the reset action is distinctly destructive.

- [ ] **Step 4: Verify Expo path**

Request an iOS Metro bundle from the running server and have the user reopen the current QR session in Expo Go to check material blur, dismissal, and one-handed action reachability.
