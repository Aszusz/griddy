import type { AppState } from '../state'

export function handlePanStarted(
  state: AppState,
  x: number,
  y: number
): AppState {
  return {
    ...state,
    pan: {
      startX: x,
      startY: y,
      originalPanX: state.panX,
      originalPanY: state.panY,
    },
  }
}

export function handlePanMoved(
  state: AppState,
  x: number,
  y: number
): AppState {
  if (!state.pan) return state
  const dx = x - state.pan.startX
  const dy = y - state.pan.startY
  return {
    ...state,
    panX: state.pan.originalPanX + dx,
    panY: state.pan.originalPanY + dy,
  }
}

export function handlePanReset(state: AppState): AppState {
  return { ...state, panX: 0, panY: 0, zoom: 1 }
}

export function handleSpacebarPressed(state: AppState): AppState {
  if (state.spacebarHeld) return state
  return {
    ...state,
    spacebarHeld: true,
    toolBeforeSpacebar: state.activeTool,
    activeTool: 'pan' as const,
  }
}

export function handleSpacebarReleased(state: AppState): AppState {
  if (!state.spacebarHeld) return state
  return {
    ...state,
    spacebarHeld: false,
    activeTool: state.toolBeforeSpacebar ?? 'select',
    toolBeforeSpacebar: null,
  }
}
