# JourneyCraft Mobile App: Figma Make UI/UX Design Brief

## 1. Purpose Of This Document

Create a complete mobile product design for **JourneyCraft**, a personal travel-memory journal that combines:

- trip memories and media;
- emotion and companion tagging;
- trip planning and calendar browsing;
- map-based recall;
- travel expense summaries;
- a profile gallery and personal settings.

This brief describes the implemented product experience on the `fix/ui-polish` branch and translates it into a coherent Figma Make build specification. It is intended for an iPhone-first design file, using the iPhone 13 frame as the reference viewport while remaining responsive on other phone sizes.

Primary reference frame:

- Device: iPhone 13.
- Frame size: `390 x 844`.
- Platform behavior: iOS safe areas, home-indicator bottom inset, keyboard avoidance, stacked push navigation.

The app must feel like a private travel diary rather than a booking application. It should be calm, tactile, image-led, and useful for repeatedly browsing, adding, editing, and remembering moments.

## 2. Product Identity And Mood

### Brand

- Product name: **JourneyCraft**.
- Core idea: craft personal travel stories from photos, notes, places, people, feelings, and spending.
- Tone: reflective, intimate, organized, and quietly premium.
- Avoid: loud tourism advertising, oversized marketing heroes inside the signed-in app, playful novelty icons, or overly corporate dashboards.

### Visual Personality

- Dark mode is the primary signed-in showcase: deep near-black at the top fading toward forest green at the lower screen.
- Light mode is soft and natural: warm off-white at the top fading into pale leafy green.
- Accent green identifies active navigation, primary calls to action, selected controls, map pins, and positive state.
- Photos carry emotion and variety. UI surfaces stay restrained so memories remain dominant.
- Icons are simple rounded line/silhouette glyphs with consistent stroke weight, visually aligned with the bottom navigation icon family.

## 3. Global Design System

### 3.1 Color Tokens

Build color variables with light and dark modes.

| Token | Light Mode | Dark Mode | Use |
| --- | --- | --- | --- |
| Background Top | `#F3F2ED` | `#0E0E0E` | Top of every primary app background |
| Background Bottom | `#D8EAD0` | `#102D25` | Lower gradient color |
| Main Text | `#101010` | `#FFFFFF` | Titles, values, active icons |
| Secondary Text | `#65646B` | `#B8B5BF` | Metadata, captions, placeholders |
| Card Surface | `#FFFFFF` | `#2C2C2C` | Cards, editor toolbar, settings rows |
| Muted Surface | `#E5E1E0` | `#34343C` | Icon circles, empty media, search fields |
| Divider | black at 15% | white at 20% | Hairline divisions |
| Accent Fill | `#B7D58D` | `#B7D58D` | FAB, switches, primary buttons |
| Accent Strong | `#5FAF70` | `#62AD74` | Active icon, links, map markers |
| Danger | `#C1221B` | `#ED7368` | Destructive controls |
| Navigation Surface | `#FFFFFF` | `#1E1E1E` | Persistent bottom navigation |
| Navigation Inactive | `#CACBCF` | `#6B7073` | Unselected tab icons |

### 3.2 Type System

Use the iOS system font family. Use strong, highly legible weights without decorative type.

| Style | Size | Weight | Typical Use |
| --- | --- | --- | --- |
| Brand / Page Hero | `32 px` | Bold | JourneyCraft title on Home; full screen title where needed |
| Large Content Title | `25-26 px` | Bold | Trip title; editor title |
| Screen Header Title | `20 px` | Bold | Pushed-page centered header |
| Card Section Heading | `18-20 px` | Bold | Pinned, Expenditure, Main page |
| Body / Row Title | `16 px` | Semibold/Bold | Settings row, chips, input content |
| Supporting Metadata | `14 px` | Medium/Regular | Dates, captions, secondary copy |
| Small Metadata | `12 px` | Medium | Card dates/location, legends |
| Large Financial Total | `46-49 px` | Semibold | Expense summary value |

Rules:

- Use no negative letter spacing in the redesigned Figma components.
- Values and compact counters should use aligned numerals.
- Titles truncate gracefully only when a single-row compact layout requires it, for example profile username.

### 3.3 Spacing And Shape Tokens

Use an `8 px` rhythm with selective compact spacing:

| Token | Value | Use |
| --- | --- | --- |
| Extra Small | `4 px` | Fine gaps, icon/copy alignment |
| Small | `8 px` | Chip gaps, metadata gaps |
| Medium | `12 px` | Toolbar/component spacing |
| Large | `16 px` | Screen horizontal padding, card padding |
| Extra Large | `20 px` | Major component spacing |
| XXL | `24 px` | Section separation |
| XXXL | `32 px` | High-level vertical rhythm |

Radius language:

| Component | Radius / Shape |
| --- | --- |
| Small image or compact chip | `8-12 px` |
| Standard form field | `15 px` |
| Surface card | `15-20 px` continuous curve |
| Settings row | `16 px` |
| Icon background button | Perfect circle or `12 px` compact square |
| Primary action button | `15 px` rounded rectangle |
| FAB | Perfect `64 px` circle |

### 3.4 Elevation And Borders

- Dark mode depends mainly on contrast and fine dividers, not bright shadows.
- Light mode cards may use a subtle soft shadow: low opacity black, slight downward offset and broad blur.
- Trip cards use a hairline border in either mode for definition.
- Overlay menus use a clear shadow or elevation so they float over the dimmed page.
- Bottom navigation has a soft upward shadow/blur transition into content.

### 3.5 Icon System

