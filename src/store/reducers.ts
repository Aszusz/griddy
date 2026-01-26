import { match } from 'disc-union'
import type { AppState } from './state'
import { initialState } from './state'
import type { AppAction } from './actions'
import * as handlers from './handlers'

export function reducer(
  state: AppState = initialState,
  action: AppAction
): AppState {
  return match(
    action,
    {
      'app/started': () => state,
      'tool/selected': ({ tool }) => handlers.handleToolSelected(state, tool),
      'drawing/started': ({ x, y }) => ({
        ...state,
        drawing: { startX: x, startY: y, currentX: x, currentY: y },
      }),
      'drawing/moved': ({ x, y }) => handlers.handleDrawingMoved(state, x, y),
      'drawing/ended': () => handlers.handleDrawingEnded(state),
      'viewport/resized': ({ width, height }) =>
        handlers.handleViewportResized(state, width, height),
      'selection/clicked': ({ x, y, shiftKey }) =>
        handlers.handleSelectionClicked(state, x, y, shiftKey),
      'marquee/started': ({ x, y }) => ({
        ...state,
        marquee: { startX: x, startY: y, currentX: x, currentY: y },
      }),
      'marquee/moved': ({ x, y }) => handlers.handleMarqueeMoved(state, x, y),
      'marquee/ended': () => handlers.handleMarqueeEnded(state),
      'shape/positionChanged': ({ id, axis, rawValue }) =>
        handlers.handleShapePositionChanged(state, id, axis, rawValue),
      'shape/sizeChanged': ({ id, dim, rawValue }) =>
        handlers.handleShapeSizeChanged(state, id, dim, rawValue),
      'shape/colorChanged': ({ id, prop, color }) =>
        handlers.handleShapeColorChanged(state, id, prop, color),
      'resize/started': ({ handle, x, y }) =>
        handlers.handleResizeStarted(state, handle, x, y),
      'resize/moved': ({ x, y }) => handlers.handleResizeMoved(state, x, y),
      'resize/ended': () => ({ ...state, resize: null }),
      'lineEndpoint/started': ({ endpoint, x, y }) =>
        handlers.handleLineEndpointStarted(state, endpoint, x, y),
      'lineEndpoint/moved': ({ x, y }) =>
        handlers.handleLineEndpointMoved(state, x, y),
      'lineEndpoint/ended': () => ({ ...state, lineEndpointDrag: null }),
      'move/started': ({ x, y }) => handlers.handleMoveStarted(state, x, y),
      'move/moved': ({ x, y }) => handlers.handleMoveMoved(state, x, y),
      'move/ended': () => ({ ...state, move: null }),
      'clipboard/copy': () => handlers.handleClipboardCopy(state),
      'clipboard/cut': () => handlers.handleClipboardCut(state),
      'clipboard/paste': () => handlers.handleClipboardPaste(state),
      'selection/delete': () => handlers.handleSelectionDelete(state),
      'pan/started': ({ x, y }) => handlers.handlePanStarted(state, x, y),
      'pan/moved': ({ x, y }) => handlers.handlePanMoved(state, x, y),
      'pan/ended': () => ({ ...state, pan: null }),
      'pan/reset': () => handlers.handlePanReset(state),
      'spacebar/pressed': () => handlers.handleSpacebarPressed(state),
      'spacebar/released': () => handlers.handleSpacebarReleased(state),
    },
    () => state
  )
}
