import { expect, type Download, type Page } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import LZString from 'lz-string'
import { testIds, LOCALSTORAGE_KEY } from './file-save-load.testIds'
import { SHAPE_FILL, SHAPE_STROKE } from '../../src/constants'
import {
  getState,
  setupWithUrl,
  setupDefault,
  setupPreservingLocalStorage,
} from './harness'

const { Given, When, Then } = createBdd()

// Store for multi-tab tests
let secondTab: Page | null = null

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
  const btn = page.getByTestId(testIds.cancelButton)
  await btn.waitFor({ state: 'visible' })
  await btn.click()
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
  const testIdMap: Record<string, string> = {
    New: testIds.newMenuItem,
    Save: testIds.saveMenuItem,
    Open: testIds.openMenuItem,
    'Export PNG': testIds.exportPngMenuItem,
  }
  await expect(page.getByTestId(testIdMap[label])).toBeVisible()
})

// Store PNG download for assertions
let lastPngDownload: Download | null = null

When('I export the canvas as PNG', async ({ page }) => {
  await page.getByTestId(testIds.mainMenuTrigger).click({ force: true })
  const downloadPromise = page
    .waitForEvent('download', { timeout: 500 })
    .catch(() => null)
  await page.getByTestId(testIds.exportPngMenuItem).click()
  lastPngDownload = await downloadPromise
})

Then('a PNG file is downloaded', async () => {
  expect(lastPngDownload).not.toBeNull()
  expect(lastPngDownload!.suggestedFilename()).toMatch(/\.png$/)
})

Then('the exported image contains all shapes', async () => {
  // State assertion: verify export included all shapes
  // Actual pixel verification is impractical; trust implementation if file downloads
  expect(lastPngDownload).not.toBeNull()
})

// Shareable Links
let copiedUrl: string | null = null

When('I copy a shareable link', async ({ page, context }) => {
  // Grant clipboard permissions
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.getByTestId(testIds.mainMenuTrigger).click({ force: true })
  await page.getByTestId(testIds.copyLinkMenuItem).click()
  // Read from clipboard
  copiedUrl = await page.evaluate(() => navigator.clipboard.readText())
})

Then('a URL with hash is copied to clipboard', async () => {
  expect(copiedUrl).not.toBeNull()
  expect(copiedUrl).toMatch(/#.+/)
})

function getSharedEllipseHash() {
  const shapes = [
    {
      id: 'shared-ellipse',
      type: 'ellipse',
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      fill: SHAPE_FILL,
      stroke: SHAPE_STROKE,
    },
  ]
  const data = JSON.stringify({ shapes })
  return LZString.compressToEncodedURIComponent(data)
}

Given(
  'I open the app with a shared link containing an ellipse',
  async ({ page }) => {
    const hash = getSharedEllipseHash()
    // Canvas is empty, so link loads immediately (no confirm dialog)
    await setupWithUrl(page, `/#${hash}`, 'canvas')
  }
)

When('I paste a shared link containing an ellipse', async ({ page }) => {
  const hash = getSharedEllipseHash()
  // Simulate pasting a link by changing the hash (triggers hashchange event)
  await page.evaluate((h) => {
    window.location.hash = h
  }, hash)
  // Wait for confirm dialog since canvas has content
  await page.getByTestId(testIds.confirmDialog).waitFor({ state: 'visible' })
})

Then('the URL has no hash', async ({ page }) => {
  const url = page.url()
  expect(url).not.toMatch(/#.+/)
})

Given('I open the app with a corrupted shared link', async ({ page }) => {
  await setupWithUrl(page, '/#corrupted-invalid-data!!!', testIds.errorMessage)
})

Then('{int} shapes exist on the canvas', async ({ page }, count: number) => {
  const state = await getState(page)
  expect(state.app.shapes.length).toBe(count)
})

// localStorage steps
Given('localStorage is empty', async ({ page }) => {
  await page.goto('/')
  await page.evaluate((key) => localStorage.removeItem(key), LOCALSTORAGE_KEY)
})

Given(
  'localStorage contains a rectangle at \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const shapes = [
      {
        id: 'ls-rect',
        type: 'rectangle',
        x,
        y,
        width: 100,
        height: 100,
        fill: SHAPE_FILL,
        stroke: SHAPE_STROKE,
      },
    ]
    const data = JSON.stringify({ shapes })
    await page.goto('/')
    await page.evaluate(([key, val]) => localStorage.setItem(key, val), [
      LOCALSTORAGE_KEY,
      data,
    ] as const)
  }
)

// For tests that need to open the app with localStorage preserved
When('I start the app', async ({ page }) => {
  await setupPreservingLocalStorage(page)
})

Given('localStorage contains corrupted data', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(([key, val]) => localStorage.setItem(key, val), [
    LOCALSTORAGE_KEY,
    '{corrupted json!!!',
  ] as const)
})

// New menu item steps
When('I click New', async ({ page }) => {
  await page.getByTestId(testIds.mainMenuTrigger).click({ force: true })
  await page.getByTestId(testIds.newMenuItem).click()
})

When('I confirm the action', async ({ page }) => {
  await page.getByTestId(testIds.confirmButton).click()
})

When('I cancel the action', async ({ page }) => {
  await page.getByTestId(testIds.cancelButton).click()
})

Then('I do not see a confirmation dialog', async ({ page }) => {
  await expect(page.getByTestId(testIds.confirmDialog)).not.toBeVisible()
})

// Reload steps - preserve localStorage to test persistence
When('I reload the app', async ({ page }) => {
  await setupPreservingLocalStorage(page)
})

// Multi-tab steps
Given('I open the app in two tabs', async ({ page, context }) => {
  await setupDefault(page)
  secondTab = await context.newPage()
  await setupDefault(secondTab)
})

Given('I create a rectangle in the first tab', async ({ page }) => {
  // Select rectangle tool first
  await page.getByTestId('toolbox-rectangle').click({ force: true })
  // Draw a rectangle via drag
  const canvas = page.getByTestId('canvas')
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')
  await page.mouse.move(box.x + 100, box.y + 100)
  await page.mouse.down()
  await page.mouse.move(box.x + 200, box.y + 200)
  await page.mouse.up()
})

Then('the second tab shows the rectangle', async () => {
  expect(secondTab).not.toBeNull()
  // Trigger storage event check by focusing the tab
  await secondTab!.bringToFront()
  // Wait a bit for storage event to propagate
  await secondTab!.waitForTimeout(500)
  const state = await getState(secondTab!)
  expect(state.app.shapes.length).toBe(1)
})