- All signed-in utility icons should be transparent vector glyphs inheriting the text or accent color.
- Glyph family is rounded, minimal, and approximately `1.7-2 px` stroke at `24 px`.
- Persistent navigation uses filled/silhouette versions for selected tabs and subdued versions for unselected tabs.
- Standard action sizes:
  - metadata icon: `14-17 px`;
  - card/row action icon: `18-22 px`;
  - header action icon: `20-22 px` inside a `34-42 px` surface;
  - navigation icon: `24 px`;
  - central add icon: approximately `38 px`.
- Authentication social-provider marks may retain their own brand identities and should not be converted into the application icon language.

## 4. Navigation Architecture

### 4.1 Top-Level Destinations

The persistent signed-in bottom navigation exposes four destinations plus a central create action:

| Position | Destination | Route Concept | Meaning |
| --- | --- | --- | --- |
| Far left | Home | Home journal feed | Browsing trip entries |
| Inner left | Map | Location map | Spatial memory browsing |
| Center raised button | New Trip | Create trip editor | Capture a new memory |
| Inner right | Statistics | Insights | Trends and expenses |
| Far right | Profile | Personal gallery | Identity and settings entry |

Calendar is not a fifth primary tab. It is an alternate Home view, accessed through the calendar icon in the Home header and returned through its list-view icon.

### 4.2 Transition Rules

For the Figma prototype:

- Switching among Home, Map, Statistics, and Profile should feel like switching destinations at the same hierarchy level. Use an instant swap or restrained crossfade; do not animate these as deeper pages arriving from the right.
- Tapping a trip card, settings row, search result, expense row, or secondary action pushes a new page from the right.
- Tapping the back control reverses the pushed page toward the right and reveals the previous context.
- Tapping the central add button opens **New Trip** as a focused creation workflow above the tabs; the normal tab bar is replaced by the trip editing utility toolbar.
- Search can be cancelled back into the originating Home/Map context.
- Sign-in/sign-up completion replaces authentication with Home, so users do not accidentally return to auth with a back gesture.
- Log out replaces the signed-in shell with the sign-in screen.

### 4.3 Persistent Navigation Bar Shape And Layering

The navigation bar is a defining JourneyCraft component.

Structure:

- It is fixed to the bottom of all four primary tab screens and overlays the gradient content.
- It includes the iPhone home-indicator safe-area area as part of its own dark/light navigation surface.
- It has a soft blur/feather transition above its top edge, allowing content to scroll behind visually without losing contrast.
- Overall structural height above the safe inset is approximately `92 px`.
- Four icon hit targets sit in two pairs on either side of a central opening.

Central notch and FAB:

- The bar top edge is mostly horizontal, but curves downward in a smooth central cradle.
- A `64 x 64 px` circular green Floating Action Button rests in that cradle, elevated above the bar.
- The button visibly overlaps the content/bar boundary: the upper portion floats above the bar; the lower portion is visually embedded in the notch.
- Use a white `+` glyph centered within the circle.
- The FAB should be the most obvious action without becoming oversized or detached from the navigation component.

Safe-area and overlap logic:

- The navigation surface continues behind the home indicator; no background color strip may appear beneath it.
- Scrollable tab content must include lower padding of roughly the navigation height plus comfort space so final content is never hidden under the overlaid bar or central FAB.
- Selected tab icons use accent green. Unselected tabs use muted gray. The FAB remains accent green regardless of current tab.

## 5. Shared Components To Build In Figma

Build these as reusable components with light/dark and interactive variants before assembling screens.

### 5.1 Screen Background

- Full-height vertical gradient.
- Dark: near black top into green-black lower region.
- Light: warm parchment/off-white into pale leaf green.
- Pushed screens and primary tab screens both inherit this background unless a photo cover intentionally occupies the top area.

### 5.2 Centered Navigation Header

Used on detail, settings, expense, help, and editor screens.

- Height: minimum `50 px` inside safe-area content.
- Left: `44 px` minimum hit area containing thin back chevron; optional text label such as `Home`, `Back`, or `Cancel`.
- Center: bold screen title.
- Right: balanced action region, such as `Done`, plus icon, overflow icon, or two circular icon buttons.
- When right content is absent, preserve balanced side widths so title remains optically centered.

### 5.3 Circular Header Action

- Size: `34-42 px`, perfect circle.
- Background: muted surface.
- Icon: centered `20-22 px` glyph in main text color.
- Pressed state: slightly lighter/darker surface or subtle opacity.
- Used for search, sort, calendar view, overflow, menu, plus-add, and settings.

### 5.4 Segmented Control

- Full-width rounded horizontal track.
- Track: muted surface.
- Two equal segments with `4 px` inset padding for Home, or compact `2 px` inset for shared screens.
- Selected segment: card surface with subtle elevation in light mode or lighter charcoal in dark mode.
- Labels: semibold; selected label is visually strongest.
- Variants: `Visited / Planned`, `Monthly / Annual`, `Log in / Sign Up`.

### 5.5 Surface Card

- Flexible-width rounded card on the gradient background.
- Radius: `15-20 px`.
- Padding normally `16 px`.
- Variants: information card, chart card, menu card, compact trip card, selection list, settings row.
- Light mode may cast a low shadow; dark mode uses fine border/tonal distinction.

### 5.6 Chip / Tag Button

- Height: at least `34 px`.
- Content: left icon plus compact semibold label.
- Radius: approximately `8 px`.
- Default: card surface; active: accent green with dark copy.
- Used for Photos, Location, Recorded Audio, People, Dates, Category filters, and selected tagging.

### 5.7 Primary Button

- Height: `54 px`.
- Full width inside the content column.
- Accent green surface, dark green/charcoal label, optional trailing check or send icon.
- Radius: `15 px`.
- Used for Save Settings, Add People, Submit Feedback and Contact Support.

