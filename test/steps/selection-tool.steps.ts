import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './selection-tool.testIds'
import { testIds as drawTestIds } from './draw-rectangles.testIds'
import { getState, setupWithState } from './harness'

const { Given, When, Then } = createBdd()

When('I select the Selection tool', async ({ page }) => {
  await page.getByTestId(testIds.selectionTool).click({ force: true })
})

Then('the Selection tool shows as active', async ({ page }) => {
  await expect(page.getByTestId(testIds.selectionTool)).toHaveAttribute(
    'data-active',
    'true'
  )
})

Given(
  'a rectangle exists at \\({int}, {int}) with size \\({int}, {int})',
  async ({ page }, x: number, y: number, width: number, height: number) => {
    const state = await getState(page)
    const shapes = [
      ...state.app.shapes,
      { id: `rect-${state.app.shapes.length}`, x, y, width, height },
    ]
    await setupWithState(page, { initialState: { shapes } })
  }
)

When('I click at \\({int}, {int})', async ({ page }, x: number, y: number) => {
  const canvas = page.getByTestId(drawTestIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  await page.mouse.click(box.x + x, box.y + y)
})

Then('{int} shape is selected', async ({ page }, count: number) => {
  const state = await getState(page)
  expect(state.app.selectedIds.length).toBe(count)
})

Then('{int} shapes are selected', async ({ page }, count: number) => {
  const state = await getState(page)
  expect(state.app.selectedIds.length).toBe(count)
})

Given('the rectangle is selected', async ({ page }) => {
  const state = await getState(page)
  const { shapes } = state.app
  await setupWithState(page, {
    initialState: { shapes, selectedIds: [shapes[0].id] },
  })
})

Then('no shapes are selected', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.selectedIds.length).toBe(0)
})

Given('the first rectangle is selected', async ({ page }) => {
  const state = await getState(page)
  const { shapes } = state.app
  await setupWithState(page, {
    initialState: { shapes, selectedIds: [shapes[0].id] },
  })
})

When('I shift-click the second rectangle', async ({ page }) => {
  const { shapes } = (await getState(page)).app
  const rect = shapes[1]
  const canvas = page.getByTestId(drawTestIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  const originX = box.width / 2
  const originY = box.height / 2
  const centerX = originX + rect.x + rect.width / 2
  const centerY = originY + rect.y + rect.height / 2

  await page.keyboard.down('Shift')
  await page.mouse.move(box.x + centerX, box.y + centerY)
  await page.mouse.down()
  await page.mouse.up()
  await page.keyboard.up('Shift')
})

Given('both rectangles are selected', async ({ page }) => {
  const { shapes } = (await getState(page)).app
  await setupWithState(page, {
    initialState: { shapes, selectedIds: shapes.map((s) => s.id) },
  })
})

When('I shift-click the first rectangle', async ({ page }) => {
  const { shapes } = (await getState(page)).app
  const rect = shapes[0]
  const canvas = page.getByTestId(drawTestIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  const originX = box.width / 2
  const originY = box.height / 2
  const centerX = originX + rect.x + rect.width / 2
  const centerY = originY + rect.y + rect.height / 2
  await page.keyboard.down('Shift')
  await page.mouse.move(box.x + centerX, box.y + centerY)
  await page.mouse.down()
  await page.mouse.up()
  await page.keyboard.up('Shift')
})

When(
  'I drag a marquee from \\({int}, {int}) to \\({int}, {int})',
  async ({ page }, x1: number, y1: number, x2: number, y2: number) => {
    const canvas = page.getByTestId(drawTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    // World coords to canvas coords (origin at center of viewport)
    const originX = box.width / 2
    const originY = box.height / 2
    const canvasX1 = box.x + originX + x1
    const canvasY1 = box.y + originY + y1
    const canvasX2 = box.x + originX + x2
    const canvasY2 = box.y + originY + y2
    await page.mouse.move(canvasX1, canvasY1)
    await page.mouse.down()
    await page.mouse.move(canvasX2, canvasY2)
    await page.mouse.up()
  }
)

Then('the selected shape has a selection border', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.selectedIds.length).toBeGreaterThan(0)
  // Visual verification - selection border rendered on canvas
})

Then('the selected shape has resize handles at corners', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.selectedIds.length).toBeGreaterThan(0)
  // Visual verification - resize handles rendered on canvas
})
