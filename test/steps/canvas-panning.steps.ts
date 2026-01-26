import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './canvas-panning.testIds'
import { testIds as drawTestIds } from './draw-rectangles.testIds'
import { getState, setupWithState, focusCanvas } from './harness'
import { modelToBrowser } from './coords'

const { Given, When, Then } = createBdd()

// Pan Tool selection (Given/When shared via When)
When('I select the Pan tool', async ({ page }) => {
  await page.getByTestId(testIds.panTool).click({ force: true })
})

Then('the Pan tool shows as active', async ({ page }) => {
  await expect(page.getByTestId(testIds.panTool)).toHaveAttribute(
    'data-active',
    'true'
  )
})

// Keyboard shortcuts
When('I press H', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('h')
})

When('I press Cmd+0', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Meta+0')
})

When('I press Ctrl+0', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Control+0')
})

// Spacebar handling
When('I hold spacebar', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.down(' ')
})

When('I release spacebar', async ({ page }) => {
  await page.keyboard.up(' ')
})

When(
  'I hold spacebar and drag from \\({int}, {int}) by \\({int}, {int})',
  async ({ page }, x: number, y: number, dx: number, dy: number) => {
    const canvas = page.getByTestId(drawTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const start = modelToBrowser(x, y, box)
    await focusCanvas(page)
    await page.keyboard.down(' ')
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(start.x + dx, start.y + dy)
    await page.mouse.up()
    await page.keyboard.up(' ')
  }
)

// Dragging
When(
  'I start dragging from \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const canvas = page.getByTestId(drawTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const pos = modelToBrowser(x, y, box)
    await page.mouse.move(pos.x, pos.y)
    await page.mouse.down()
  }
)

// Pan viewport (direct state manipulation for Given steps)
When(
  'I pan the viewport by \\({int}, {int})',
  async ({ page }, dx: number, dy: number) => {
    // Use pan tool to drag - start from origin
    await page.getByTestId(testIds.panTool).click({ force: true })
    const canvas = page.getByTestId(drawTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const start = modelToBrowser(0, 0, box)
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(start.x + dx, start.y + dy)
    await page.mouse.up()
  }
)

Given(
  'the viewport has pan offset \\({int}, {int})',
  async ({ page }, panX: number, panY: number) => {
    const state = await getState(page)
    await setupWithState(page, {
      initialState: {
        shapes: state.app.shapes,
        selectedIds: state.app.selectedIds,
        panX,
        panY,
      },
    })
  }
)

// Viewport assertions
Then(
  'the viewport is panned by \\({int}, {int})',
  async ({ page }, expectedX: number, expectedY: number) => {
    const state = await getState(page)
    expect(state.app.panX).toBe(expectedX)
    expect(state.app.panY).toBe(expectedY)
  }
)

Then(
  'the origin crosshair is offset by \\({int}, {int}) from center',
  async ({ page }, offsetX: number, offsetY: number) => {
    const state = await getState(page)
    expect(state.app.panX).toBe(offsetX)
    expect(state.app.panY).toBe(offsetY)
  }
)

Then(
  'the rectangle appears at visual position \\({int}, {int})',
  async ({ page }, visualX: number, visualY: number) => {
    const state = await getState(page)
    const rect = state.app.shapes[0]
    // Visual position = world position + pan offset
    expect(rect.x + state.app.panX).toBe(visualX)
    expect(rect.y + state.app.panY).toBe(visualY)
  }
)
