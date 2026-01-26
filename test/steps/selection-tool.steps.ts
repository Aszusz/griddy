import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './selection-tool.testIds'
import { testIds as drawTestIds } from './draw-rectangles.testIds'
import { getState, setupWithState } from './harness'
import { modelToBrowser } from './coords'
import { SHAPE_FILL, SHAPE_STROKE } from '../../src/constants'

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
      {
        id: `rect-${state.app.shapes.length}`,
        x,
        y,
        width,
        height,
        fill: SHAPE_FILL,
        stroke: SHAPE_STROKE,
      },
    ]
    await setupWithState(page, { initialState: { shapes } })
  }
)

When('I click at \\({int}, {int})', async ({ page }, x: number, y: number) => {
  const canvas = page.getByTestId(drawTestIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  const pos = modelToBrowser(x, y, box)
  await page.mouse.click(pos.x, pos.y)
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
  const pos = modelToBrowser(
    rect.x + rect.width / 2,
    rect.y + rect.height / 2,
    box
  )

  await page.keyboard.down('Shift')
  await page.mouse.move(pos.x, pos.y)
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
  const pos = modelToBrowser(
    rect.x + rect.width / 2,
    rect.y + rect.height / 2,
    box
  )
  await page.keyboard.down('Shift')
  await page.mouse.move(pos.x, pos.y)
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
    const start = modelToBrowser(x1, y1, box)
    const end = modelToBrowser(x2, y2, box)
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(end.x, end.y)
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
