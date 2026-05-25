# JourneyCraft Trip Card And Editor Polish Design

## Goal

Improve the core memory-capture loop on iPhone: scanning trip entries on Home, opening an entry, editing or adding content, and returning naturally. The experience should feel like a polished private travel journal rather than a generic social feed.

## Research Basis

- The existing `Travel_Mini_New` Figma file already defines a compact card feed and bottom utility toolbar for trip detail/edit views. This is the visual source of truth.
- Polarsteps presents trips as step-based memories combining photos, stories, locations, maps, statistics, and later reliving/sharing. Its product direction validates a quick-scanning memory timeline rather than oversized promotional cards.
- Journi presents photos, notes, maps, and timelines as the center of a travel diary. Its product direction validates keeping entries compact and narrative-first.
- Apple's Human Interface Guidelines distinguish tab bars, which navigate among top-level app areas, from toolbars, which provide actions for the current view. JourneyCraft should keep Home/Map/Stats/Profile as top-level navigation and place content actions in a bottom toolbar on trip screens.

Sources:

- https://www.polarsteps.com/
- https://support.polarsteps.com/hc/en-us/articles/29003811909394-How-do-I-create-my-first-trip
- https://www.journiapp.com/blog
- https://apps.apple.com/us/app/journi-journal-photo-book/id884030844
- https://developer.apple.com/design/human-interface-guidelines/tab-bars

## Navigation Behavior

- Home trip cards push a trip detail route, retaining the current forward slide transition.
- The visible `Home` back action on trip detail pops the pushed detail route with `router.back()`, so iOS plays the reverse transition and preserves Home scroll/state.
- Secondary child screens such as mood, location, people, media, or share continue to pop back to the trip context.
- The add-trip flow is entered from the central add action and closes back to Home after `Done`; edit-from-detail returns to the trip detail context after `Done`.
- The toolbar is an action surface, never a substitute for top-level tab navigation.

## Home Card Visual Direction

Keep the Figma compact journal-feed card structure, with a cleaner modern implementation:

- Card remains approximately compact enough to scan multiple days on one iPhone viewport.
- Title becomes the dominant line; date and location become quiet metadata in a single readable row.
- Thumbnail is a stable rounded square anchored at the upper right.
- Status icons are reduced to purposeful signals and use the same rounded, consistent icon language as navigation and trip tools.
- A real card footer/action rail sits inside the card at the bottom, divided from the entry summary with a subtle separator.
- The footer holds mood at the leading edge and media/action indicators at the trailing edge, with reliable touch targets for the overflow action.
- Surface, divider, text, and accent values use the shared resolved theme introduced in the theme-consistency work.

## Trip Detail And Editor Layout

- Detail content scrolls independently beneath the header.
- A bottom utility toolbar is positioned outside the scroll content and anchored to the bottom safe area.
- On an iPhone with no keyboard, the toolbar sits immediately above the home indicator area with no arbitrary vertical gap.
- Detail scroll content receives bottom inset padding equal to the toolbar height plus safe-area spacing, preventing content from hiding beneath tools.
- Add/edit screens reuse the same toolbar component and icon ordering to establish muscle memory.
- While the iOS keyboard is visible, the editor toolbar follows the keyboard boundary through keyboard avoidance rather than remaining stranded above the bottom inset.
- Toolbar treatment is restrained: softly separated surface, consistent icon sizes/touch targets, accent only for active or primary actions.

## Components And Scope

Implementation will focus on:

- route behavior in trip detail and editor completion actions;
- a reusable trip utility toolbar shared by detail and new/edit screens;
- `TripCard` layout and footer action rail;
- existing icon treatment or small icon substitutions using the repository icon pack or established Expo icon family;
- any minimal padding/safe-area changes required for iPhone layout correctness.

This pass does not broadly redesign map, statistics, profile content, or authentication screens. Their shared tab/navigation theme remains as already implemented.

## Accessibility And Responsiveness

- Controls use minimum comfortable touch targets around 44 points.
- Toolbar placement honors bottom safe-area insets, including iPhone 13.
- Text truncation is intentional for long trip titles and locations; metadata does not collide with thumbnails/actions.
- Light and dark appearance remain supported through the shared theme preference.

## Verification

- Confirm card-to-detail forward navigation and detail-to-Home reverse navigation on the route stack.
- Confirm new-trip and edit-trip completion destinations.
- Verify toolbar position in detail and editor at `390 x 844`, and verify editor placement with keyboard shown in Expo Go on iPhone.
- Verify Home card hierarchy, icon alignment, overflow affordance, and light/dark appearances.
- Run TypeScript checks and any focused test or route-behavior verification available in the Expo project.
