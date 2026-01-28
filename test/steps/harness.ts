import type { Page } from '@playwright/test'
import type { StoreConfig, RootState } from '../../src/store'
import { LOCALSTORAGE_KEY } from '../../src/constants'

const DEFAULT_READY_ELEMENT = 'canvas'

// Wait for test harness to be available
async function waitForHarness(page: Page) {
  await page.waitForFunction(() => window.__TEST_HARNESS__ !== undefined, {
    timeout: 5000,
  })
}

// Navigate and configure in one step - app waits until ready() is called
export async function setupWithState(
  page: Page,
  config: StoreConfig,
  waitForTestId = DEFAULT_READY_ELEMENT
) {
  await page.goto('/')
  await waitForHarness(page)
  // Clear localStorage to avoid interference from previous tests
  await page.evaluate((key) => localStorage.removeItem(key), LOCALSTORAGE_KEY)
  await page.evaluate((c) => {
    window.__TEST_HARNESS__?.configure(c)
    window.__TEST_HARNESS__?.ready()
  }, config)
  if (waitForTestId) {
    await page.getByTestId(waitForTestId).waitFor({ state: 'visible' })
  }
}

// For tests that don't need custom state
export async function setupDefault(
  page: Page,
  waitForTestId = DEFAULT_READY_ELEMENT
) {
  await page.goto('/')
  await waitForHarness(page)
  // Clear localStorage to avoid interference from previous tests
  await page.evaluate((key) => localStorage.removeItem(key), LOCALSTORAGE_KEY)
  await page.evaluate(() => {
    window.__TEST_HARNESS__?.ready()
  })
  if (waitForTestId) {
    await page.getByTestId(waitForTestId).waitFor({ state: 'visible' })
  }
}

// Navigate to any URL (including with hash), wait for harness, call ready
// Optionally wait for a specific element to be visible before returning
// NOTE: This does NOT clear localStorage - use for tests that need localStorage
export async function setupWithUrl(
  page: Page,
  url: string,
  waitForTestId?: string
) {
  await page.goto(url)
  await waitForHarness(page)
  await page.evaluate(() => {
    window.__TEST_HARNESS__?.ready()
  })
  if (waitForTestId) {
    await page.getByTestId(waitForTestId).waitFor({ state: 'visible' })
  }
}

// For tests that need localStorage to persist (e.g., reload tests)
// Does NOT clear localStorage before ready()
export async function setupPreservingLocalStorage(
  page: Page,
  waitForTestId = DEFAULT_READY_ELEMENT
) {
  await page.goto('/')
  await waitForHarness(page)
  // Intentionally NOT clearing localStorage
  await page.evaluate(() => {
    window.__TEST_HARNESS__?.ready()
  })
  if (waitForTestId) {
    await page.getByTestId(waitForTestId).waitFor({ state: 'visible' })
  }
}

export async function getState(page: Page): Promise<RootState> {
  return page.evaluate(() => window.__TEST_HARNESS__!.getState())
}

export async function focusCanvas(page: Page) {
  await page.getByTestId('canvas').focus()
}
