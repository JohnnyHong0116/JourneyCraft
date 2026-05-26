# Calendar Range And Photo-less Card Design

## Goal

Improve the visited calendar range interaction and home card cleanliness without changing existing trip data, mood persistence, or date-range selection behavior.

## Calendar Range Selection

The visited calendar keeps its current first-tap/second-tap range selection model. A single selected day retains the current selected-day treatment. When two different days define a range, both endpoints use a stronger green selected surface and the dates between them use a softer tinted surface. This creates a clear start/interior/end hierarchy while leaving daily mood icons and record indicators readable.

Selection presentation is derived in the calendar model as one of `none`, `single`, `rangeStart`, `rangeMiddle`, or `rangeEnd`. The view consumes this state for styling rather than reinterpreting anchors while rendering.

## Mood Editing

Daily mood editing is valid only when exactly one calendar day is selected. For a single-day selection, the existing prompt, mood buttons, current mood display, confirmation alert, and AsyncStorage override logic remain unchanged.

For a multi-day range, the drawer continues to show the date-range label and the cards within the inclusive range, but it omits the daily mood prompt and mood button row. The application does not create or modify mood overrides for a multi-day range.

## Photo-less Cards

A trip card with a cover photo retains its thumbnail and media indicator behavior. A trip card with an empty `photos` array renders no gray cover placeholder and no photo indicator. Its textual summary takes the available width, creating a quieter card rather than communicating missing content as an error state.

## Testing And Verification

Model tests cover single-day selection, multi-day endpoint/interior states, and eligibility for the mood editor. A small card model test covers whether a valid cover photo should render. Verification includes TypeScript, focused tests, the Expo iOS Metro bundle, and visual inspection of the visited calendar and a photo-less Home card in light/dark capable UI.
