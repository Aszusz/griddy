import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, Then } = createBdd()

Given('I open the app', async ({ page }) => {
  await page.goto('/')
})

Then('I see the title {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(title)
})
