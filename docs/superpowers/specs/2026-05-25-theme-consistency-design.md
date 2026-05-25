# JourneyCraft Theme Consistency Design

## Goal

Fix light and dark appearance so the Settings preference consistently controls
the entire app and matches the existing Figma light and dark visual language.
The app should default to the iPhone's system appearance and allow a persistent
manual override.

## Current Problem

The Settings dark-mode switch is local component state and does not influence
other screens. Screens and shared components separately hardcode light colors,
dark colors, or fixed `mode="dark"`/`mode="light"` props. As a result, moving
between tabs and detail screens yields mixed backgrounds, surfaces, text, and
navigation colors.

## Theme Behavior

- Store a user theme preference as `'system' | 'light' | 'dark'`.
- Default new and existing users without a stored preference to `'system'`.
- Resolve `'system'` against React Native `useColorScheme()` so the app follows
  the current iPhone light/dark setting.
- Persist manual `light` or `dark` overrides across launches.
- Provide a Settings action that returns the app to system appearance after an
  override has been selected.

## Architecture

`AppStateProvider` will own and persist `themePreference` with the existing
session data. A theme hook exposed from app state will return:

- `themePreference`
- resolved `mode` (`'light' | 'dark'`)
- `setThemePreference`

The resolved mode is the only supported source of truth for runtime styling.
Shared layout components will use it by default, while an optional explicit
mode remains available only for truly intentional, design-specific exceptions.

The root layout will set status-bar appearance from the resolved mode. Tab
navigation and reusable components will use the same resolved mode so a theme
change applies immediately across navigation.

## Visual Tokens

Keep `AppPalette.light` and `AppPalette.dark` as the primary Figma-aligned
palette:

- Light: warm off-white to soft green background, white cards, dark text.
- Dark: charcoal to deep green background, charcoal cards, white text.
- Green accent behavior remains shared between modes.

Static `Colors` usages tied permanently to light mode will be replaced where
they affect themed surfaces or text. Existing design-system spacing, radii,
and typography are out of scope except where required for readable contrast.

## Screen Scope

Apply resolved theming to:

- Main tabs: home, calendar, location, stats, and profile.
- Settings and its child screens.
- Search, trip detail/editor flows, expense flows, and stat summaries.
- Reusable layout, settings-row, navigation, and card controls involved in
  those screens.

Authentication screens can remain light unless they are reached from a themed
authenticated workflow and exhibit an obvious background inconsistency; they
are not the primary dark-mode target in this pass.

## Responsive Constraint

The implementation must avoid adding device-specific fixed widths. Review will
be performed at the iPhone 13 logical viewport (`390 x 844`), but the theme
change should preserve existing flex/scroll behavior for other phone sizes.
A broader responsive-layout pass is separate work.

## Validation

- Verify the default mode follows system appearance when no override is stored.
- Verify manual Light and Dark selections persist and update screens
  immediately.
- Verify returning to System restores dynamic system-following behavior.
- Run TypeScript and Expo diagnostics.
- Inspect key light and dark screens at `390 x 844` in the Codex preview.
- Confirm final visual behavior in Expo Go on the user's iPhone 13, which is
  the native source of truth.
