import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds as canvasTestIds } from './draw-rectangles.testIds'
import { testIds } from './mouse-position.testIds'
import { modelToBrowser } from './coords'

const { When, Then } = createBdd()

When(
  'I move the mouse to canvas position \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const canvas = page.getByTestId(canvasTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')

    const pos = modelToBrowser(x, y, box)
    await page.mouse.move(pos.x, pos.y)
  }
)

Then(
  'the status bar shows coordinates {string}',
  async ({ page }, expected: string) => {
    await expect(page.getByTestId(testIds.coordinates)).toHaveText(expected)
  }
)

When('I move the mouse outside the canvas', async ({ page }) => {
  // Move mouse outside viewport to trigger document mouseleave
  await page.mouse.move(-10, -10)
})
