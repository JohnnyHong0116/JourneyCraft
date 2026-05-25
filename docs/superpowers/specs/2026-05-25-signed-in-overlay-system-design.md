# Signed-In Overlay System Design

## Problem

JourneyCraft's signed-in overlays do not match the newer card, icon, navigation, or theme styling. The Home sort menu and trip-card three-dot menu are rigid opaque rectangles with dense divider lines and inconsistent spacing. The destructive flow stacks a small all-caps `ALARM` dialog over an already open menu. Profile cover-photo changes still use a generic system alert rather than the application's visual language.

These are repeated actions in the travel journal experience, so they need a consistent modern mobile interaction model rather than isolated cosmetic patches.

## Scope

This pass redesigns:

- Home `Sort` menu.
- Trip-card three-dot action menu.
- Trip deletion confirmation.
- Profile cover-photo actions.

This pass does not redesign:

- Sign-up date or gender selection sheets.
- Authentication error alerts.
- General settings rows or navigation.

## Interaction Model

Use two related overlay patterns:

1. **Material popovers** for quick contextual actions connected to a visible trigger.
   - Home Sort remains anchored beneath the top-right sort button.
   - Trip-card actions remain anchored near the three-dot trigger and flip above the trigger when lower space is limited.
   - Tapping outside dismisses the popover.

2. **Bottom action sheets** for flows that require consideration or offer media choices.
   - Deleting a trip opens a confirmation sheet.
   - Changing the Profile cover photo opens a choice sheet.
   - Sheets are easy to reach one-handed and do not compete visually with the source control.

When the user chooses `Delete` in a trip popover, the popover must close before the confirmation sheet is presented. Only one actionable overlay is visible at a time.

## Material And Motion

- Use `expo-blur`, already installed and compatible with Expo Go, for frosted surfaces that align with the bottom navigation and timeline date dividers.
- Do not add `expo-glass-effect`, because true Liquid Glass availability depends on newer iOS support and this experience must work on the user's iPhone 13 in Expo Go.
- In dark mode, use dark blurred surfaces with a restrained light hairline and soft shadow.
- In light mode, use pale system-material surfaces with a quiet border and soft shadow.
- Backdrops use a translucent dim wash that preserves context while separating the active layer.
- Popovers fade/scale subtly around their anchor; sheets fade the backdrop and rise from the lower edge. Motion should be fast and calm, never theatrical.

## Popover Design

### Sort Popover

- Rounded floating panel aligned to the sort trigger, with safe viewport margins.
- A quiet heading, `Sort trips`, appears at the top.
- Two compact groups appear underneath:
  - `Date`: `Date edited`, `Date created`.
  - `Order`: `Newest first`, `Oldest first`.
- Selected rows use the existing green accent through a check icon and faint selected tint.
- Replace dense full-width separators with group spacing and only one subtle separation between groups.
- Avoid exposing implementation language such as `(Default)` in the row label; selection visually communicates the active mode.

### Trip Action Popover

- Rounded frosted panel positioned near the specific trip's three-dot trigger.
- Actions are `Pin`/`Unpin`, `Save`/`Unsave`, and `Lock`/`Unlock`.
- Each row has a consistent icon leading or trailing treatment, at least a 44-point touch target, and a gentle pressed state.
- `Delete` appears as a distinct destructive row after a modest separator and uses semantic red text/icon.

## Sheet Design

### Delete Confirmation Sheet

- Present a lower sheet rather than a centered alert.
- Title: `Delete this memory?`
- Supporting copy: `This trip entry and its saved moments will be removed.`
- Primary destructive action: full-width `Delete Memory` button in red treatment.
- Secondary action: quiet `Cancel` button.
- The source action menu is closed before this sheet appears.

### Profile Cover Photo Sheet

- Replace `Alert.alert('Change Cover Photo', ...)` with an in-app sheet.
- Title: `Change Cover Photo`
- Actions: `Choose from Library`, `Take Photo`, and a separated red `Reset Cover Photo`.
- Include a clear `Cancel` action and maintain the existing picker/reset logic.

## Component Architecture

- Add reusable signed-in overlay primitives under `src/components/ui/`:
  - a material popover surface for anchored menus;
  - an action-sheet surface for lower modal flows;
  - pure overlay presentation/position helpers where logic is testable without rendering.
- Refactor `SortMenu.tsx` and `CardMenu.tsx` to compose the material popover instead of duplicating opaque modal styling and anchor calculations.
- Refactor `DeleteConfirmationModal.tsx` to compose the action-sheet surface.
- Add a Profile cover sheet component or compose the action-sheet surface locally in `app/(tabs)/profile.tsx`, preserving its current image selection functions.
- Continue using the resolved `AppPalette[mode]` and existing JourneyCraft semantic icon system.

## Accessibility And Resilience

- Action rows expose appropriate button labels and stable 44-point-or-larger touch targets.
- Modal surfaces dismiss on backdrop tap where dismissal is safe; delete confirmation requires either `Cancel` or `Delete Memory`.
- Popover position clamps within horizontal safe margins and chooses above/below placement without clipping behind the bottom navigation.
- Overlay content remains legible in both resolved themes at an iPhone 13-sized viewport.

## Verification

- Add pure tests for material styling decisions and anchored popover clamping/placement behavior.
- Run the existing theme, icon, footer, and Home timeline focused tests plus TypeScript checking.
- Render and inspect Home Sort, trip three-dot actions, and delete sheet at `390 x 844` in both themes.
- Render and inspect the Profile cover-photo sheet.
- Produce an iOS Metro bundle and have the user validate the popovers/sheets in Expo Go on iPhone 13.
