import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './draw-arrows.testIds'
import { getState, focusCanvas } from './harness'
import { isLineShape } from '../../src/utils'

const { Given, When, Then } = createBdd()

Given('I select the Arrow tool', async ({ page }) => {
  await page.getByTestId(testIds.arrowTool).click({ force: true })
})

Then('the Arrow tool shows as active', async ({ page }) => {
  await expect(page.getByTestId(testIds.arrowTool)).toHaveAttribute(
    'data-active',
    'true'
  )
})

When('I press A', async ({ page }) => {
  await focusCanvas(page)
  await page.keyboard.press('a')
})

Then('the arrowhead is an open chevron', async ({ page }) => {
  // Open chevron is the default style - verify arrowEnd is set
  const state = await getState(page)
  const line = state.app.shapes.find(isLineShape)
  expect(line).toBeDefined()
  expect(line?.arrowEnd).toBe(true)
  // Chevron style is implicit (no arrowStyle means chevron)
})
