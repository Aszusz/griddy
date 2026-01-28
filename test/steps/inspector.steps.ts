import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { testIds } from './inspector.testIds'
import { getState } from './harness'
import type { RectShape, TextShape } from '../../src/store/state'
import { isLineShape } from '../../src/utils'

const { When, Then } = createBdd()

Then('the Inspector panel is hidden', async ({ page }) => {
  await expect(page.getByTestId(testIds.panel)).toBeHidden()
})

Then('the Inspector panel is visible', async ({ page }) => {
  await expect(page.getByTestId(testIds.panel)).toBeVisible()
})

Then('the Inspector title is {string}', async ({ page }, title: string) => {
  await expect(page.getByTestId(testIds.title)).toHaveText(title)
})

Then('the Inspector shows X as {int}', async ({ page }, value: number) => {
  await expect(page.getByTestId(testIds.x)).toHaveText(String(value))
})

Then('the Inspector shows Y as {int}', async ({ page }, value: number) => {
  await expect(page.getByTestId(testIds.y)).toHaveText(String(value))
})

Then('the Inspector shows W as {int}', async ({ page }, value: number) => {
  await expect(page.getByTestId(testIds.width)).toHaveText(String(value))
})

Then('the Inspector shows H as {int}', async ({ page }, value: number) => {
  await expect(page.getByTestId(testIds.height)).toHaveText(String(value))
})

Then('the Inspector shows fill color', async ({ page }) => {
  await expect(page.getByTestId(testIds.fill)).toBeVisible()
})

Then('the Inspector shows stroke color', async ({ page }) => {
  await expect(page.getByTestId(testIds.stroke)).toBeVisible()
})

Then('the Inspector shows {string}', async ({ page }, text: string) => {
  await expect(page.getByTestId(testIds.multiSelectLabel)).toHaveText(text)
})

Then(
  'the Inspector shows fill as {string}',
  async ({ page }, color: string) => {
    await expect(page.getByTestId(testIds.fill)).toHaveText(color)
  }
)

Then(
  'the Inspector shows stroke as {string}',
  async ({ page }, color: string) => {
    await expect(page.getByTestId(testIds.stroke)).toHaveText(color)
  }
)

// Editable fields - When steps

When('I set Inspector X to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.xInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector Y to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.yInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector W to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.widthInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector H to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.heightInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector fill to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.fillInput)
  await input.fill(value)
  await input.blur()
})

When('I set Inspector stroke to {string}', async ({ page }, value: string) => {
  const input = page.getByTestId(testIds.strokeInput)
  await input.fill(value)
  await input.blur()
})

When(
  'I type {string} in Inspector X and press Enter',
  async ({ page }, value: string) => {
    const input = page.getByTestId(testIds.xInput)
    await input.fill(value)
    await input.press('Enter')
  }
)

When(
  'I type {string} in Inspector X and press Backspace',
  async ({ page }, value: string) => {
    const input = page.getByTestId(testIds.xInput)
    await input.focus()
    await input.clear()
    await input.pressSequentially(value)
    await input.press('Backspace')
    await input.blur()
  }
)

When('I focus Inspector X field', async ({ page }) => {
  await page.getByTestId(testIds.xInput).focus()
})

When(
  'I copy Inspector W value and paste into Inspector H',
  async ({ page }) => {
    const wInput = page.getByTestId(testIds.widthInput)
    const hInput = page.getByTestId(testIds.heightInput)
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control'

    await wInput.focus()
    await wInput.press(`${modifier}+a`)
    await wInput.press(`${modifier}+c`)
    await hInput.focus()
    await hInput.press(`${modifier}+a`)
    await hInput.press(`${modifier}+v`)
    await hInput.blur()
  }
)

When('I press Tab', async ({ page }) => {
  await page.keyboard.press('Tab')
})

// Editable fields - Then steps

Then(
  'the rectangle is at position \\({int}, {int})',
  async ({ page }, x: number, y: number) => {
    const state = await getState(page)
    const rect = state.app.shapes[0]
    expect(rect.x).toBe(x)
    expect(rect.y).toBe(y)
  }
)

