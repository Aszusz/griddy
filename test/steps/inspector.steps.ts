import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './inspector.testIds'

const { Then } = createBdd()

Then('the Inspector panel is hidden', async ({ page }) => {
  await expect(page.getByTestId(testIds.panel)).toBeHidden()
})

Then('the Inspector panel is visible', async ({ page }) => {
  await expect(page.getByTestId(testIds.panel)).toBeVisible()
})

Then('the Inspector title is {string}', async ({ page }, title: string) => {
  await expect(page.getByTestId(testIds.title)).toHaveText(title)
})

Then('the Inspector shows X as {int}', async ({ page }, value: number) => {
  await expect(page.getByTestId(testIds.x)).toHaveText(String(value))
})

Then('the Inspector shows Y as {int}', async ({ page }, value: number) => {
  await expect(page.getByTestId(testIds.y)).toHaveText(String(value))
})

Then('the Inspector shows W as {int}', async ({ page }, value: number) => {
  await expect(page.getByTestId(testIds.width)).toHaveText(String(value))
})

Then('the Inspector shows H as {int}', async ({ page }, value: number) => {
  await expect(page.getByTestId(testIds.height)).toHaveText(String(value))
})

Then('the Inspector shows fill color', async ({ page }) => {
  await expect(page.getByTestId(testIds.fill)).toBeVisible()
})

Then('the Inspector shows stroke color', async ({ page }) => {
  await expect(page.getByTestId(testIds.stroke)).toBeVisible()
})

Then('the Inspector shows {string}', async ({ page }, text: string) => {
  await expect(page.getByTestId(testIds.multiSelectLabel)).toHaveText(text)
})

Then(
  'the Inspector shows fill as {string}',
  async ({ page }, color: string) => {
    await expect(page.getByTestId(testIds.fill)).toHaveText(color)
  }
)

Then(
  'the Inspector shows stroke as {string}',
  async ({ page }, color: string) => {
    await expect(page.getByTestId(testIds.stroke)).toHaveText(color)
  }
)
