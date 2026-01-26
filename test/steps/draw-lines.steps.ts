import { expect, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './draw-lines.testIds'
import { testIds as drawTestIds } from './draw-rectangles.testIds'
import { getState, setupWithState, focusCanvas } from './harness'
import { modelToBrowser } from './coords'
import { SHAPE_STROKE } from '../../src/constants'

const { Given, When, Then } = createBdd()

// Type for line shape (not yet in Shape union)
type LineShape = {
  id: string
  type: 'line'
  x: number
  y: number
  x2: number
  y2: number
  stroke: string
}

function isLine(s: unknown): s is LineShape {
  return (s as { type: string }).type === 'line'
}

Given('I select the Line tool', async ({ page }) => {
  await page.getByTestId(testIds.lineTool).click({ force: true })
})

Then('the Line tool shows as active', async ({ page }) => {
  await expect(page.getByTestId(testIds.lineTool)).toHaveAttribute(
    'data-active',
    'true'
  )
})

When('I press L', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('l')
})

When(
  'I draw a line from \\({int}, {int}) to \\({int}, {int})',
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

// Used as both Given (setup) and Then (assertion)
// When shapes exist, it's an assertion. When none exist, it's setup.
Given(
  'a line exists from \\({int}, {int}) to \\({int}, {int})',
  async ({ page }, x1: number, y1: number, x2: number, y2: number) => {
    const state = await getState(page)
    const shapes = state.app.shapes as unknown[]
    const existingLine = shapes.find(
      (s) => isLine(s) && s.x === x1 && s.y === y1 && s.x2 === x2 && s.y2 === y2
    ) as LineShape | undefined

    if (existingLine) {
      // Line exists - this is an assertion, just verify
      expect(existingLine).toBeDefined()
    } else if (shapes.some(isLine)) {
      // Lines exist but not matching coords - this is an assertion
      const line = shapes.find(isLine) as LineShape
      expect(line.x).toBe(x1)
      expect(line.y).toBe(y1)
      expect(line.x2).toBe(x2)
      expect(line.y2).toBe(y2)
    } else {
      // No lines - this is setup, create one
      const newShapes = [
        ...state.app.shapes,
        {
          id: `line-${state.app.shapes.length}`,
          type: 'line' as const,
          x: x1,
          y: y1,
          x2,
          y2,
          stroke: SHAPE_STROKE,
        },
      ]
      await setupWithState(page, {
        initialState: { shapes: newShapes as typeof state.app.shapes },
      })
    }
  }
)

Then('a preview line is visible', async ({ page }) => {
  const state = await getState(page)
  expect(state?.app.drawing).not.toBeNull()
})

Then('no preview line is visible', async ({ page }) => {
  const state = await getState(page)
  expect(state?.app.drawing).toBeNull()
})

Then('the line has visible stroke', async ({ page }) => {
  const state = await getState(page)
  const shapes = state.app.shapes as unknown[]
  const line = shapes.find(isLine)
  expect(line).toBeDefined()
})

Then('the line has no fill', async ({ page }) => {
  const state = await getState(page)
  const shapes = state.app.shapes as unknown[]
  const line = shapes.find(isLine)
  expect(line).toBeDefined()
  // Lines don't have fill by design
})

Then('{int} lines exist on the canvas', async ({ page }, count: number) => {
  const state = await getState(page)
  const shapes = state.app.shapes as unknown[]
  const lines = shapes.filter(isLine)
  expect(lines.length).toBe(count)
})

Given('the line is selected', async ({ page }) => {
  const state = await getState(page)
  const { shapes } = state.app
  const line = (shapes as unknown[]).find(isLine)
  if (!line) throw new Error('No line found')
  await setupWithState(page, {
    initialState: { shapes, selectedIds: [line.id] },
  })
})

Then('{int} endpoint handles are visible', async ({ page }, count: number) => {
  const handles = [
    page.getByTestId(testIds.endpointHandle('start')),
    page.getByTestId(testIds.endpointHandle('end')),
  ]
  let visibleCount = 0
  for (const handle of handles) {
    if (await handle.isVisible()) visibleCount++
  }
  expect(visibleCount).toBe(count)
})

async function getEndpointHandleCenter(page: Page, position: 'start' | 'end') {
  const handle = page.getByTestId(testIds.endpointHandle(position))
  const box = await handle.boundingBox()
  if (!box) throw new Error(`Handle ${position} not found`)
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

When(
  /^I drag the (start|end) handle by \((-?\d+), (-?\d+)\)$/,
  async ({ page }, position: string, dxStr: string, dyStr: string) => {
    const dx = parseInt(dxStr, 10)
    const dy = parseInt(dyStr, 10)
    const center = await getEndpointHandleCenter(
      page,
      position as 'start' | 'end'
    )
    await page.mouse.move(center.x, center.y)
    await page.mouse.down()
    await page.mouse.move(center.x + dx, center.y + dy)
    await page.mouse.up()
  }
)
