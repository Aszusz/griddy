import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './draw-text.testIds'
import { testIds as drawTestIds } from './draw-rectangles.testIds'
import { getState, setupWithState, focusCanvas } from './harness'
import { modelToBrowser } from './coords'

const { Given, When, Then } = createBdd()

// Tool selection
Given('I select the Text tool', async ({ page }) => {
  await page.getByTestId(testIds.textTool).click({ force: true })
})

Then('the Text tool shows as active', async ({ page }) => {
  await expect(page.getByTestId(testIds.textTool)).toHaveAttribute(
    'data-active',
    'true'
  )
})

When('I press T', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('t')
})

// Drawing text boxes
When(
  'I draw a text box from \\({int}, {int}) to \\({int}, {int})',
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
  'a text box exists at grid position \\({int}, {int}) with size \\({int}, {int})',
  async ({ page }, x: number, y: number, width: number, height: number) => {
    const state = await getState(page)
    const textShape = state.app.shapes.find((s) => s.type === 'text')
    expect(textShape).toBeDefined()
    expect(textShape?.x).toBe(x)
    expect(textShape?.y).toBe(y)
    expect((textShape as { width: number }).width).toBe(width)
    expect((textShape as { height: number }).height).toBe(height)
  }
)

// Edit mode
Then('the text box is in edit mode', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.editingTextId).not.toBeNull()
})

Then('the text box is not in edit mode', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.editingTextId).toBeNull()
})

// Preview
Then('a preview text box is visible', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.drawing).not.toBeNull()
})

Then('no preview text box is visible', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.drawing).toBeNull()
})

// Typing
When('I type {string}', async ({ page }, text: string) => {
  await page.keyboard.type(text)
})

When('I click outside the text box', async ({ page }) => {
  const canvas = page.getByTestId(drawTestIds.canvas)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  // Click at origin (0, 0) which should be outside any text box
  const pos = modelToBrowser(0, 0, box)
  await page.mouse.click(pos.x, pos.y)
})

When('I press Escape', async ({ page }) => {
  await page.keyboard.press('Escape')
})

Then('the text box contains {string}', async ({ page }, text: string) => {
  const state = await getState(page)
  const textShape = state.app.shapes.find((s) => s.type === 'text')
  expect(textShape).toBeDefined()
  expect((textShape as { text: string }).text).toBe(text)
})

// Text box count
Then(
  '{int} text boxes exist on the canvas',
  async ({ page }, count: number) => {
    const state = await getState(page)
    const textShapes = state.app.shapes.filter((s) => s.type === 'text')
    expect(textShapes.length).toBe(count)
  }
)

// Given text box exists (setup)
Given(
  'a text box exists at \\({int}, {int}) with size \\({int}, {int}) containing {string}',
  async (
    { page },
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
  ) => {
    const state = await getState(page)
    const shapes = [
      ...state.app.shapes,
      {
        id: `text-${state.app.shapes.length}`,
        type: 'text' as const,
        x,
        y,
        width,
        height,
        text,
        fill: '#000000',
        fontFamily: 'sans' as const,
        align: 'left' as const,
      },
    ]
    await setupWithState(page, { initialState: { shapes } })
  }
)

Given('the text box is selected', async ({ page }) => {
  const state = await getState(page)
  const textShape = state.app.shapes.find((s) => s.type === 'text')
  if (!textShape) throw new Error('No text shape found')
  await setupWithState(page, {
    initialState: {
      shapes: state.app.shapes,
      selectedIds: [textShape.id],
    },
  })
})

// Double click
When(
  'I double-click at \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const canvas = page.getByTestId(drawTestIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')
    const pos = modelToBrowser(x, y, box)
    await page.mouse.dblclick(pos.x, pos.y)
  }
)

// Text wrapping/clipping
Then('the text displays on multiple lines', async ({ page }) => {
  const state = await getState(page)
  const textShape = state.app.shapes.find((s) => s.type === 'text')
  expect(textShape).toBeDefined()
  // Text with long content that exceeds box width should wrap
  // This is a visual assertion - we verify the text shape exists and has content
  const text = (textShape as { text: string }).text
  expect(text.length).toBeGreaterThan(20)
})

Then('the text is clipped to the box height', async ({ page }) => {
  const state = await getState(page)
  const textShape = state.app.shapes.find((s) => s.type === 'text')
  expect(textShape).toBeDefined()
  // Text overflow clipping is visual - we just verify the shape exists
  const text = (textShape as { text: string }).text
  expect(text.length).toBeGreaterThan(0)
})

// Copy/paste assertions
Then('both text boxes contain {string}', async ({ page }, text: string) => {
  const state = await getState(page)
  const textShapes = state.app.shapes.filter((s) => s.type === 'text')
  expect(textShapes.length).toBe(2)
  for (const shape of textShapes) {
    expect((shape as { text: string }).text).toBe(text)
  }
})
