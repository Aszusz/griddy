import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './theme.testIds'

const { Given, When, Then } = createBdd()

// OS preference emulation
Given('the OS prefers dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
})

Given('the OS prefers light mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
})

// Theme switching
When('I set the theme to {string}', async ({ page }, theme: string) => {
  await page.getByTestId(testIds.mainMenuTrigger).click({ force: true })
  await page.getByTestId(testIds.themeSubmenu).click()

  const themeMap: Record<string, string> = {
    Light: testIds.themeLight,
    Dark: testIds.themeDark,
    System: testIds.themeSystem,
  }
  await page.getByTestId(themeMap[theme]).click()
})

// Theme assertions - check for dark class on html element
Then('the app displays in dark mode', async ({ page }) => {
  await expect(page.locator('html')).toHaveClass(/dark/)
})

Then('the app displays in light mode', async ({ page }) => {
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

// Reload - reuse existing step from file-save-load.steps.ts
// When('I reload the app', ...) is already defined there
