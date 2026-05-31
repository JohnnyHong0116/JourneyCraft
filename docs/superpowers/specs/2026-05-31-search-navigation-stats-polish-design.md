# Search, Navigation, and Statistics Polish

## Scope

- Modernize Search without removing existing filters or result behaviors.
- Preserve Search origin so Map Search returns to Map and Home Search returns to Home.
- Restore native push/pop transition direction by removing the forced global slide direction and using back navigation for returns.
- Tighten monthly Countries/Cities typography, restrict expense drawer resizing to its top region, and simplify annual Mood Flow labels.

## Search

Search uses a fixed themed chrome area above independently scrolling content. The index groups the existing filters in a quiet surface; category screens keep their category-specific controls and results below the fixed search chrome.

## Navigation

Search routes carry `origin: home | map`. Nested routes forward the origin. Cancel from Search returns to that origin. Ordinary returns use `router.back()` so native stacks animate in the correct reverse direction.

## Statistics

The Countries/Cities card uses smaller type and denser spacing. Expense drawer pan handlers live only on the handle/header region, leaving list scrolling independent. Annual Mood Flow keeps icon semantics and removes legend words.

