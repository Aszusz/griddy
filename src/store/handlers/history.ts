import type { AppState, UndoableState } from '../state'
import { MAX_HISTORY_SIZE } from '../state'

function trimHistory(past: UndoableState[]): UndoableState[] {
  if (past.length > MAX_HISTORY_SIZE) {
    return past.slice(1)
  }
  return past
}

export function pushHistory(state: AppState): AppState {
  const current: UndoableState = {
    shapes: state.shapes,
    selectedIds: state.selectedIds,
  }
  return {
    ...state,
    past: trimHistory([...state.past, current]),
    future: [],
  }
}

export function pushHistoryEntry(
  state: AppState,
  entry: UndoableState
): AppState {
  return {
    ...state,
    past: trimHistory([...state.past, entry]),
    future: [],
  }
}

export function handleUndo(state: AppState): AppState {
  if (state.past.length === 0) return state

  const previous = state.past[state.past.length - 1]
  const current: UndoableState = {
    shapes: state.shapes,
    selectedIds: state.selectedIds,
  }

  return {
    ...state,
    shapes: previous.shapes,
    selectedIds: previous.selectedIds,
    past: state.past.slice(0, -1),
    future: [current, ...state.future],
  }
}

export function handleRedo(state: AppState): AppState {
  if (state.future.length === 0) return state

  const next = state.future[0]
  const current: UndoableState = {
    shapes: state.shapes,
    selectedIds: state.selectedIds,
  }

  return {
    ...state,
    shapes: next.shapes,
    selectedIds: next.selectedIds,
    past: [...state.past, current],
    future: state.future.slice(1),
  }
}
