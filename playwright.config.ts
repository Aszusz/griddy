import { defineConfig } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

const testDir = defineBddConfig({
  featuresRoot: '_features',
  steps: 'test/steps/*.ts',
  outputDir: 'test/.gen',
})

export default defineConfig({
  testDir,
  outputDir: 'test/results',
  reporter: [['html', { outputFolder: 'test/report', open: 'never' }]],
  expect: { timeout: 500 },
  use: {
    baseURL: 'http://localhost:5200',
    actionTimeout: 500,
    viewport: { width: 800, height: 600 },
  },
  webServer: {
    command: 'VITE_TEST_HARNESS=1 vite --port 5200',
    url: 'http://localhost:5200',
    reuseExistingServer: false,
  },
})