### 5.8 Form Field

- Label above field; label is bold body size.
- Field height minimum `54 px`, rounded `15 px`, card/input surface.
- Optional left semantic icon, editable text, optional trailing edit icon.
- Variants: empty placeholder, typed value, locked/read-only, multiline text area, upload region.

### 5.9 Settings Row

- Height: minimum `74 px`; expands for descriptions.
- Surface: card, rounded `16 px`.
- Left icon is placed in a `48 x 48 px` circular muted-surface holder.
- Middle contains bold label and optional supporting description.
- Right contains either a value plus chevron, a chevron only, or a toggle.
- Toggle: `54 x 29 px` capsule, green when active; round thumb shifts horizontally.
- Danger row: icon circle uses destructive tint and row communicates risk clearly.

### 5.10 Trip Utility Toolbar

This is separate from the persistent tab bar and appears on trip detail/editor workflows.

- Anchored to the physical bottom of the phone.
- Card-surface strip with a hairline upper divider.
- Visible control height above safe inset: `68 px`.
- Surface extends beneath the iPhone home indicator; controls remain above the indicator.
- Each control has a `44 x 44 px` hit area and a `12 px` corner radius on active/pressed fill.
- Detail toolbar has six actions: text/edit, photos, camera, microphone, send/share, add.
- Editor toolbar has seven actions: enhance/sparkle, text formatting, photos, camera, microphone, send/share, add.
- Active editor tool, such as text formatting, receives muted background and accent-colored glyph.
- When the keyboard appears in the editor, the toolbar attaches to the keyboard boundary without an extra bottom safe-area gap.

## 6. Global States And Behaviors

### 6.1 Theme Logic

- Default setting is **Follow System Appearance**.
- Users may manually override to Light or Dark in Settings.
- A manual override persists across app usage until system appearance is explicitly chosen again.
- All signed-in screens, pushed screens, cards, controls, icons, and overlays must update coherently when the mode changes.
- Auth is visually light-oriented in the current concept; it may remain its welcoming pale-green form while the signed-in shell demonstrates full theming.

### 6.2 Scrolling

- Screens with content longer than the viewport vertically scroll without visible scrollbars.
- Home uses a sectioned scroll list and supports pull-to-refresh.
- Section headers remain legible as content rolls; chronological groups may behave as sticky headers.
- Bottom bars overlay the viewport, so scrolling layouts reserve room below the final content.
- Pushed screens without a persistent bottom bar still respect the bottom safe inset.

### 6.3 Keyboard And Editable Screens

- Sign-up, trip editing, add expense, profile edit, and feedback screens avoid the keyboard.
- Lower text fields remain visible while typing.
- The trip editor toolbar rides above the keyboard.
- Dropdown suggestions and selection sheets appear above the keyboard where necessary.

### 6.4 Overlays And Modal Layers

Overlay hierarchy:

1. Current screen/background.
2. Absolute bottom navigation or bottom utility toolbar.
3. Anchored menus/dropdowns and their dimming backdrop.
4. Confirmation dialog or crop interface above all regular page content.

All modal/overlay backgrounds should dim the underlying view while preserving enough context to understand what is being acted upon.

## 7. Screen Inventory And Detailed Specification

## 7.1 Splash / Launch Screen

Route concept: `/`.

Purpose:

- A minimal entry moment while application state loads.

Elements:

- Full gradient app background.
- Centered wordmark `JourneyCraft`, bold approximately `25 px`.
- No navigation or additional copy.

Behavior:

- Appears briefly, then automatically transitions to Sign In.
- If later expanded to respect persisted authentication, it can replace to Home for authenticated users; the current visible flow redirects to sign-in.

## 7.2 Authentication: Log In

Route: `/auth/sign-in`.

Overall appearance:

- Welcoming light background with off-white-to-pale-green vertical gradient.
- No signed-in bottom navigation.
- Content column is centered with maximum width around `360 px`.

Elements from top to bottom:

1. Brand label `JourneyCraft` centered near the top.
2. Large headline `Get Started now`.
3. Supporting two-line message: create an account or log in to explore the app.
4. Two-segment switch: `Log in` active and `Sign Up` inactive.
5. Labeled username/email input:
   - white rounded field;
   - account icon at left;
   - placeholder `Enter username or email`;
   - clear button appears only when focused with content.
6. Labeled password input:
   - white rounded field;
   - lock icon at left;
   - obscured entry;
   - clear and show/hide-eye actions appear when content exists.
7. Utility row:
   - square checkbox and label `Remember me` aligned left;
   - `Forgot Password?` text action aligned right.
8. Full-width green `Log in` primary button.
9. Divider row with thin lines around `Or Login with`.
10. Four social/alternative login buttons:
    - individual white rounded squares;
    - WeChat, Apple, Google, and phone icons.

Interaction:

- Tapping `Sign Up` animates the segmented pill and horizontally slides to the sign-up form.
- `Forgot Password?` pushes recovery options.
- Successful log in replaces authentication with Home.
- Keyboard moves content enough to retain active fields.

## 7.3 Authentication: Sign Up

Route: `/auth/sign-up`, or Sign Up segment in the authentication shell.

Elements:

1. Same brand, headline, helper copy, and segmented selector with `Sign Up` active.
2. Vertically scrollable form with fields:
   - Username.
   - Date of Birth selector.
   - Gender selector.
   - Phone field with inline country/area-code selector and divider.
   - Email field.
   - Password field with show/hide state.
   - Re-enter Password field with show/hide state.
   - Location autocomplete field.
3. Validation error variant beneath email, with alert icon and destructive message.
4. Full-width green `Sign Up` action button.
5. Divider `Or Signup with`.
6. Social provider row matching Log In.

