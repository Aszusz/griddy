import type { Page } from '@playwright/test'
import type { StoreConfig, RootState } from '../../src/store'

// Wait for test harness to be available
async function waitForHarness(page: Page) {
  await page.waitForFunction(() => window.__TEST_HARNESS__ !== undefined, {
    timeout: 5000,
  })
}

// Navigate and configure in one step - app waits until ready() is called
export async function setupWithState(page: Page, config: StoreConfig) {
  await page.goto('/')
  await waitForHarness(page)
  await page.evaluate((c) => {
    window.__TEST_HARNESS__?.configure(c)
    window.__TEST_HARNESS__?.ready()
  }, config)
}

// For tests that don't need custom state
export async function setupDefault(page: Page) {
  await page.goto('/')
  await waitForHarness(page)
  await page.evaluate(() => {
    window.__TEST_HARNESS__?.ready()
  })
}

export async function getState(page: Page): Promise<RootState | undefined> {
  return page.evaluate(() => window.__TEST_HARNESS__?.getState())
}
