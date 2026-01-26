import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds as canvasTestIds } from './draw-rectangles.testIds'
import { getState } from './harness'

const { When, Then } = createBdd()

Then('grid dots fill the entire viewport', async ({ page }) => {
  const viewportSize = page.viewportSize()
  if (!viewportSize) throw new Error('No viewport size')

  const canvas = page.getByTestId(canvasTestIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')

  // Canvas should fill viewport
  expect(box.width).toBe(viewportSize.width)
  expect(box.height).toBe(viewportSize.height)
})

When('the viewport is resized', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
})

Then('the origin crosshair is at viewport center', async ({ page }) => {
  const viewportSize = page.viewportSize()
  if (!viewportSize) throw new Error('No viewport size')

  const state = await getState(page)
  expect(state?.app.viewport.originX).toBe(viewportSize.width / 2)
  expect(state?.app.viewport.originY).toBe(viewportSize.height / 2)
})

Then(
  'grid dots are spaced {int} pixels apart from origin',
  async ({ page }, spacing: number) => {
    const state = await getState(page)
    expect(state?.app.viewport.gridSize).toBe(spacing)
  }
)