Secondary layers:

- Date of Birth modal:
  - dimmed backdrop;
  - bottom-oriented or centered sheet with top handle;
  - iOS spinning date picker;
  - confirmation action that commits selected date;
  - tapping outside cancels uncommitted changes.
- Gender selection modal:
  - dimmed backdrop;
  - compact selection list for available values;
  - selecting one commits and closes.
- Country code dropdown:
  - overlays below phone input;
  - scrollable list showing country and dialing prefix;
  - typing filters options;
  - tapping outside reverts uncommitted draft.
- Location autocomplete dropdown:
  - floats beneath location input;
  - rows show concise city/state/country text;
  - loading and `No matches` states;
  - selecting a result commits text; dismissing reverts to committed value.

Behavior:

- Form scroll position is maintained while completing lower fields.
- Keyboard dismissal does not suddenly jump the form away from the user’s current editing position.
- Completing sign-up replaces the authentication stack with Home.

## 7.4 Forgot Password

Route: `/auth/forgot-password`.

Elements:

- Signed app-gradient page shell with centered header `Forgot Password` and back arrow.
- Three stacked recovery surface cards:
  - `Google Authenticator` with security explanation.
  - `Email Address` with masked destination.
  - `Phone Number` with masked number.

Interaction:

- Back returns to authentication.
- In an expanded prototype, tapping a recovery method would continue to verification.

## 7.5 Home: Journal Feed

Route: `/(tabs)/home`.

Purpose:

- Primary browsing surface for travel memories and planned journeys.

Background and fixed layers:

- Full dark/light app gradient.
- Persistent bottom navigation overlays the lower viewport with central add FAB.

Header:

1. Large `JourneyCraft` wordmark left-aligned.
2. Three circular utility controls on the right:
   - Search: opens search categories.
   - Sort: opens anchored sort menu.
   - Calendar: opens calendar/timeline representation using the currently selected `Visited` or `Planned` mode.
3. Full-width segmented control immediately beneath:
   - `Visited` and `Planned`;
   - currently selected segment uses raised card surface.

Feed structure:

- Vertically scrolling section list.
- A collapsible `Pinned` section appears first when one or more trips are pinned.
  - Section header contains bold text and downward chevron.
  - When collapsed, content animates upward with fading opacity and chevron rotates sideways.
- Ordinary timeline sections are labeled by recency/month, for example `Yesterday` or `January 2025`.
- Section headers can remain visible while the list scrolls through groups.

Trip card anatomy:

- Outer rounded rectangle card with hairline outline; dark mode uses charcoal surface.
- Summary area:
  - Left content expands to available width.
  - Optional small green pin glyph before the title.
  - Single-line bold trip title.
  - Date metadata row with calendar icon.
  - Location metadata row with pin icon.
  - Right-aligned `78 x 78 px` rounded cover image; if no media exists, show a muted placeholder with image glyph.
- Footer utility strip:
  - separated by a hairline divider;
  - left-side status signals: mood badge in a small rounded muted square, saved bookmark, lock, and companion icons as applicable;
  - right-side asset signals: image, microphone, and video icons only if those media types exist;
  - overflow ellipsis action at the far right.

Interactions:

- Tap card body: push Trip Detail.
- Tap card overflow only: open card menu without navigating into the card.
- Pull down list: trigger refresh indicator.
- Switch to Planned: card data and timeline sections update while layout stays identical.
- FAB: push New Trip.

## 7.6 Home Sort Menu Overlay

Trigger: sort icon in Home header.

Appearance:

- Dim translucent backdrop across the full screen.
- Anchored rounded surface menu right-aligned under the sort button.
- Width approximately `240 px`.

Contents:

- Section label `SORT BY`.
- Rows `Date Edited` and `Date Created (Default)`, with green checkmark on active row.
- Strong divider between category and order.
- Rows `Ascending` and `Descending (Default)`, with green checkmark on active row.

Behavior:

- Selecting any option immediately changes Home ordering and closes menu.
- Tapping backdrop dismisses without changing selection.

## 7.7 Trip Card Overflow Menu And Delete Confirmation

Trigger: ellipsis on a Home trip card.

Card menu:

- Full-screen subtle dim backdrop.
- `250 px` wide anchored rounded menu aligned with card overflow action.
- Menu is shown below the action when space exists; if close to the bottom, it flips above the action.
- Four rows:
  - Pin / Unpin with pin glyph.
  - Save / Unsave with bookmark glyph.
  - Lock / Unlock with lock glyph.
  - Delete, separated by thicker divider and styled in danger red.

Delete confirmation dialog:

- Opens above the menu interaction layer when Delete is selected.
- Centered `270 px` rounded card.
- Upper content: uppercase title `ALARM`, centered question `Are you sure to delete this entry?`
- Lower split button row:
  - `CANCEL` in accent text;
  - `DELETE` in danger red;
  - vertical divider between buttons.
- Background is more strongly dimmed than the menu backdrop.

## 7.8 Calendar / Timeline View

Route: `/(tabs)/calendar`, entered through Home calendar action.

Purpose:

- View visited emotional history or planned itinerary in a calendar form.

Elements:

1. Header row:
   - `JourneyCraft` title.
   - circular list-view button returning to Home.
2. `Visited / Planned` segmented control preserving the mode passed from Home.
3. Calendar surface card:
   - centered month label such as `July 2025`;
   - left/right month chevrons;
   - weekday abbreviation row;
   - seven-column date grid;
   - selected days highlighted by soft accent fill;
   - in Visited mode, small mood markers beneath applicable days.
