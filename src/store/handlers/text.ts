import type { AppState, RectShape } from '../state'
import { isTextShape, isRectShape } from '../../utils'

export function handleTextStartEdit(state: AppState, id: string): AppState {
  return { ...state, editingTextId: id }
}

export function handleTextStopEdit(state: AppState): AppState {
  if (!state.editingTextId) return state

  const editingShape = state.shapes.find((s) => s.id === state.editingTextId)

  // For TextShape: remove if empty
  if (editingShape && isTextShape(editingShape)) {
    if (!editingShape.text || editingShape.text.trim() === '') {
      return {
        ...state,
        shapes: state.shapes.filter((s) => s.id !== state.editingTextId),
        selectedIds: state.selectedIds.filter(
          (id) => id !== state.editingTextId
        ),
        editingTextId: null,
      }
    }
  }

  // For RectShape: clear text property if empty
  if (editingShape && isRectShape(editingShape)) {
    const rectShape = editingShape as RectShape
    if (!rectShape.text || rectShape.text.trim() === '') {
      return {
        ...state,
        shapes: state.shapes.map((s) =>
          s.id === state.editingTextId && isRectShape(s)
            ? { ...s, text: undefined }
            : s
        ),
        editingTextId: null,
      }
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
    shapes: state.shapes.map((s) => {
      if (s.id !== id) return s
      if (isTextShape(s)) return { ...s, text }
      if (isRectShape(s)) {
        // Set default alignment when adding text for the first time
        const rect = s as RectShape
        return {
          ...rect,
          text,
          textAlign: rect.textAlign ?? 'center',
          textVAlign: rect.textVAlign ?? 'middle',
        }
      }
      return s
    }),
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

export function handleShapeTextHAlignChanged(
  state: AppState,
  id: string,
  textAlign: 'left' | 'center' | 'right'
): AppState {
  return {
    ...state,
    shapes: state.shapes.map((s) =>
      s.id === id && isRectShape(s) ? { ...s, textAlign } : s
    ),
  }
}

export function handleShapeTextVAlignChanged(
  state: AppState,
  id: string,
  textVAlign: 'top' | 'middle' | 'bottom'
): AppState {
  return {
    ...state,
    shapes: state.shapes.map((s) =>
      s.id === id && isRectShape(s) ? { ...s, textVAlign } : s
    ),
  }
}
