import { match } from 'disc-union'
import type { AppState } from './state'
import { initialState } from './state'
import type { AppAction } from './actions'
import * as handlers from './handlers'

// Actions that require history push BEFORE executing
const UNDOABLE_ACTIONS = new Set([
  'drawing/ended',
  'selection/clicked',
  'marquee/ended',
  'shape/colorChanged',
  'resize/started', // Push before resize starts (state modified during moved)
  'lineEndpoint/started', // Push before endpoint drag starts
  // move/started NOT here - handled specially in move/ended
  'clipboard/cut',
  'clipboard/paste',
  'selection/delete',
])

export function reducer(
  state: AppState = initialState,
  action: AppAction
): AppState {
  // Push history before undoable actions
  let stateForAction = state
  if (UNDOABLE_ACTIONS.has(action.type)) {
    stateForAction = handlers.pushHistory(state)
  }

  return match(
    action,
    {
      'app/started': () => stateForAction,
      'tool/selected': ({ tool }) =>
        handlers.handleToolSelected(stateForAction, tool),
      'drawing/started': ({ x, y }) => ({
        ...stateForAction,
        drawing: { startX: x, startY: y, currentX: x, currentY: y },
      }),
      'drawing/moved': ({ x, y }) =>
        handlers.handleDrawingMoved(stateForAction, x, y),
      'drawing/ended': () => handlers.handleDrawingEnded(stateForAction),
      'viewport/resized': ({ width, height }) =>
        handlers.handleViewportResized(stateForAction, width, height),
      'selection/clicked': ({ x, y, shiftKey }) =>
        handlers.handleSelectionClicked(stateForAction, x, y, shiftKey),
      'marquee/started': ({ x, y }) => ({
        ...stateForAction,
        marquee: { startX: x, startY: y, currentX: x, currentY: y },
      }),
      'marquee/moved': ({ x, y }) =>
        handlers.handleMarqueeMoved(stateForAction, x, y),
      'marquee/ended': ({ shiftKey }) =>
        handlers.handleMarqueeEnded(stateForAction, shiftKey),
      'shape/positionChanged': ({ id, axis, rawValue }) =>
        handlers.handleShapePositionChanged(stateForAction, id, axis, rawValue),
      'shape/sizeChanged': ({ id, dim, rawValue }) =>
        handlers.handleShapeSizeChanged(stateForAction, id, dim, rawValue),
      'shape/colorChanged': ({ id, prop, color }) =>
        handlers.handleShapeColorChanged(stateForAction, id, prop, color),
      'resize/started': ({ handle, x, y }) =>
        handlers.handleResizeStarted(stateForAction, handle, x, y),
      'resize/moved': ({ x, y }) =>
        handlers.handleResizeMoved(stateForAction, x, y),
      'resize/ended': () => ({ ...stateForAction, resize: null }),
      'lineEndpoint/started': ({ endpoint, x, y }) =>
        handlers.handleLineEndpointStarted(stateForAction, endpoint, x, y),
      'lineEndpoint/moved': ({ x, y }) =>
        handlers.handleLineEndpointMoved(stateForAction, x, y),
      'lineEndpoint/ended': () => ({
        ...stateForAction,
        lineEndpointDrag: null,
      }),
      'move/started': ({ x, y }) =>
        handlers.handleMoveStarted(stateForAction, x, y),
      'move/moved': ({ x, y }) =>
        handlers.handleMoveMoved(stateForAction, x, y),
      'move/ended': () => handlers.handleMoveEnded(stateForAction),
      'clipboard/copy': () => handlers.handleClipboardCopy(stateForAction),
      'clipboard/cut': () => handlers.handleClipboardCut(stateForAction),
      'clipboard/paste': () => handlers.handleClipboardPaste(stateForAction),
      'selection/delete': () => handlers.handleSelectionDelete(stateForAction),
      'pan/started': ({ x, y }) =>
        handlers.handlePanStarted(stateForAction, x, y),
      'pan/moved': ({ x, y }) => handlers.handlePanMoved(stateForAction, x, y),
      'pan/ended': () => ({ ...stateForAction, pan: null }),
      'pan/reset': () => handlers.handlePanReset(stateForAction),
      'spacebar/pressed': () => handlers.handleSpacebarPressed(stateForAction),
      'spacebar/released': () =>
        handlers.handleSpacebarReleased(stateForAction),
      'history/undo': () => handlers.handleUndo(stateForAction),
      'history/redo': () => handlers.handleRedo(stateForAction),
      'mouse/moved': ({ x, y }) => ({
        ...stateForAction,
        mouseX: Math.round(x),
        mouseY: Math.round(y),
      }),
      'mouse/left': () => ({ ...stateForAction, mouseX: null, mouseY: null }),
    },
    () => stateForAction
  )
}