4. Itinerary/mood card below:
   - date-range label.
   - Visited mode: horizontal mood-emotion row.
   - Planned mode: vertical itinerary rows for Day 1 through Day 4, showing destination and completion indicator.

Navigation:

- This screen conceptually remains within Home; in Figma prototype keep the Home destination relationship obvious.
- List icon returns to the Home feed without a deeper-stack animation.

## 7.9 Map Tab

Route: `/(tabs)/location`.

Purpose:

- Browse memories spatially.

Elements:

1. Large `Map` page title.
2. Search field/button:
   - rounded muted surface;
   - search glyph and placeholder `Search places and entries`;
   - opens Search.
3. Large rounded map canvas:
   - occupies the main vertical flexible area;
   - restrained dark/light muted map styling;
   - abstract road lines beneath content;
   - green pin markers with compact location labels such as Madison, Chicago, Chengdu.
4. Bottom preview card above navigation:
   - title `Chengdu Summer Escape`;
   - metadata `3 journal entries nearby`;
   - text action `View trip memories` and right chevron.

Behavior:

- Tap search to enter Search.
- Tap preview to push Trip Detail.
- Bottom navigation remains fixed and Map icon is active.

## 7.10 Statistics Tab: Monthly

Route: `/(tabs)/stats`, initial monthly state.

Elements:

1. Centered page title `Statistics`.
2. `Monthly / Annual` segmented control.
3. Centered date selector, such as `Jul 2025`, with downward chevron.
4. Expense summary surface card:
   - left title `Trip Expenses`;
   - metadata showing period and trip count;
   - right-aligned `Total` label and amount, e.g. `CNY 200.00`;
   - chevron to more analysis.
5. Travel days card:
   - airplane icon and number;
   - supporting sentence;
   - circular percentage indicator on right.
6. Trips-with-activity card:
   - map icon, count and supporting sentence;
   - chevron for exploration.
7. Mood Bar card:
   - title;
   - five mood color dots and percentages;
   - lower stacked horizontal distribution bar.

Behavior:

- Statistics tab icon is active in bottom navigation.
- Tapping expense summary pushes Statistics Summary.
- Period selector expands a date-picker panel.

## 7.11 Statistics Period Picker Expanded State

This is an inline expanding surface under the date selector, not a full-screen modal.

Elements:

- Surface card headed `Select year and month` in monthly mode or `Select year` in annual mode.
- Year option row, showing available record status and selected state.
- Monthly mode additionally shows a month grid.
- Selected period is filled or emphasized with accent.
- Legend identifies recorded activity vs no records.

Behavior:

- Panel inserts into vertical content and pushes cards downward.
- Selecting a month closes the picker and updates all monthly statistics.
- Switching monthly/annual closes picker and replaces content below.

## 7.12 Statistics Tab: Annual

Elements:

- Shared header, segmented control and year selector.
- Expense summary card for full year.
- Annual spending chart card with twelve month columns or bars and currency unit.
- Four compact metric tiles:
  - Traveled Days.
  - Recorded Trips.
  - Frequent Mood.
  - Journal Entries.

Behavior:

- Selecting a year recalculates yearly totals and chart values.
- Summary card continues into Statistics Summary configured for annual data.

## 7.13 Statistics Summary

Route: `/stats/summary`.

Elements:

- Centered pushed header displaying period, for example `July 2025 Summary`, with overflow icon on right.
- Total Expense card:
  - title;
  - large financial amount;
  - progress bar;
  - supporting trip-count metadata.
- Chart card:
  - donut chart;
  - color legend for Transport, Hotel, Food, Others.
- Full-width action row `Open expense breakdown` with chevron.

Behavior:

- Tap total card or action row to push the Chengdu Trip expense breakdown.

## 7.14 Profile Tab: Default Gallery State

Route: `/(tabs)/profile`.

Purpose:

- Personal identity, recap metrics, and visual archive.

Layering:

- Unlike most tabs, profile begins with a full-width photographic cover at the top.
- Main content and imagery scroll under/above the fixed bottom navigation.

Elements:

1. Cover banner:
   - wide photographic image;
   - cropped in its resting state.
2. Avatar:
   - `96 px` circular avatar;
   - white border;
   - overlaps the lower cover boundary upward by approximately `32 px`.
3. Top-right action row:
   - rounded `Edit Profile` button;
   - circular settings gear button.
4. Identity/statistics row:
   - left: single-line truncated username `Journey Trave...`, two-line bio and optional location;
   - right: three centered metrics: Posts, Days, Places with bold numerals.
5. Horizontal highlight carousel:
   - five circular travel thumbnails;
   - scrolls sideways if content exceeds width.
6. Hairline horizontal divider.
7. Mosaic photo gallery:
   - first row of three square images;
   - second row with a large two-column portrait image paired with two stacked smaller images;
   - continued grid rows below viewport.

Interactions:

- Edit Profile pushes personal-information edit form.
- Gear pushes Settings.
- Vertical scroll browses gallery.
- FAB and bottom navigation stay available on the tab.

## 7.15 Profile Cover Expanded And Cropping States

Expanded cover behavior:

- Pulling downward on the top of Profile stretches the cover.
- Pulling far enough reveals the fuller image area, darkens/dims supporting header content, and fades Edit Profile/settings actions.
- A `Change Cover` action appears over the expanded image.
- Tapping the image/scrim collapses it back to the resting crop.

Change Cover behavior:

- User may select image from library or use camera.
- The crop interface appears above the profile content.

Crop overlay:

- Strong dark full-screen dim background.
- Centered crop card with title/instruction.
- Large image viewport.
- Visible crop selection rectangle with accent outline and translucent green fill.
- Rule-of-thirds style guide lines.
- Bottom action buttons: cancel and confirm crop.
- Confirm returns to Profile with new cropped resting banner.

