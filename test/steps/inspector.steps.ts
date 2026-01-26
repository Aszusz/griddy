import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './inspector.testIds'
import { getState } from './harness'

const { When, Then } = createBdd()

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

// Editable fields - When steps

When('I set Inspector X to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.xInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector Y to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.yInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector W to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.widthInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector H to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.heightInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector fill to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.fillInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector stroke to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.strokeInput)
  await input.fill(value)
  await input.blur()
})

When(
  'I type {string} in Inspector X and press Enter',
  async ({ page }, value: string) => {
    const input = page.getByTestId(testIds.xInput)
    await input.fill(value)
    await input.press('Enter')
  }
)

When('I focus Inspector X field', async ({ page }) => {
  await page.getByTestId(testIds.xInput).focus()
})

When('I press Tab', async ({ page }) => {
  await page.keyboard.press('Tab')
})

// Editable fields - Then steps

Then(
  'the rectangle is at position \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const state = await getState(page)
    const rect = state.app.shapes[0]
    expect(rect.x).toBe(x)
    expect(rect.y).toBe(y)
  }
)

Then(
  'the rectangle has size \\({int}, {int})',
  async ({ page }, w: number, h: number) => {
    const state = await getState(page)
    const rect = state.app.shapes[0]
    expect(rect.width).toBe(w)
    expect(rect.height).toBe(h)
  }
)

Then(
  'the rectangle has fill color {string}',
  async ({ page }, color: string) => {
    const state = await getState(page)
    const rect = state.app.shapes[0]
    expect(rect.fill).toBe(color)
  }
)

Then(
  'the rectangle has stroke color {string}',
  async ({ page }, color: string) => {
    const state = await getState(page)
    const rect = state.app.shapes[0]
    expect(rect.stroke).toBe(color)
  }
)

Then('Inspector Y field is focused', async ({ page }) => {
  await expect(page.getByTestId(testIds.yInput)).toBeFocused()
})
