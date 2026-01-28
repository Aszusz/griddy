import { expect, type Download } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './file-save-load.testIds'
import { SHAPE_FILL, SHAPE_STROKE } from '../../src/constants'

const { When, Then } = createBdd()

// Store download for assertions
let lastDownload: Download | null = null
let downloadContent: string | null = null

When('I save the canvas', async ({ page }) => {
  // Click main menu trigger (force to bypass animation)
  await page.getByTestId(testIds.mainMenuTrigger).click({ force: true })
  // Listen for download before clicking Save
  const downloadPromise = page.waitForEvent('download')
  await page.getByTestId(testIds.saveMenuItem).click()
  lastDownload = await downloadPromise
  // Read downloaded content
  const stream = await lastDownload.createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  downloadContent = Buffer.concat(chunks).toString('utf-8')
})

Then('a JSON file is downloaded', async () => {
  expect(lastDownload).not.toBeNull()
  expect(lastDownload!.suggestedFilename()).toMatch(/\.json$/)
})

Then(
  'the saved file contains the rectangle with position \\({int}, {int})',
  // eslint-disable-next-line no-empty-pattern
  async ({}, x: number, y: number) => {
    expect(downloadContent).not.toBeNull()
    const data = JSON.parse(downloadContent!)
    const rect = data.shapes?.find(
      (s: { type: string }) => s.type === 'rectangle'
    )
    expect(rect).toBeDefined()
    expect(rect.x).toBe(x)
    expect(rect.y).toBe(y)
  }
)

Then('the saved file does not contain viewport state', async () => {
  expect(downloadContent).not.toBeNull()
  const data = JSON.parse(downloadContent!)
  expect(data.zoom).toBeUndefined()
  expect(data.panX).toBeUndefined()
  expect(data.panY).toBeUndefined()
})

When(
  'I load a file with an ellipse at \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    // Create file content
    const fileContent = JSON.stringify({
      shapes: [
        {
          id: 'ellipse-loaded',
          type: 'ellipse',
          x,
          y,
          width: 100,
          height: 100,
          fill: SHAPE_FILL,
          stroke: SHAPE_STROKE,
        },
      ],
    })

    // Click main menu trigger (force to bypass animation)
    await page.getByTestId(testIds.mainMenuTrigger).click({ force: true })
    // Set up file chooser before clicking Open
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByTestId(testIds.openMenuItem).click()
    const fileChooser = await fileChooserPromise
    // Create temp file and upload
    await fileChooser.setFiles({
      name: 'test.json',
      mimeType: 'application/json',
      buffer: Buffer.from(fileContent),
    })
  }
)

When('I confirm the load', async ({ page }) => {
  await page.getByTestId(testIds.confirmButton).click()
})

When('I cancel the load', async ({ page }) => {
  await page.getByTestId(testIds.cancelButton).click()
})

Then('I see a confirmation dialog', async ({ page }) => {
  await expect(page.getByTestId(testIds.confirmDialog)).toBeVisible()
})

When('I load an invalid JSON file', async ({ page }) => {
  // Click main menu trigger (force to bypass animation)
  await page.getByTestId(testIds.mainMenuTrigger).click({ force: true })
  // Set up file chooser before clicking Open
  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByTestId(testIds.openMenuItem).click()
  const fileChooser = await fileChooserPromise
  // Upload invalid JSON
  await fileChooser.setFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{ invalid json }'),
  })
})

Then('I see an error message', async ({ page }) => {
  await expect(page.getByTestId(testIds.errorMessage)).toBeVisible()
})

When('I open the main menu', async ({ page }) => {
  await page.getByTestId(testIds.mainMenuTrigger).click({ force: true })
})

Then('I see {string} menu item', async ({ page }, label: string) => {
  const testId = label === 'Save' ? testIds.saveMenuItem : testIds.openMenuItem
  await expect(page.getByTestId(testId)).toBeVisible()
})