## 7.16 Trip Detail

Route: `/trip/[id]`, illustrated by Trip to Chengdu.

Purpose:

- A focused memory page showing journal summary and entry tools.

Important navigation change:

- The persistent four-tab navigation and raised FAB are not shown.
- A dedicated bottom trip utility toolbar replaces them.

Elements:

1. Pushed header:
   - back chevron plus `Home` label on left;
   - centered title `Home` identifying origin;
   - right circular overflow and menu actions.
2. Centered timestamp: `July 24, 2025 at 5:20pm`.
3. Large trip title: `Trip to Chengdu`.
4. Content heading row:
   - bold `Main page`;
   - round accent avatar/person badge at right.
5. Vertical stack of compact chips:
   - `Photos 3`;
   - `Location Chengdu`;
   - `Recorded Audio 3`;
   - `People`.
6. Flexible journal content region.
7. Expense callout card positioned toward the lower content area:
   - title `Expenses`;
   - subtitle `View Chengdu trip summary`;
   - chevron.
8. Fixed trip utility toolbar:
   - edit/text, photos, camera, microphone, share/send, add.

Behavior:

- Back reverses to the Home list.
- Media/location/people chips push their respective secondary screens.
- Recorded Audio currently routes into editing.
- Expense card pushes expense summary.
- Utility toolbar actions push edit, photos and share where linked; capture controls represent future/add-item behavior.
- Content scrolls behind the reserved footer region but cannot be obscured by toolbar.

## 7.17 New Trip

Route: `/card/new`, launched from central FAB.

Elements:

1. Header with back arrow, centered `New Trip`, and green `Done` text action.
2. Large square cover media area:
   - card surface;
   - centered camera glyph;
   - helper `Add a cover photo`.
3. Editor card attached immediately beneath media:
   - large `Trip title` placeholder;
   - top-right mood/emotion control;
   - multiline placeholder `Write about this trip...`;
   - centered bold date `July 24, 2025`.
4. Tag chips below editor: `Location`, `People`.
5. Fixed seven-action editor toolbar:
   - enhance;
   - text format selected;
   - photo;
   - camera;
   - microphone;
   - send/share;
   - add.

Behavior:

- Editor scrolls when content grows or keyboard appears.
- Location and People chips push selection screens.
- Mood action pushes emotion selection.
- Done returns to prior context once editing is complete.
- Toolbar remains physically attached to the bottom or keyboard boundary.

## 7.18 Edit Existing Trip

Route: `/trip/[id]/edit`.

Layout:

- Same component system and toolbar as New Trip.
- Header title identifies existing trip.
- Media area displays existing image rather than empty cover placeholder.
- Title and body begin with current memory content.
- Mood and chips remain editable.

Behavior:

- Designed as editing the existing record rather than creating a new one.
- Done reverses to the detail page.

## 7.19 Trip Photos

Route: `/trip/[id]/media`.

Elements:

- Centered pushed header `Trip Photos`.
- Subtitle: trip title and number of photos.
- Large rounded hero photo.
- Horizontal row of three smaller rounded thumbnails below.

Behavior:

- Back returns to trip detail.
- Future interaction can swap hero photo when thumbnail is selected.

## 7.20 Trip Locations

Routes:

- `/trip/[id]/location` when tagging a trip.
- `/expenses/location` when tagging an expense; this reuses the same visual selection screen and returns to Add Expense.

Elements:

- Pushed header `Locations` with right-side `Cancel` action.
- Compact rounded search input with search glyph, `Search` text and clear icon.
- Selection rows:
  - `Chengdu, China`, Day 1.
  - `Tianfu Airport`, Day 2.
  - `Panda Research Base`, Day 2.
- Fine dividers between rows.

Behavior:

- Selecting a location or cancelling returns to the preceding editor/detail/expense screen.

## 7.21 Trip Mood Picker

Route: `/trip/[id]/mood`.

Elements:

- Pushed header `Choose Emotion`.
- Centered surface card with prompt `How did this moment feel?`
- Five tall option rows with large mood symbol and label:
  - Overjoyed.
  - Happy.
  - Neutral.
  - Sad.
  - Depressed.

Behavior:

- Selecting any mood returns to the editor and updates its visible mood control.

## 7.22 Trip People

Route: `/trip/[id]/people`.

Elements:

- Header `People`.
- Heading `Share this memory with`.
- Rounded selection-list card.
- Each row has:
  - circular initial avatar;
  - person name;
  - selected check-circle or unselected ring.
- Bottom full-width primary button reading dynamically, e.g. `Add 2 people`.

Behavior:

- Rows toggle multiple selections in place.
- Primary button confirms selections for the trip.

## 7.23 Share Trip

Route: `/trip/[id]/share`.

Elements:

- Pushed header `Share Trip`.
- Centered surface card:
  - large send/paper-plane icon in accent color;
  - title `Trip to Chengdu`;
  - short explanation of sharing journal, photos and highlights;
  - three divided action rows:
    - Copy Link.
    - Share as Story.
    - Invite Collaborators.

Behavior:

- Invite Collaborators pushes People selection.
- Other options can be prototype actions without adding new screens.

## 7.24 Expenses: Breakdown

Routes and variants:

- `/expenses` opens the breakdown with Category selected by default.
- `/expenses/category` opens the same component with Category selected.
- `/expenses/people` opens the same component with People selected.

Purpose:

- Summarize a trip’s costs and allow analysis by grouping.

Elements:

1. Header:
   - back arrow;
   - centered `Chengdu Trip`;
   - circular plus action for new expense.
