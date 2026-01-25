# Testing

This project uses **Playwright-BDD** for E2E testing with Gherkin syntax.

## File Locations

| Type             | Location                                   |
| ---------------- | ------------------------------------------ |
| Feature files    | `_features/*.feature`                      |
| Step definitions | `test/steps/*.steps.ts`                    |
| Test ID files    | `test/steps/*.testIds.ts`                  |
| Test harness     | `test/steps/harness.ts`                    |
| Generated tests  | `test/.gen/` (auto-generated, do not edit) |
| Test reports     | `test/report/` (HTML)                      |
| Test artifacts   | `test/results/`                            |

## Commands

```bash
npm run test      # Run all BDD tests
npm run test:ui   # Run tests in Playwright UI mode
```

Tests run against the Vite dev server at `http://localhost:5173` (auto-started unless in CI).

## Step Definition Pattern

Step definitions use `playwright-bdd`:

```typescript
// test/steps/feature.steps.ts
import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './feature.testIds'

const { Given, When, Then } = createBdd()

export { testIds }

Given('some precondition', async ({ page }) => {
  await page.goto('/')
})

When('some action', async ({ page }) => {
  await page.getByTestId(testIds.button).click()
})

Then('some outcome', async ({ page }) => {
  await expect(page.getByTestId(testIds.value)).toHaveText('expected')
})
```

## Test ID Architecture

**Tests own the test IDs.** Test IDs live in separate `*.testIds.ts` files (no Node.js dependencies), which both step definitions and frontend code import.

```typescript
// test/steps/counter.testIds.ts (pure JS, no Node deps)
export const testIds = {
  value: 'counter-value',
  incrementButton: 'counter-increment-button',
}

// test/steps/counter.steps.ts
import { testIds } from './counter.testIds'
export { testIds }

// src/App.tsx
import { testIds } from '../test/steps/counter.testIds'
<div data-testid={testIds.value}>{count}</div>
```

**Why separate files?** Step definition files import `playwright-bdd` (Node.js). Frontend code can't import Node.js modules. The `*.testIds.ts` files have no dependencies, so both can import them.

### Naming Convention

Test IDs follow the pattern: `{feature}-{element}-{type}`

Examples:

- `counter-value`
- `counter-increment-button`
- `login-email-input`
- `login-submit-button`

## Test Harness

The test harness (`test/steps/harness.ts`, `src/testHarness.ts`) allows tests to set initial state, mock effects, and read state directly via `window.__TEST_HARNESS__`.

**Prefer pure UI tests.** Only use the harness when UI-only testing is impractical (e.g., controlling randomness, avoiding slow timers, asserting internal state not reflected in UI).

## Element Selection

Always use `getByTestId()` for element selection in step definitions:

```typescript
// Good
await page.getByTestId(testIds.submitButton).click()

// Avoid - brittle selectors
await page.click('button.submit')
await page.locator('text=Submit').click()
```