Then(
  'the rectangle has size \\({int}, {int})',
  async ({ page }, w: number, h: number) => {
    const state = await getState(page)
    const rect = state.app.shapes[0] as RectShape
    expect(rect.width).toBe(w)
    expect(rect.height).toBe(h)
  }
)

Then(
  'the rectangle has fill color {string}',
  async ({ page }, color: string) => {
    const state = await getState(page)
    const rect = state.app.shapes[0] as RectShape
    expect(rect.fill).toBe(color)
  }
)

Then(
  'the rectangle has stroke color {string}',
  async ({ page }, color: string) => {
    const state = await getState(page)
    const rect = state.app.shapes[0] as RectShape
    expect(rect.stroke).toBe(color)
  }
)

Then('Inspector Y field is focused', async ({ page }) => {
  await expect(page.getByTestId(testIds.yInput)).toBeFocused()
})

Then('the rectangle still exists', async ({ page }) => {
  const state = await getState(page)
  expect(state.app.shapes.length).toBe(1)
})

// Arrowhead toggles

Then('the Inspector shows start arrowhead toggle', async ({ page }) => {
  await expect(page.getByTestId(testIds.arrowStartToggle)).toBeVisible()
})

Then('the Inspector shows end arrowhead toggle', async ({ page }) => {
  await expect(page.getByTestId(testIds.arrowEndToggle)).toBeVisible()
})

Then('the start arrowhead toggle is off', async ({ page }) => {
  await expect(page.getByTestId(testIds.arrowStartToggle)).toHaveAttribute(
    'data-checked',
    'false'
  )
})

Then('the end arrowhead toggle is off', async ({ page }) => {
  await expect(page.getByTestId(testIds.arrowEndToggle)).toHaveAttribute(
    'data-checked',
    'false'
  )
})

When(
  /^I toggle the (start|end) arrowhead (?:on|off)$/,
  async ({ page }, position: string) => {
    const toggle =
      position === 'start'
        ? page.getByTestId(testIds.arrowStartToggle)
        : page.getByTestId(testIds.arrowEndToggle)
    await toggle.click()
  }
)

Then(
  /^the line has an arrowhead at the (start|end)$/,
  async ({ page }, position: string) => {
    const state = await getState(page)
    const line = state.app.shapes.find(isLineShape)
    expect(line).toBeDefined()
    if (position === 'start') {
      expect(line?.arrowStart).toBe(true)
    } else {
      expect(line?.arrowEnd).toBe(true)
    }
  }
)

Then(
  /^the line has no arrowhead at the (start|end)$/,
  async ({ page }, position: string) => {
    const state = await getState(page)
    const line = state.app.shapes.find(isLineShape)
    expect(line).toBeDefined()
    if (position === 'start') {
      expect(line?.arrowStart).toBeFalsy()
    } else {
      expect(line?.arrowEnd).toBeFalsy()
    }
  }
)

// Text-specific inspector steps

Then('the Inspector shows font family selector', async ({ page }) => {
  await expect(page.getByTestId(testIds.fontFamilySelector)).toBeVisible()
})

Then('the Inspector shows alignment buttons', async ({ page }) => {
  await expect(page.getByTestId(testIds.alignmentButtons)).toBeVisible()
})

Then('the Inspector does not show stroke color', async ({ page }) => {
  await expect(page.getByTestId(testIds.stroke)).toBeHidden()
})

Then(
  'the Inspector shows font family as {string}',
  async ({ page }, font: string) => {
    await expect(page.getByTestId(testIds.fontFamilySelector)).toHaveValue(font)
  }
)

When(
  'I set Inspector font family to {string}',
  async ({ page }, font: string) => {
    await page.getByTestId(testIds.fontFamilySelector).selectOption(font)
  }
)

Then('the text box uses font {string}', async ({ page }, font: string) => {
  const state = await getState(page)
  const textShape = state.app.shapes.find((s) => s.type === 'text')
  expect(textShape).toBeDefined()
  expect((textShape as { fontFamily: string }).fontFamily).toBe(
    font.toLowerCase()
  )
})