2. Section title `Summary`.
3. Summary chart card:
   - donut chart;
   - colored category legend;
   - total amount in lower-right area.
4. Three filter chips:
   - Dates;
   - Category;
   - People.
   - Selected chip uses accent green surface.
5. Section title `Expenditure`.
6. Large list surface card whose rows change based on filter:
   - category mode rows have colored category icon, title, secondary description, amount and chevron;
   - people mode rows display person and shared-expense count;
   - dates mode rows display Day and date.
7. Category mode adds centered `+ Add Category` row at the bottom.

Behavior:

- Selecting a filter updates rows without changing screens.
- Dates rows push Day Expense.
- Plus and Add Category push Add Expense.
- Category and People entry routes may reopen the same layout preselected to their corresponding filter.

## 7.25 Add Expense

Route: `/expenses/new`.

Elements:

1. Header `Add an expense` with `Cancel` back context and green `Done` action.
2. Centered date display.
3. Media row:
   - existing/empty receipt thumbnail;
   - adjacent rounded add-photo square with large plus.
4. Label `Expense name`.
5. First underlined input row containing currency selector text and name field.
6. Second underlined input row containing currency mark and numerical amount.
7. Bottom-aligned contextual actions:
   - chips `Categories` and `People`;
   - full-row `Tag Location` action with location glyph and chevron.

Behavior:

- Keyboard avoids important input rows.
- Done replaces back into expense breakdown.
- Category and People open breakdown/filter selection views.
- Location pushes reused Location selection.

## 7.26 Expense Day

Route: `/expenses/day`.

Elements:

- Header `Day 1` and overflow icon.
- Very large centered total amount.
- Expense rows separated by hairlines:
  - title;
  - amount;
  - right-aligned `View Receipt` action.

Behavior:

- Tapping View Receipt pushes receipt detail.

## 7.27 Receipt

Route: `/expenses/receipt`.

Elements:

- Pushed header `Receipt`.
- Rounded surface card:
  - expense title, e.g. `Hotel to Panda`;
  - date and category metadata;
  - tall rounded photographic receipt preview;
  - right-aligned bold total.

## 7.28 Search Categories

Route: `/search`.

Elements:

1. Top search row:
   - auto-focused rounded search field on left;
   - search icon, editable query and conditional clear button;
   - blue/accent `Cancel` action at right.
2. Heading `Categories`.
3. Divided category rows:
   - Photos.
   - Recorded Audio.
   - Text Only.
   - Location.
   - Saved.
   - People.
   - Emotion.
4. Each row contains semantic icon, label and trailing chevron.

Behavior:

- Typing exposes clear action.
- Cancel reverses to previous screen.
- Selecting category pushes category-specific Search Results.

## 7.29 Search Results

Route: `/search/[category]`.

Elements:

- Search-style header:
  - back chevron;
  - rounded field showing selected category as query;
  - Cancel returning to Home.
- Large selected category heading.
- Results list of rounded cards with title and secondary metadata.

Variant: Map-based categories:

- Categories `Location`, `Saved`, and `People` additionally show a large rounded abstract map above result cards.
- Map contains road line and positioned accent pin controls.
- Selecting pin or result card pushes Trip Detail.

## 7.30 Settings Hub

Route: `/settings`, entered from Profile gear.

Elements:

1. Centered header `Settings`.
2. Stack of settings-row cards:
   - Notifications.
   - Personal Information.
   - Language, showing `English (EN)` detail.
   - Dark Mode with active/inactive toggle.
   - Use System Appearance with On/Off detail.
   - Submit Feedback.
3. Section heading `Security & Privacy`.
4. Rows:
   - Security.
   - Help Center.
5. Section heading `Danger Zone`.
6. Danger-styled `Close Account` row.
7. Section heading `Log Out`.
8. `Log Out` row.
9. Centered app version and rights footer below scrolling content.

Behavior:

- Dark Mode toggle performs a manual theme override.
- Use System Appearance returns control to the iPhone appearance setting.
- Settings changes immediately recolor all visible app surfaces and semantic icons.
- Log Out replaces route with Sign In.

## 7.31 Edit Profile / Personal Information

Route: `/settings/profile`.

Elements:

1. Header `Edit Profile`.
2. Large centered circular avatar on green field.
3. Centered text action `Change Profile Picture`.
4. Form fields with left icon, value/placeholder and right edit pencil:
   - Username.
   - Password masked and read-only appearance.
   - Date of Birth.
   - Email.
   - Phone.
   - Gender.
   - Location.
5. `Personal Bio` label plus multiline card with `current length / 100` counter at lower right.
6. `Profile Banner` upload card:
   - upload/share glyph;
   - `Click to upload`;
   - allowed file formats and maximum size note.
7. Full-width `Save Settings` button with check icon.

Behavior:

- Saving writes changes back into Profile and returns to prior page.
- Form scrolls and uses keyboard avoidance.

## 7.32 Notifications

Route: `/settings/notifications`.

Elements:

- Header `Notifications`.
- Explanatory line about choosing alerts.
- Three settings rows with description and independent toggle:
  - Trip reminders.
  - Expense updates.
  - Memory highlights.
- Full-width `Save Settings` button.

## 7.33 Security

Route: `/settings/security`.

Elements:

- Header `Security`.
- Settings rows:
  - `2FA` with explanatory description.
  - `Face ID` with description and active toggle.
  - `View Logged-in Devices` as navigation row.
- Full-width `Save Settings` button.

## 7.34 Language

Route: `/settings/language`.

Elements:

- Header `Language`.
- Single surface card containing five rows:
  - English (EN).
  - Simplified Chinese (ZH).
  - Espanol (ES).
  - Francais (FR).
  - Japanese (JA).
