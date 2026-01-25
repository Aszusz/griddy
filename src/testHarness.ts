import { createAppStore, type StoreConfig, type RootState } from './store'

type AppStore = ReturnType<typeof createAppStore>

type TestHarness = {
  // Called by tests to set config BEFORE app renders
  configure: (config: StoreConfig) => void
  // Called by tests to signal app can render
  ready: () => void
  // Called by tests to read current state (for assertions when UI is insufficient)
  getState: () => RootState
  // Called by app to wait for test configuration
  waitForReady: () => Promise<AppStore>
}

let storeConfig: StoreConfig = {}
let readyResolve: ((store: AppStore) => void) | null = null
let readyPromise: Promise<AppStore> | null = null
let activeStore: AppStore | null = null

export const testHarness: TestHarness = {
  configure(config) {
    storeConfig = config
  },

  ready() {
    activeStore = createAppStore(storeConfig)
    if (readyResolve) {
      readyResolve(activeStore)
    }
  },

  waitForReady() {
    if (!readyPromise) {
      readyPromise = new Promise((resolve) => {
        readyResolve = resolve
      })
    }
    return readyPromise
  },

  getState() {
    if (!activeStore) throw new Error('Store not ready')
    return activeStore.getState()
  },
}

declare global {
  interface Window {
    __TEST_HARNESS__?: TestHarness
  }
}

window.__TEST_HARNESS__ = testHarness
