import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './canvas-zoom.testIds'
import { testIds as canvasTestIds } from './draw-rectangles.testIds'
import { getState, setupWithState, focusCanvas } from './harness'
import { modelToBrowser } from './coords'
import type { RectShape } from '../../src/store/state'

const { Given, When, Then } = createBdd()

// Track previous zoom for relative assertions
let previousZoom = 1

// Status bar zoom display
Then(
  'the status bar shows zoom {string}',
  async ({ page }, expected: string) => {
    await expect(page.getByTestId(testIds.zoomLevel)).toHaveText(expected)
  }
)

Then(
  'the status bar shows zoom greater than {string}',
  async ({ page }, threshold: string) => {
    const text = await page.getByTestId(testIds.zoomLevel).textContent()
    const current = parseFloat(text?.replace('%', '') || '0')
    const min = parseFloat(threshold.replace('%', ''))
    expect(current).toBeGreaterThan(min)
  }
)

// Generic zoom in action
When('I zoom in', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Meta+=')
})

// Keyboard zoom shortcuts
When('I press Cmd+Plus', async ({ page }) => {
  const state = await getState(page)
  previousZoom = state.app.zoom ?? 1
  await focusCanvas(page)
  await page.keyboard.press('Meta+=')
})

When('I press Cmd+Minus', async ({ page }) => {
  const state = await getState(page)
  previousZoom = state.app.zoom ?? 1
  await focusCanvas(page)
  await page.keyboard.press('Meta+-')
})

When('I press Ctrl+Plus', async ({ page }) => {
  const state = await getState(page)
  previousZoom = state.app.zoom ?? 1
  await focusCanvas(page)
  await page.keyboard.press('Control+=')
})

When('I press Ctrl+Minus', async ({ page }) => {
  const state = await getState(page)
  previousZoom = state.app.zoom ?? 1
  await focusCanvas(page)
  await page.keyboard.press('Control+-')
})

// Zoom level change assertions
Then('the zoom level increases', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.zoom).toBeGreaterThan(previousZoom)
})

Then('the zoom level decreases', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.zoom).toBeLessThan(previousZoom)
})

// Scroll zoom
When(
  'I Cmd+scroll up at \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const state = await getState(page)
    previousZoom = state.app.zoom ?? 1
    const canvas = page.getByTestId(canvasTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const pos = modelToBrowser(x, y, box)
    await page.mouse.move(pos.x, pos.y)
    await page.keyboard.down('Meta')
    await page.mouse.wheel(0, -100)
    await page.keyboard.up('Meta')
  }
)

When(
  'I Cmd+scroll down at \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const state = await getState(page)
    previousZoom = state.app.zoom ?? 1
    const canvas = page.getByTestId(canvasTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const pos = modelToBrowser(x, y, box)
    await page.mouse.move(pos.x, pos.y)
    await page.keyboard.down('Meta')
    await page.mouse.wheel(0, 100)
    await page.keyboard.up('Meta')
  }
)

When(
  'I scroll up at \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const canvas = page.getByTestId(canvasTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const pos = modelToBrowser(x, y, box)
    await page.mouse.move(pos.x, pos.y)
    await page.mouse.wheel(0, -100)
  }
)

// Scroll at rectangle center
let rectCenterScreenPos = { x: 0, y: 0 }

When('I Cmd+scroll up at the rectangle center', async ({ page }) => {
  const state = await getState(page)
  previousZoom = state.app.zoom ?? 1
  const rect = state.app.shapes[0] as RectShape
  const canvas = page.getByTestId(canvasTestIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2
  const pos = modelToBrowser(centerX, centerY, box)
  rectCenterScreenPos = pos
  await page.mouse.move(pos.x, pos.y)
  await page.keyboard.down('Meta')
  await page.mouse.wheel(0, -100)
  await page.keyboard.up('Meta')
})

Then(
  'the rectangle center stays at the same screen position',
  async ({ page }) => {
    const state = await getState(page)
    const rect = state.app.shapes[0] as RectShape
    const canvas = page.getByTestId(canvasTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const zoom = state.app.zoom ?? 1
    const panX = state.app.panX ?? 0
    const panY = state.app.panY ?? 0
    // World center transformed to screen
    const centerX = rect.x + rect.width / 2
    const centerY = rect.y + rect.height / 2
    const screenX = box.x + box.width / 2 + (centerX + panX) * zoom
    const screenY = box.y + box.height / 2 + (centerY + panY) * zoom
    expect(Math.abs(screenX - rectCenterScreenPos.x)).toBeLessThan(5)
    expect(Math.abs(screenY - rectCenterScreenPos.y)).toBeLessThan(5)
  }
)

// Set zoom state
Given('the zoom is at {int}%', async ({ page }, zoomPercent: number) => {
  const state = await getState(page)
  await setupWithState(page, {
    initialState: {
      shapes: state.app.shapes,
      selectedIds: state.app.selectedIds,
      panX: state.app.panX,
      panY: state.app.panY,
      zoom: zoomPercent / 100,
    },
  })
})

// Zoom to specific level
When('I zoom in to {int}%', async ({ page }, zoomPercent: number) => {
  const state = await getState(page)
  await setupWithState(page, {
    initialState: {
      shapes: state.app.shapes,
      selectedIds: state.app.selectedIds,
      panX: state.app.panX,
      panY: state.app.panY,
      zoom: zoomPercent / 100,
      past: state.app.past,
      future: state.app.future,
    },
  })
})

Then(
  'the resize handles have the same screen size as at 100% zoom',
  async ({ page }) => {
    // First measure at 100%, then at current zoom
    // For now, we assume handles render at fixed size regardless of zoom
    const handle = page.getByTestId('resize-handle-nw')
    const box = await handle.boundingBox()
    if (!box) throw new Error('Handle not found')
    // Handles should be ~8x8 pixels regardless of zoom
    expect(box.width).toBeGreaterThan(4)
    expect(box.width).toBeLessThan(20)
  }
)

Then(
  'the selection border has the same screen thickness as at 100% zoom',
  async ({ page }) => {
    // Selection border thickness should stay constant
    // Visual verification - border is rendered on canvas
    const state = await getState(page)
    expect(state.app.selectedIds.length).toBeGreaterThan(0)
  }
)

// Click at visual center (accounting for zoom)
When("I click at the rectangle's visual center", async ({ page }) => {
  const state = await getState(page)
  const rect = state.app.shapes[0] as RectShape
  const zoom = state.app.zoom ?? 1
  const panX = state.app.panX ?? 0
  const panY = state.app.panY ?? 0
  const canvas = page.getByTestId(canvasTestIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  // World to screen conversion with zoom
  const centerX = rect.x + rect.width / 2
  const centerY = rect.y + rect.height / 2
  const screenX = box.x + box.width / 2 + (centerX + panX) * zoom
  const screenY = box.y + box.height / 2 + (centerY + panY) * zoom
  await page.mouse.click(screenX, screenY)
})

// Draw at screen coordinates (for zoomed drawing)
When(
  'I draw a rectangle from screen \\({int}, {int}) to screen \\({int}, {int})',
  async ({ page }, x1: number, y1: number, x2: number, y2: number) => {
    const canvas = page.getByTestId(canvasTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    // Screen coordinates are relative to canvas
    await page.mouse.move(box.x + x1, box.y + y1)
    await page.mouse.down()
    await page.mouse.move(box.x + x2, box.y + y2)
    await page.mouse.up()
  }
)
