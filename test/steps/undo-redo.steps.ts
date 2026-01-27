import { createBdd } from 'playwright-bdd'
import { focusCanvas } from './harness'
import { testIds } from './draw-rectangles.testIds'
import { modelToBrowser } from './coords'

const { Given, When } = createBdd()

When('I undo', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Meta+z')
})

When('I redo', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('Meta+Shift+z')
})

When('I undo {int} times', async ({ page }, count: number) => {
  await focusCanvas(page)
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Meta+z')
  }
})

Given(
  '{int} rectangles have been created and undone',
  async ({ page }, count: number) => {
    // Create rectangles one at a time, then undo them all
    // This fills the history stack
    const canvas = page.getByTestId(testIds.canvas)
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')

    // Select rectangle tool
    await page.getByTestId(testIds.rectangleTool).click({ force: true })

    for (let i = 0; i < count; i++) {
      // Draw small rectangle
      const start = modelToBrowser(40 + i * 10, 40, box)
      const end = modelToBrowser(80 + i * 10, 80, box)
      await page.mouse.move(start.x, start.y)
      await page.mouse.down()
      await page.mouse.move(end.x, end.y)
      await page.mouse.up()
    }

    // Undo all rectangles
    await focusCanvas(page)
    for (let i = 0; i < count; i++) {
      await page.keyboard.press('Meta+z')
    }
  }
)

When('I clear the text', async ({ page }) => {
  await page.keyboard.press('Meta+a')
  await page.keyboard.press('Backspace')
})
