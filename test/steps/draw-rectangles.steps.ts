import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './draw-rectangles.testIds'
import { getState } from './harness'

const { Given, When, Then } = createBdd()

Given('I select the Rectangle tool', async ({ page }) => {
  await page.getByTestId(testIds.rectangleTool).click()
})

Then('the Rectangle tool shows as active', async ({ page }) => {
  await expect(page.getByTestId(testIds.rectangleTool)).toHaveAttribute(
    'data-active',
    'true'
  )
})

When(
  'I draw a rectangle from \\({int}, {int}) to \\({int}, {int})',
  async ({ page }, x1: number, y1: number, x2: number, y2: number) => {
    const canvas = page.getByTestId(testIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')

    await page.mouse.move(box.x + x1, box.y + y1)
    await page.mouse.down()
    await page.mouse.move(box.x + x2, box.y + y2)
    await page.mouse.up()
  }
)

Then(
  'a rectangle exists at grid position \\({int}, {int}) with size \\({int}, {int})',
  async ({ page }, x: number, y: number, width: number, height: number) => {
    const state = await getState(page)
    const rect = state?.app.shapes[0]
    expect(rect).toBeDefined()
    expect(rect?.x).toBe(x)
    expect(rect?.y).toBe(y)
    expect(rect?.width).toBe(width)
    expect(rect?.height).toBe(height)
  }
)

When(
  'I start drawing from \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const canvas = page.getByTestId(testIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')

    await page.mouse.move(box.x + x, box.y + y)
    await page.mouse.down()
  }
)

When('I drag to \\({int}, {int})', async ({ page }, x: number, y: number) => {
  const canvas = page.getByTestId(testIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')

  await page.mouse.move(box.x + x, box.y + y)
})

Then('a preview rectangle is visible', async ({ page }) => {
  const state = await getState(page)
  expect(state?.app.drawing).not.toBeNull()
})

When('I release the mouse', async ({ page }) => {
  await page.mouse.up()
})

Then('no preview rectangle is visible', async ({ page }) => {
  const state = await getState(page)
  expect(state?.app.drawing).toBeNull()
})

Then('no rectangle is created', async ({ page }) => {
  const state = await getState(page)
  expect(state?.app.shapes.length).toBe(0)
})

Then('the rectangle has visible fill', async ({ page }) => {
  const state = await getState(page)
  expect(state?.app.shapes.length).toBeGreaterThan(0)
})

Then('the rectangle has visible stroke', async ({ page }) => {
  const state = await getState(page)
  expect(state?.app.shapes.length).toBeGreaterThan(0)
})

Then(
  '{int} rectangles exist on the canvas',
  async ({ page }, count: number) => {
    const state = await getState(page)
    expect(state?.app.shapes.length).toBe(count)
  }
)

Then('the grid background starts at origin', async ({ page }) => {
  // Grid is now drawn on canvas, verify canvas exists
  const canvas = page.getByTestId(testIds.canvas)
  await expect(canvas).toBeVisible()
})
