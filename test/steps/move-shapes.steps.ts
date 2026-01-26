import { expect, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds as drawTestIds } from './draw-rectangles.testIds'
import { getState } from './harness'
import { modelToBrowser } from './coords'
import { setDragStart } from './resize-handles.steps'

const { When, Then } = createBdd()

async function dragFromBy(
  page: Page,
  x: number,
  y: number,
  dx: number,
  dy: number
) {
  const canvas = page.getByTestId(drawTestIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  const start = modelToBrowser(x, y, box)
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(start.x + dx, start.y + dy)
  await page.mouse.up()
}

When(
  'I drag the shape from \\({int}, {int}) by \\({int}, {int})',
  async ({ page }, x: number, y: number, dx: number, dy: number) => {
    await dragFromBy(page, x, y, dx, dy)
  }
)

When(
  'I drag from \\({int}, {int}) by \\({int}, {int})',
  async ({ page }, x: number, y: number, dx: number, dy: number) => {
    await dragFromBy(page, x, y, dx, dy)
  }
)

When(
  'I start dragging the shape from \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const canvas = page.getByTestId(drawTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const start = modelToBrowser(x, y, box)
    setDragStart(start.x, start.y)
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
  }
)

Then(
  'the first rectangle is at position \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const state = await getState(page)
    const rect = state.app.shapes[0]
    expect(rect.x).toBe(x)
    expect(rect.y).toBe(y)
  }
)

Then(
  'the second rectangle is at position \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const state = await getState(page)
    const rect = state.app.shapes[1]
    expect(rect.x).toBe(x)
    expect(rect.y).toBe(y)
  }
)

When(
  'I hover over the shape at \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const canvas = page.getByTestId(drawTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const pos = modelToBrowser(x, y, box)
    await page.mouse.move(pos.x, pos.y)
  }
)

Then('the cursor is {string}', async ({ page }, cursor: string) => {
  const canvas = page.getByTestId(drawTestIds.canvas)
  await expect(canvas).toHaveCSS('cursor', cursor)
})
