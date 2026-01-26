import { expect, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './resize-handles.testIds'

const { When, Then } = createBdd()

// Shared drag start position for multi-step drag operations
let dragStartX = 0
let dragStartY = 0

export function setDragStart(x: number, y: number) {
  dragStartX = x
  dragStartY = y
}

Then('{int} resize handles are visible', async ({ page }, count: number) => {
  const handles = [
    page.getByTestId(testIds.handle('nw')),
    page.getByTestId(testIds.handle('n')),
    page.getByTestId(testIds.handle('ne')),
    page.getByTestId(testIds.handle('e')),
    page.getByTestId(testIds.handle('se')),
    page.getByTestId(testIds.handle('s')),
    page.getByTestId(testIds.handle('sw')),
    page.getByTestId(testIds.handle('w')),
  ]
  let visibleCount = 0
  for (const handle of handles) {
    if (await handle.isVisible()) visibleCount++
  }
  expect(visibleCount).toBe(count)
})

// Map handle names to positions
const handlePositions: Record<string, string> = {
  'top-left': 'nw',
  top: 'n',
  'top-right': 'ne',
  right: 'e',
  'bottom-right': 'se',
  bottom: 's',
  'bottom-left': 'sw',
  left: 'w',
}

async function getHandleCenter(page: Page, handleName: string) {
  const position = handlePositions[handleName]
  const handle = page.getByTestId(testIds.handle(position))
  const box = await handle.boundingBox()
  if (!box) throw new Error(`Handle ${handleName} not found`)
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

When(
  /^I drag the (top-left|top|top-right|right|bottom-right|bottom|bottom-left|left) handle by \((-?\d+), (-?\d+)\)$/,
  async ({ page }, handle: string, dxStr: string, dyStr: string) => {
    const dx = parseInt(dxStr, 10)
    const dy = parseInt(dyStr, 10)
    const center = await getHandleCenter(page, handle)
    await page.mouse.move(center.x, center.y)
    await page.mouse.down()
    await page.mouse.move(center.x + dx, center.y + dy)
    await page.mouse.up()
  }
)

When('I start dragging the right handle', async ({ page }) => {
  const center = await getHandleCenter(page, 'right')
  dragStartX = center.x
  dragStartY = center.y
  await page.mouse.move(center.x, center.y)
  await page.mouse.down()
})

When(
  'I drag to offset \\({int}, {int})',
  async ({ page }, dx: number, dy: number) => {
    await page.mouse.move(dragStartX + dx, dragStartY + dy)
  }
)
