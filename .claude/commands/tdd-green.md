# TDD Green Phase

Make failing tests pass. Simplest implementation that works.

## Phase 1: Context

1. Read `docs/tmp/SPEC.yml` for requirements (may include non-functional constraints tests don't capture)
2. Run tests. Read error output - what's missing or broken?

## Phase 2: Implement

For each failing test:

1. Find relevant source files in `src/`
2. Add minimal code to make test pass
3. Use testIds from `test/steps/*.testIds.ts` for `data-testid` attrs

**Rules:**

- No abstractions, no future-proofing
- Do not stop coding until all tests pass
- No refactoring in this phase

## Phase 3: Verify Green

Run format/lint/tests. All tests should pass.

If not green, fix and repeat. Don't refactor yet.

Output: what was implemented, test result.
