import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from 'redux'
import { reducer } from './reducers'
import { AppActions } from './actions'
import { logger } from './middleware/logger'
import { type Effects } from './effects'
import { initialState, type AppState } from './state'

const rootReducer = combineReducers({
  app: reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export type StoreConfig = {
  initialState?: Partial<AppState>
  effects?: Partial<Effects>
}

export function createAppStore(config: StoreConfig = {}) {
  const state: AppState = { ...initialState, ...config.initialState }

  const store = createStore(
    rootReducer,
    { app: state } as unknown as undefined,
    applyMiddleware(logger)
  )
  store.dispatch(AppActions['app/started']())
  return store
}

// Default store (used when harness not active)
export const store = createAppStore()

export type AppDispatch = typeof store.dispatch
