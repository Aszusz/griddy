import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './draw-rectangles.testIds'

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
    const rect = page.getByTestId(testIds.rectangle)
    await expect(rect).toHaveAttribute('x', String(x))
    await expect(rect).toHaveAttribute('y', String(y))
    await expect(rect).toHaveAttribute('width', String(width))
    await expect(rect).toHaveAttribute('height', String(height))
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
  await expect(page.getByTestId(testIds.previewRectangle)).toBeVisible()
})

When('I release the mouse', async ({ page }) => {
  await page.mouse.up()
})

Then('no preview rectangle is visible', async ({ page }) => {
  await expect(page.getByTestId(testIds.previewRectangle)).not.toBeVisible()
})

Then('no rectangle is created', async ({ page }) => {
  await expect(page.getByTestId(testIds.rectangle)).toHaveCount(0)
})

Then('the rectangle has visible fill', async ({ page }) => {
  const rect = page.getByTestId(testIds.rectangle)
  const fill = await rect.getAttribute('fill')
  expect(fill).toBeTruthy()
  expect(fill).not.toBe('none')
  expect(fill).not.toBe('transparent')
})

Then('the rectangle has visible stroke', async ({ page }) => {
  const rect = page.getByTestId(testIds.rectangle)
  const stroke = await rect.getAttribute('stroke')
  expect(stroke).toBeTruthy()
  expect(stroke).not.toBe('none')
  expect(stroke).not.toBe('transparent')
})

Then(
  '{int} rectangles exist on the canvas',
  async ({ page }, count: number) => {
    await expect(page.getByTestId(testIds.rectangle)).toHaveCount(count)
  }
)
