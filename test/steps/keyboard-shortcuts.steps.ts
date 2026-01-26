import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { getState, focusCanvas } from './harness'

const { When, Then } = createBdd()

When('I press Delete', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Delete')
})

When('I press Backspace', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Backspace')
})

When('I delete the selection', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Delete')
})

When('I copy the selection', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Meta+c')
})

When('I cut the selection', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Meta+x')
})

When('I paste', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Meta+v')
})

Then(
  'a rectangle exists at position \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const state = await getState(page)
    const found = state.app.shapes.some(
      (shape) => shape.x === x && shape.y === y
    )
    expect(found).toBe(true)
  }
)

Then(
  'the selected shape is at position \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const state = await getState(page)
    const selectedId = state.app.selectedIds[0]
    const shape = state.app.shapes.find((s) => s.id === selectedId)
    expect(shape).toBeDefined()
    expect(shape?.x).toBe(x)
    expect(shape?.y).toBe(y)
  }
)
