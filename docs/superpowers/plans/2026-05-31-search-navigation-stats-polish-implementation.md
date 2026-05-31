# Search, Navigation, and Statistics Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine Search, return navigation, and Statistics interactions while preserving existing functionality.

**Architecture:** Add a small Search-origin model, keep UI changes scoped to Search routes, remove the forced root transition override, and narrow the existing drawer gesture attachment point.

**Tech Stack:** Expo Router, React Native, TypeScript, Node test runner.

---

### Task 1: Search Origin

- [ ] Add origin resolution and return-target helpers with failing tests.
- [ ] Pass origin from Home and Map into nested Search routes.
- [ ] Use origin-aware dismiss navigation for Search cancellation.

### Task 2: Search UI

- [ ] Keep Search chrome fixed outside scrolling content.
- [ ] Restyle the index as a grouped themed filter surface.
- [ ] Keep category controls and results scrollable beneath the fixed header.

### Task 3: Navigation And Statistics

- [ ] Remove the forced global stack slide direction and use back navigation for calendar return.
- [ ] Restrict drawer resizing to the top drag region.
- [ ] Tighten Countries/Cities typography and remove annual Mood Flow legend words.

### Task 4: Verification

- [ ] Run model tests, TypeScript, diff checks, and an iOS Expo bundle request.

