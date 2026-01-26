import type { AppState } from '../state'
import { GRID_SIZE } from '../../constants'

export function handleViewportResized(
  state: AppState,
  width: number,
  height: number
): AppState {
  return {
    ...state,
    viewport: {
      width,
      height,
      originX: width / 2,
      originY: height / 2,
      gridSize: GRID_SIZE,
    },
  }
}
