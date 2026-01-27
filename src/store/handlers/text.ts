import type { AppState, TextShape } from '../state'
import { isTextShape } from '../../utils'

export function handleTextStartEdit(state: AppState, id: string): AppState {
  return { ...state, editingTextId: id }
}

export function handleTextStopEdit(state: AppState): AppState {
  if (!state.editingTextId) return state

  // Find the text shape being edited
  const textShape = state.shapes.find((s) => s.id === state.editingTextId) as
    | TextShape
    | undefined

  // If text is empty or whitespace only, remove the shape
  if (textShape && (!textShape.text || textShape.text.trim() === '')) {
    return {
      ...state,
      shapes: state.shapes.filter((s) => s.id !== state.editingTextId),
      selectedIds: state.selectedIds.filter((id) => id !== state.editingTextId),
      editingTextId: null,
    }
  }

  return { ...state, editingTextId: null }
}

export function handleTextUpdateContent(
  state: AppState,
  id: string,
  text: string
): AppState {
  return {
    ...state,
    shapes: state.shapes.map((s) =>
      s.id === id && isTextShape(s) ? { ...s, text } : s
    ),
  }
}

export function handleTextFontChanged(
  state: AppState,
  id: string,
  fontFamily: 'serif' | 'sans' | 'mono'
): AppState {
  return {
    ...state,
    shapes: state.shapes.map((s) =>
      s.id === id && isTextShape(s) ? { ...s, fontFamily } : s
    ),
  }
}

export function handleTextAlignChanged(
  state: AppState,
  id: string,
  align: 'left' | 'center' | 'right'
): AppState {
  return {
    ...state,
    shapes: state.shapes.map((s) =>
      s.id === id && isTextShape(s) ? { ...s, align } : s
    ),
  }
}
