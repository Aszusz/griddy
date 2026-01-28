import type { AppState, Shape } from '../state'

export function handleFileLoad(state: AppState, shapes: Shape[]): AppState {
  return {
    ...state,
    shapes,
    selectedIds: [],
    past: [],
    future: [],
  }
}
