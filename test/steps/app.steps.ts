import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { setupDefault } from './harness'

const { Given, Then } = createBdd()

Given('I open the app', async ({ page }) => {
  await setupDefault(page)
})

Then('I see the title {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(title)
})
