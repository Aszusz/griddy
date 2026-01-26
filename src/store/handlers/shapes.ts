import type { AppState } from '../state'
import { snapToGrid } from '../../utils'
import { GRID_SIZE } from '../../constants'

export function handleShapePositionChanged(
  state: AppState,
  id: string,
  axis: 'x' | 'y',
  rawValue: string
): AppState {
  const parsed = parseInt(rawValue, 10)
  if (isNaN(parsed)) return state
  return {
    ...state,
    shapes: state.shapes.map((s) =>
      s.id === id ? { ...s, [axis]: snapToGrid(parsed) } : s
    ),
  }
}

export function handleShapeSizeChanged(
  state: AppState,
  id: string,
  dim: 'width' | 'height',
  rawValue: string
): AppState {
  const parsed = parseInt(rawValue, 10)
  if (isNaN(parsed)) return state
  return {
    ...state,
    shapes: state.shapes.map((s) =>
      s.id === id ? { ...s, [dim]: Math.max(GRID_SIZE, snapToGrid(parsed)) } : s
    ),
  }
}

export function handleShapeColorChanged(
  state: AppState,
  id: string,
  prop: 'fill' | 'stroke',
  color: string
): AppState {
  return {
    ...state,
    shapes: state.shapes.map((s) =>
      s.id === id ? { ...s, [prop]: color } : s
    ),
  }
}
