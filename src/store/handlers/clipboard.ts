import type { AppState, Shape } from '../state'
import { isLineShape } from '../../utils'
import { PASTE_OFFSET } from '../../constants'

export function handleClipboardCopy(state: AppState): AppState {
  if (state.activeTool !== 'select' || state.selectedIds.length === 0) {
    return state
  }
  const selectedShapes = state.shapes.filter((s) =>
    state.selectedIds.includes(s.id)
  )
  return { ...state, clipboard: { shapes: selectedShapes, pasteCount: 0 } }
}

export function handleClipboardCut(state: AppState): AppState {
  if (state.activeTool !== 'select' || state.selectedIds.length === 0) {
    return state
  }
  const selectedShapes = state.shapes.filter((s) =>
    state.selectedIds.includes(s.id)
  )
  return {
    ...state,
    shapes: state.shapes.filter((s) => !state.selectedIds.includes(s.id)),
    selectedIds: [],
    clipboard: { shapes: selectedShapes, pasteCount: 0 },
  }
}

export function handleClipboardPaste(state: AppState): AppState {
  if (state.activeTool !== 'select' || !state.clipboard) {
    return state
  }
  const offset = (state.clipboard.pasteCount + 1) * PASTE_OFFSET
  const newShapes: Shape[] = state.clipboard.shapes.map((s) => {
    if (isLineShape(s)) {
      return {
        ...s,
        id: crypto.randomUUID(),
        x: s.x + offset,
        y: s.y + offset,
        x2: s.x2 + offset,
        y2: s.y2 + offset,
      }
    }
    return { ...s, id: crypto.randomUUID(), x: s.x + offset, y: s.y + offset }
  })
  return {
    ...state,
    shapes: [...state.shapes, ...newShapes],
    selectedIds: newShapes.map((s) => s.id),
    clipboard: {
      ...state.clipboard,
      pasteCount: state.clipboard.pasteCount + 1,
    },
  }
}
