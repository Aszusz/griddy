import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import App from './App.tsx'

async function main() {
  let appStore = store

  // In test mode, wait for harness configuration
  if (import.meta.env.VITE_TEST_HARNESS) {
    const { testHarness } = await import('./testHarness')
    appStore = await testHarness.waitForReady()
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={appStore}>
        <App />
      </Provider>
    </StrictMode>
  )
}

main()
