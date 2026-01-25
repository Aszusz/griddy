# Testing

This project uses **Playwright-BDD** for E2E testing with Gherkin syntax.

## File Locations

| Type             | Location                                   |
| ---------------- | ------------------------------------------ |
| Feature files    | `_features/*.feature`                      |
| Step definitions | `test/steps/*.steps.ts`                    |
| Test ID files    | `test/steps/*.testIds.ts`                  |
| Generated tests  | `test/.gen/` (auto-generated, do not edit) |

## Commands

```bash
npm run test      # Run all BDD tests
npm run test:ui   # Run tests in Playwright UI mode
```

Tests run against the Vite dev server at `http://localhost:5173` (auto-started unless in CI).

## Feature File Syntax

Standard Gherkin with Background, Scenario, and Scenario Outline support:

```gherkin
Feature: Shopping Cart

  Background:
    Given user is logged in

  Scenario: Add item to cart
    When user adds "Widget" to cart
    Then cart contains 1 item

  Scenario Outline: Quantity limits
    When user sets quantity to <qty>
    Then user sees "<result>"

    Examples:
      | qty | result         |
      | 0   | Minimum is 1   |
      | 99  | Maximum is 50  |
```

## Step Definitions & Test IDs

**Tests own the test IDs.** Test IDs live in `*.testIds.ts` files (no Node.js deps), imported by both step definitions and frontend code.

```typescript
// test/steps/counter.testIds.ts
export const testIds = {
  value: 'counter-value',
  incrementButton: 'counter-increment-button',
}

// test/steps/counter.steps.ts
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './counter.testIds'

const { Given, When, Then } = createBdd()

Given('the counter is at {int}', async ({ page }, initial: number) => {
  await page.goto(`/?count=${initial}`)
})

When('user clicks increment', async ({ page }) => {
  await page.getByTestId(testIds.incrementButton).click()
})

Then('counter shows {int}', async ({ page }, expected: number) => {
  await expect(page.getByTestId(testIds.value)).toHaveText(String(expected))
})

// src/App.tsx
import { testIds } from '../test/steps/counter.testIds'
<div data-testid={testIds.value}>{count}</div>
```

**Why separate testIds files?** Step definitions import `playwright-bdd` (Node.js). Frontend can't import Node.js modules.

**Test ID naming:** `{feature}-{element}` or `{feature}-{element}-{type}`

## Test Harness

The test harness (`test/steps/harness.ts`, `src/testHarness.ts`) allows tests to set initial state, mock effects, and read state directly via `window.__TEST_HARNESS__`.

**Prefer pure UI tests.** Only use the harness when UI-only testing is impractical (e.g., controlling randomness, avoiding slow timers, asserting internal state not reflected in UI).

