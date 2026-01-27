import type { AppState } from '../state'
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '../../constants'

function clampZoom(zoom: number): number {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
}

export function handleZoomIn(state: AppState): AppState {
  const newZoom = clampZoom(state.zoom * ZOOM_STEP)
  return { ...state, zoom: newZoom }
}

export function handleZoomOut(state: AppState): AppState {
  const newZoom = clampZoom(state.zoom / ZOOM_STEP)
  return { ...state, zoom: newZoom }
}

export function handleZoomSet(state: AppState, zoom: number): AppState {
  return { ...state, zoom: clampZoom(zoom) }
}

export function handleZoomAtPoint(
  state: AppState,
  delta: number,
  screenX: number,
  screenY: number
): AppState {
  const factor = delta > 0 ? 1 / ZOOM_STEP : ZOOM_STEP
  const newZoom = clampZoom(state.zoom * factor)
  if (newZoom === state.zoom) return state

  // Calculate the world point under the mouse before zoom
  const centerX = state.viewport.width / 2
  const centerY = state.viewport.height / 2
  const worldX = (screenX - centerX - state.panX) / state.zoom
  const worldY = (screenY - centerY - state.panY) / state.zoom

  // After zoom, adjust pan so the same world point stays under mouse
  const newPanX = screenX - centerX - worldX * newZoom
  const newPanY = screenY - centerY - worldY * newZoom

  return { ...state, zoom: newZoom, panX: newPanX, panY: newPanY }
}
