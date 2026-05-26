# Home Search And Emotion Consistency Design

## Scope

This change addresses only Home card emotion presentation, search launched from Home, and screens that display or select the same emotion taxonomy. The `UI/` reference directory remains read-only.

## Canonical Emotions

The Figma-exported card and emotion reference assets use five colored circular face icons already present in `src/assets/icons`: `overjoyed`, `happy`, `neutral`, `sad`, and `depressed`. These IDs are the canonical stored values for `Trip.mood`; the icon asset includes its intended circular colored face, while callers must not add a square background behind it.

A shared emotion configuration exposes each ID, user-facing label, icon name, color, and search keywords. Home cards, Home calendar, card create/edit presentation, mood selection, search, and statistics consume that configuration instead of defining alternate character arrays or category labels.

## Home Card Presentation

`TripCard` retains its footer spacing and icon size while removing only the `cardMuted` square container treatment around its mood icon. The circular SVG face remains visible as the designed emotion representation.

## Search Data Flow

Home passes its active timeline mode (`visited` or `planned`) when opening search. Search chooses exactly one backing collection for the session:

- `visited`: `mockTrips`
- `planned`: `plannedTripCards`

Search operates on `Trip` records keyed by their existing stable `id`. A pure search model resolves the timeline dataset and filters it by category:

- Text: match query against title, location, date text, companions, and canonical mood labels/keywords.
- Photos: include only records with one or more attached `photos`; if a query is supplied, match available visible metadata without implying image recognition.
- Emotion: include only records whose `mood` equals the selected canonical emotion ID.
- Date: match the ISO/display date and its formatted visible date form.

Existing secondary categories remain real-data filters where their fields already exist (`audioCount`, `isSaved`, companions, or location); they do not get speculative data features.

## Search Presentation

The search landing screen carries the timeline mode to category navigation and adds a date category. Results accept a query; photos display a thumbnail plus photo count; emotions provide the five canonical choices and render the matching face/label on results; date results emphasize the display date. Empty results use the existing themed surface/text language.

## Validation

Pure tests cover canonical emotion uniqueness, active-mode dataset selection, photo filtering, emotion filtering, text filtering, and date filtering. TypeScript compilation checks screen integration. A final git status inspection confirms `UI/` was neither modified nor staged.
