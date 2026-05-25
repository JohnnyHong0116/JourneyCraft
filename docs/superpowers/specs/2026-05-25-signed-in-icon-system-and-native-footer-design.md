# Signed-In Icon System And Native Footer Design

## Goal

Make JourneyCraft's signed-in mobile experience feel visually consistent with its bottom navigation while fixing the native trip utility toolbar gap above the iPhone home indicator.

## Confirmed Problems

- The app currently mixes repository SVG assets and `Ionicons`, resulting in inconsistent stroke weights, shapes, and control styling across Home, trip, profile, settings, search, stats, and expenses.
- The profile settings icon is visibly broken in dark mode because `setting-selected.svg` and `setting-unselected.svg` contain a hard-coded white rectangle and black drawing paths instead of accepting theme color.
- The trip utility toolbar is rendered inside a `SafeAreaView` that pads its bottom edge. On iPhone, the toolbar surface stops above the bottom inset and leaves the screen background visible through the home-indicator area.

## Scope

This redesign covers signed-in application surfaces:

- bottom navigation and Home controls/cards;
- trip detail and new/edit toolbars and common trip actions;
- profile settings affordance;
- settings rows and reusable app layout controls;
- primary search, map, statistics, and expense action icons where the mixed icon language is visible.

Authentication and social-provider icons are outside scope because their visual identity is separate from in-app navigation and tools.

## Icon Direction

- The lower navigation bar defines the standard: simple silhouettes and rounded outline tools with restrained line weight.
- Reusable application icons are rendered through JourneyCraft's `Icon` component rather than a mixture of unrelated vector families.
- Assets that must react to theme color use `currentColor` without embedded white backgrounds.
- Existing usable SVGs are retained where their form matches the navigation language; new minimal SVG glyphs are added only for missing common actions.
- The icon API accepts semantic action names so screens do not depend on external icon-library naming.

## Footer Behavior

- The trip detail and trip editor utility surfaces extend behind the iPhone bottom safe-area inset so no page-background strip appears below them.
- Toolbar controls remain positioned above the home indicator with comfortable touch targets.
- With the keyboard shown, the editor toolbar remains attached to the keyboard boundary rather than leaving a gap or overlapping content.
- Scrolling content reserves enough bottom space for the complete visual footer.

## Verification

- Confirm in dark mode that the Profile settings button no longer contains a white box.
- Confirm Home, trip detail, new/edit trip, Profile, Settings, Search/Map/Stats, and Expenses use a coherent signed-in icon language.
- Confirm the trip toolbar surface reaches the bottom edge on an iPhone-size layout and remains usable above the home indicator.
- Run focused tests and TypeScript type checking; visually inspect at `390 x 844` and ask for Expo Go confirmation for true native safe-area behavior.
