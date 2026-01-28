import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds as canvasTestIds } from './draw-rectangles.testIds'
import { getState } from './harness'

const { When, Then } = createBdd()

Then('grid dots fill the entire viewport', async ({ page }) => {
  const viewportSize = page.viewportSize()
  if (!viewportSize) throw new Error('No viewport size')

  const canvas = page.getByTestId(canvasTestIds.canvas)

  // Wait for canvas to resize (ResizeObserver is async)
  await expect
    .poll(async () => {
      const box = await canvas.boundingBox()
      return box ? { width: box.width, height: box.height } : null
    })
    .toEqual({ width: viewportSize.width, height: viewportSize.height })
})

When('the viewport is resized', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
})

Then('the origin crosshair is at viewport center', async ({ page }) => {
  const viewportSize = page.viewportSize()
  if (!viewportSize) throw new Error('No viewport size')

  // Wait for ResizeObserver to update state
  await page.waitForFunction(
    (expected) => {
      const state = window.__TEST_HARNESS__?.getState()
      return state?.app.viewport.originX === expected
    },
    viewportSize.width / 2,
    { timeout: 5000 }
  )

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