- Right radio state per row, one selected at a time.
- Full-width `Save Settings` button.

## 7.35 Submit Feedback

Route: `/settings/feedback`.

Elements:

- Header `Send Feedback`.
- Supporting message asking how to improve JourneyCraft.
- Subject form field with speech/comment icon.
- Message label and large multiline input card.
- Primary `Submit Feedback` button with send glyph.

Behavior:

- Keyboard-safe scrolling.

## 7.36 Help Center

Route: `/settings/help`.

Elements:

- Header `Help Center`.
- Three descriptive settings rows:
  - FAQs.
  - Guides & Tutorials.
  - Support.
- Centered support footnote below rows with underlined email link.

## 7.37 FAQs

Route: `/settings/help/faq`.

Elements:

- Header `FAQs`.
- Scrollable stack of surface cards.
- Each card contains bold question and readable answer paragraph:
  - creating a new trip;
  - sharing expenses;
  - saved memories;
  - notification settings.

## 7.38 Guides And Tutorials

Route: `/settings/help/tutorial`.

Elements:

- Header `Guides & Tutorials`.
- Three horizontal step cards:
  - numbered circular badge;
  - feature icon;
  - bold step name;
  - short teaching sentence.
- Steps describe Create a trip, Plan days, and Track expenses.

## 7.39 Support

Route: `/settings/help/support`.

Elements:

- Header `Support`.
- Centered support surface card with:
  - large circular muted icon area containing headset icon;
  - heading `We are here to help`;
  - service-hours/email explanatory text;
  - full-width `Contact Support` primary button.

## 8. Prototype Navigation Map

Build prototype connections as follows:

```text
Splash -> Sign In

Sign In <-> Sign Up
Sign In -> Forgot Password
Sign In/Sign Up success -> Home

Bottom Navigation:
Home <-> Map <-> Statistics <-> Profile
Central FAB -> New Trip

Home -> Search -> Search Results -> Trip Detail
Home -> Calendar -> Home
Home card -> Trip Detail
Home card overflow -> Card Menu -> Delete Confirmation

Map -> Search
Map preview -> Trip Detail

Statistics -> Statistics Summary -> Expenses

Profile -> Edit Profile
Profile -> Settings
Profile expanded cover -> Change Cover -> Crop Overlay -> Profile

Trip Detail -> Trip Photos
Trip Detail -> Trip Locations
Trip Detail -> Trip People
Trip Detail -> Edit Trip
Trip Detail -> Share Trip -> Trip People
Trip Detail -> Expenses

New/Edit Trip -> Mood Picker
New/Edit Trip -> Trip Locations
New/Edit Trip -> Trip People

Expenses -> Add Expense
Expenses -> Expense Day -> Receipt
Add Expense -> Categories / People / Location

Settings -> Notifications / Personal Information / Language / Feedback / Security / Help Center
Help Center -> FAQs / Guides & Tutorials / Support
Settings Log Out -> Sign In
```

## 9. Figma File Structure Recommendation

Create pages or top-level sections in this order:

1. `00 Foundations`
   - light/dark variables;
   - typography;
   - spacing, radius, elevation;
   - icon style guidance.
2. `01 Components`
   - headers;
   - bottom navigation and FAB;
   - trip utility toolbar;
   - cards;
   - buttons, chips and segmented controls;
   - settings rows;
   - form fields;
   - menus, dialogs and picker/dropdown overlays;
   - chart/map primitives.
3. `02 Authentication`
   - splash, log in, sign up, forgot password;
   - date/gender/dropdown/autocomplete overlays.
4. `03 Primary Tabs - Dark`
   - Home, Home Planned, Calendar, Map, Statistics Monthly, Statistics Annual, Profile.
5. `04 Primary Tabs - Light`
   - corresponding key tab states to validate theme.
6. `05 Trip Workflow`
   - detail, new, edit, photos, locations, mood, people, share.
7. `06 Expenses And Search`
   - expense variants, add, day, receipt, search states/results.
8. `07 Settings And Help`
   - settings hub and every settings/help route.
9. `08 Overlays And Prototype States`
   - sort menu, card menu, delete confirmation, period picker, expanded profile cover, crop tool, keyboard-attached editor toolbar.

## 10. Figma Make Build Instruction

Use this application specification to create a complete iPhone 13 mobile design file for JourneyCraft. Do not create a marketing landing page. Begin with reusable variables and components, then assemble the operational app screens.

Critical requirements:

- Use `390 x 844` frames as the primary layout target.
- Build both light and dark themes using variables, with dark signed-in screens as the principal presentation set.
- Keep imagery real and inspectable: travel photos, cover memories, gallery mosaics and receipt imagery must be visually present.
- Build persistent bottom navigation exactly as a bottom-attached, safe-area-filled bar with a central curved notch and a raised circular green plus button.
- Build the separate trip utility toolbar as a full-bottom surface extending beneath the iPhone home indicator.
- Use auto layout and component variants for tabs, chips, cards, settings rows, form fields, toggles, icon buttons, menu overlays and modal dialogs.
- Keep all page content above fixed bottom bars with sufficient bottom padding.
- Represent pushed navigation, modal overlays, anchored menus, inline period expansion, keyboard-safe editor behavior, profile cover stretching and crop overlay in prototype links or variant screens.
- Use one coherent semantic icon family for signed-in tools, matching the simple rounded bottom-navigation style.
- Ensure no dark-mode icon contains a visible white rectangle or mismatched asset background.

The resulting design should communicate that JourneyCraft is a refined, personal travel journal: memories are visually central, practical organization is readily accessible, and adding a new trip is always one prominent action away.
