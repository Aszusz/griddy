# TDD Red Phase

Implement step definitions so all tests fail for the right reason.

## Phase 1: Context

1. Read `docs/tmp/SPEC.yml` - if missing, run `/bdd-discover` first
2. Read `docs/TESTING.md` and `test/steps/*.ts` for patterns

## Phase 2: Find Missing Steps

Run tests, parse "Missing step definitions" section.
If none missing, skip to Phase 4.

## Phase 3: Implement Steps

For each missing step:

1. Choose assertion strategy:
   - **DOM testing** (default): Add testIds, query elements
   - **State testing**: Use `getState()` for non-DOM-testable features (e.g., Canvas 2D). Don't create ghost DOM elements just to satisfy tests.
2. Implement step definitions using patterns from TESTING.md

## Phase 4: Verify Red State

Run tests. Success = all tests fail with locator errors (not missing steps).

Output: steps implemented, test result.
