# Trip Detail Progressive Disclosure Design

## Goal

Redesign the trip detail experience as a calm, mobile-native memory page that always represents the trip the user selected, keeps essential actions reachable during scrolling, and reveals supporting information only when it is useful.

## Design References

This direction follows Apple Human Interface Guidelines:

- Navigation and key actions belong in persistent toolbars so people remain oriented while content scrolls: https://developer.apple.com/design/Human-Interface-Guidelines/toolbars
- Scrollable content should move independently beneath controls that act on the view: https://developer.apple.com/design/human-interface-guidelines/scroll-views
- Secondary information can use disclosure rather than occupying the whole resting screen: https://developer.apple.com/design/human-interface-guidelines/disclosure-controls
- Interactive targets must remain clear and at least 44 by 44 points: https://developer.apple.com/design/human-interface-guidelines/buttons

## Data Integrity

`/trip/[id]` resolves the selected `Trip` from `mockTrips` by route ID. The detail title, location, cover/media count, audio count, companions, mood, and display date all derive from that record. If an unknown ID is opened, the page presents a quiet unavailable state with a back action instead of displaying unrelated mock content.

Screens opened from trip detail also receive the selected trip ID:

- Photos renders only the selected trip's photos and the correct photo count.
- Location renders the selected trip location rather than Chengdu locations.
- People represents the selected trip companions and permits entering the existing selection flow.
- Share labels the selected trip.
- Edit initializes visible trip identity/content affordances from the selected trip.
- Expenses receives `tripId` and only summarizes expense records linked to that trip.

The existing data currently has no expense record for trip `1`, so its Expenses expansion shows an honest empty state and routes to an empty/add-capable Expenses view. It must not display Chengdu spending for `Morning Coffee Run`.

## Persistent Chrome

The screen has two persistent layers:

1. A compact top navigation bar outside the scrolling content. It contains a standard chevron back control on the leading side and More plus Share actions on the trailing side. It has no incorrect `Home` centered heading. After the large content title moves beyond the top edge, a compact trip title appears in the navigation bar for orientation.
2. The existing bottom trip utility toolbar remains pinned and receives the selected trip ID for its navigation actions.

Both fixed layers use theme-aware translucent or quiet card surfaces and safe-area insets. Scrolling affects the content only, never these controls.

## Header Content And Timestamp

At rest, the page begins with the large selected trip title and its mood treatment if available. The generic `Main page` label and `content` placeholder are removed because they do not describe saved user information.

The display timestamp is hidden in the normal resting layout. On iOS, downward overscroll reveals a subdued timestamp above the large title, with opacity and height increasing with pull distance; releasing the pull collapses it. Scrolling upward never leaves a persistent gray timestamp behind. On platforms without elastic overscroll, the resting page remains clean and does not reserve timestamp space.

## Companion Cluster

The trip header includes a tappable participant cluster:

- No companions: an add-person affordance.
- One companion: one compact avatar with the person's initial.
- Multiple companions: two overlapping initial avatars and a small `+N` count badge for additional people.

Tapping the cluster navigates directly to that trip's People screen. This converts the decorative profile circle into a clear, useful action while making group trips visible at a glance.

## Feature Rail

Photos, Location, Audio, and People become one horizontal, single-line feature rail below the identity header.

- Resting state: four 48-point minimum icon buttons with restrained surfaces.
- First tap: exactly one control expands into a capsule with an icon and current value, such as `1 Photo`, `Madison, WI`, `No Audio`, or `Sarah`.
- Tap on a different icon: collapses the previous feature and expands the new one.
- Second tap on the expanded capsule: opens that feature's corresponding screen or current preserved action.

Photos opens media; Location opens location; People opens people. Audio retains the current editor/recording destination until a dedicated audio playback screen exists. Controls with zero recorded items remain discoverable, and their expanded label communicates the empty state rather than pretending data exists.

## Expenses Disclosure

Expenses is not a large permanent document card. It becomes a pinned capsule above the bottom utility toolbar, separated from the rail because spending is a supporting workflow rather than a memory attachment.

- Collapsed state: a compact capsule labeled `Expenses`, with a receipt/wallet-style icon and an optional linked total when records exist.
- Expanded state: a small elevated panel containing `Expenses`, the selected trip's total or `No expenses yet`, and a clear `View expenses` action.
- Tapping the action navigates to the selected trip's Expenses view. The page reserves bottom scrolling space so content cannot be obscured by the pinned capsule and toolbar.

## Interaction And Motion

Only one feature rail capsule is expanded at a time. Expenses maintains its own expansion because it is anchored near the persistent toolbar and does not compete spatially with the upper feature rail.

Expansions use short, subtle layout/opacity animation consistent with the app's existing restrained motion. Press states and accessibility labels disclose both current state and next action, for example `Expand Photos, 1 item` and `Open Photos, 1 item`.

## Scope

This redesign includes the trip detail route and the immediately reachable trip-context screens/data adapters needed to prevent misleading content. It does not redesign the entire Expenses information architecture, invent audio playback, or add persistent storage for new trip fields not present in current mock data.

## Verification

Pure model tests cover trip lookup, feature labels/destinations, companion summary, expense totals/empty states, and title/date formatting. Render checks at the iPhone 13 viewport cover pinned chrome during scrolling, feature expansion/navigation readiness, collapsed and expanded Expenses states, and data consistency for trip `1` and a trip with recorded expenses. Native validation includes TypeScript and an Expo iOS Metro bundle.
