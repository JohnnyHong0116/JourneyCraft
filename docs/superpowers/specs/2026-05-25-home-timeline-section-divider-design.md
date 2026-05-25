# Home Timeline Section Divider Design

## Problem

The Home screen groups trip cards under labels such as `Yesterday` and `January 2025`. It currently renders those labels as transparent sticky `SectionList` headers. While the list scrolls, a pinned label sits directly over the next card title, producing collisions such as `Yesterday` over `Evening Walk`. This breaks readability and makes the otherwise polished card design feel unfinished.

## Direction

Use non-sticky, inline date dividers with a restrained Apple-material appearance. Section labels should organize the travel journal timeline without covering card content. The visual hierarchy remains:

1. Trip cards and their media are primary.
2. Section dividers provide chronology and rhythm.
3. Navigation and floating add action remain anchored above the scrolling content.

## Interaction Behavior

- Section labels scroll naturally with their cards; they do not remain pinned to the top of the list.
- No label can overlap a card title, metadata, image, or utility row during scrolling.
- Pull-to-refresh, pinned trip expansion, sort behavior, card navigation, and the bottom navigation remain unchanged.
- Section divider spacing creates a clear break before each chronological group while preserving comfortable one-handed scanning on an iPhone-sized screen.

## Visual Design

- Each divider is a compact rounded material capsule containing only the section title.
- The material uses the app's existing `expo-blur` dependency so it runs in Expo Go and aligns with the translucent bottom navigation.
- In dark mode, the divider uses a dark adaptive blur with a subtle light edge and high-contrast title.
- In light mode, it uses a light/extra-light adaptive blur with a soft border and dark title.
- The capsule should remain quieter than a trip card: minimal height, modest corner radius, no decorative icon, and no heavy shadow.
- Horizontal alignment matches the trip-card gutter so the timeline reads as one coherent column.

## Component Changes

- `app/(tabs)/home.tsx`: disable `stickySectionHeadersEnabled` for the timeline list.
- `features/home/components/SectionHeader.tsx`: render a blurred material capsule with adaptive tint, border, and spacing.
- No new global token system or new navigation behavior is introduced for this targeted repair.

## Compatibility

- Use `BlurView` from `expo-blur`, which is already installed and already used by the bottom navigation.
- Do not use `expo-glass-effect` for this element because Liquid Glass availability depends on newer iOS support and is unnecessary for a subtle divider.
- The component must remain readable in the web preview and Expo Go native rendering.

## Verification

- Add a small layout-model regression test specifying that Home timeline section headers are non-sticky.
- Run focused tests and TypeScript checking.
- Verify visually on `http://localhost:8083/home` at an iPhone-sized viewport: scrolling cannot make a date divider cover a trip-card title.
- Have the user verify the same scrolling behavior in Expo Go on the iPhone 13.