Then(
  'the Inspector shows alignment as {string}',
  async ({ page }, alignment: string) => {
    const testId =
      alignment === 'Left'
        ? testIds.alignmentLeft
        : alignment === 'Center'
          ? testIds.alignmentCenter
          : testIds.alignmentRight
    await expect(page.getByTestId(testId)).toHaveAttribute(
      'data-active',
      'true'
    )
  }
)

When(
  'I set Inspector alignment to {string}',
  async ({ page }, alignment: string) => {
    const testId =
      alignment === 'Left'
        ? testIds.alignmentLeft
        : alignment === 'Center'
          ? testIds.alignmentCenter
          : testIds.alignmentRight
    await page.getByTestId(testId).click()
  }
)

Then(
  'the text box has alignment {string}',
  async ({ page }, alignment: string) => {
    const state = await getState(page)
    const textShape = state.app.shapes.find((s) => s.type === 'text')
    expect(textShape).toBeDefined()
    expect((textShape as { align: string }).align).toBe(alignment.toLowerCase())
  }
)

// Shape text alignment

Then('the Inspector shows horizontal alignment buttons', async ({ page }) => {
  await expect(page.getByTestId(testIds.hAlignButtons)).toBeVisible()
})

Then('the Inspector shows vertical alignment buttons', async ({ page }) => {
  await expect(page.getByTestId(testIds.vAlignButtons)).toBeVisible()
})

Then(
  'the Inspector does not show horizontal alignment buttons',
  async ({ page }) => {
    await expect(page.getByTestId(testIds.hAlignButtons)).toBeHidden()
  }
)

Then(
  'the Inspector does not show vertical alignment buttons',
  async ({ page }) => {
    await expect(page.getByTestId(testIds.vAlignButtons)).toBeHidden()
  }
)

When(
  'I set Inspector horizontal alignment to {string}',
  async ({ page }, alignment: string) => {
    const testId =
      alignment === 'Left'
        ? testIds.hAlignLeft
        : alignment === 'Center'
          ? testIds.hAlignCenter
          : testIds.hAlignRight
    await page.getByTestId(testId).click()
  }
)

When(
  'I set Inspector vertical alignment to {string}',
  async ({ page }, alignment: string) => {
    const testId =
      alignment === 'Top'
        ? testIds.vAlignTop
        : alignment === 'Middle'
          ? testIds.vAlignMiddle
          : testIds.vAlignBottom
    await page.getByTestId(testId).click()
  }
)

Then(
  'the rectangle text is aligned {string} horizontally',
  async ({ page }, alignment: string) => {
    const state = await getState(page)
    const rect = state.app.shapes.find((s) => s.type === 'rectangle') as
      | RectShape
      | undefined
    expect(rect?.textAlign).toBe(alignment.toLowerCase())
  }
)

Then(
  'the rectangle text is aligned {string} vertically',
  async ({ page }, alignment: string) => {
    const state = await getState(page)
    const rect = state.app.shapes.find((s) => s.type === 'rectangle') as
      | RectShape
      | undefined
    expect(rect?.textVAlign).toBe(alignment.toLowerCase())
  }
)

// Color palette steps

When('I click the fill color swatch', async ({ page }) => {
  await page.getByTestId(testIds.fillSwatch).click()
})

When('I click the stroke color swatch', async ({ page }) => {
  await page.getByTestId(testIds.strokeSwatch).click()
})

When(
  'I select the {word} color from the palette',
  async ({ page }, color: string) => {
    await page.getByTestId(testIds.paletteColor(color)).click()
  }
)

Then('the line has stroke color {string}', async ({ page }, color: string) => {
  const state = await getState(page)
  const line = state.app.shapes.find(isLineShape)
  expect(line).toBeDefined()
  expect(line?.stroke).toBe(color)
})

Then(
  'the text box has fill color {string}',
  async ({ page }, color: string) => {
    const state = await getState(page)
    const textShape = state.app.shapes.find((s) => s.type === 'text') as
      | TextShape
      | undefined
    expect(textShape).toBeDefined()
    expect(textShape?.fill).toBe(color)
  }
)
