import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './draw-ellipse.testIds'
import { testIds as drawTestIds } from './draw-rectangles.testIds'
import { getState, setupWithState } from './harness'
import { modelToBrowser } from './coords'
import { SHAPE_FILL, SHAPE_STROKE } from '../../src/constants'

const { Given, When, Then } = createBdd()

Given('I select the Ellipse tool', async ({ page }) => {
  await page.getByTestId(testIds.ellipseTool).click({ force: true })
})

Then('the Ellipse tool shows as active', async ({ page }) => {
  await expect(page.getByTestId(testIds.ellipseTool)).toHaveAttribute(
    'data-active',
    'true'
  )
})

When('I press E', async ({ page }) => {
  await page.getByTestId(drawTestIds.canvas).focus()
  await page.keyboard.press('e')
})

When(
  'I draw an ellipse from \\({int}, {int}) to \\({int}, {int})',
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

Then(
  'an ellipse exists at grid position \\({int}, {int}) with size \\({int}, {int})',
  async ({ page }, x: number, y: number, width: number, height: number) => {
    const state = await getState(page)
    const ellipse = state.app.shapes.find((s) => s.type === 'ellipse')
    expect(ellipse).toBeDefined()
    expect(ellipse?.x).toBe(x)
    expect(ellipse?.y).toBe(y)
    expect(ellipse?.width).toBe(width)
    expect(ellipse?.height).toBe(height)
  }
)

Then('a preview ellipse is visible', async ({ page }) => {
  const state = await getState(page)
  expect(state?.app.drawing).not.toBeNull()
})

Then('no preview ellipse is visible', async ({ page }) => {
  const state = await getState(page)
  expect(state?.app.drawing).toBeNull()
})

Then('the ellipse has visible fill', async ({ page }) => {
  const state = await getState(page)
  const ellipse = state.app.shapes.find((s) => s.type === 'ellipse')
  expect(ellipse).toBeDefined()
})

Then('the ellipse has visible stroke', async ({ page }) => {
  const state = await getState(page)
  const ellipse = state.app.shapes.find((s) => s.type === 'ellipse')
  expect(ellipse).toBeDefined()
})

Then('{int} ellipses exist on the canvas', async ({ page }, count: number) => {
  const state = await getState(page)
  const ellipses = state.app.shapes.filter((s) => s.type === 'ellipse')
  expect(ellipses.length).toBe(count)
})

Given(
  'an ellipse exists at \\({int}, {int}) with size \\({int}, {int})',
  async ({ page }, x: number, y: number, width: number, height: number) => {
    const state = await getState(page)
    const shapes = [
      ...state.app.shapes,
      {
        id: `ellipse-${state.app.shapes.length}`,
        type: 'ellipse' as const,
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

Given('the ellipse is selected', async ({ page }) => {
  const state = await getState(page)
  const { shapes } = state.app
  const ellipse = shapes.find((s) => s.type === 'ellipse')
  if (!ellipse) throw new Error('No ellipse found')
  await setupWithState(page, {
    initialState: { shapes, selectedIds: [ellipse.id] },
  })
})

Then(
  'the ellipse is at position \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const state = await getState(page)
    const ellipse = state.app.shapes.find((s) => s.type === 'ellipse')
    expect(ellipse?.x).toBe(x)
    expect(ellipse?.y).toBe(y)
  }
)

Then(
  'the ellipse has size \\({int}, {int})',
  async ({ page }, width: number, height: number) => {
    const state = await getState(page)
    const ellipse = state.app.shapes.find((s) => s.type === 'ellipse')
    expect(ellipse?.width).toBe(width)
    expect(ellipse?.height).toBe(height)
  }
)
