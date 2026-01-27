import { discUnion, type DiscUnionOf } from 'disc-union'
import type { Tool, HandlePosition } from './state'

export const AppActions = discUnion(
  {
    'app/started': () => ({}),
    'tool/selected': (tool: Tool) => ({ tool }),
    'drawing/started': (x: number, y: number) => ({ x, y }),
    'drawing/moved': (x: number, y: number) => ({ x, y }),
    'drawing/ended': () => ({}),
    'viewport/resized': (width: number, height: number) => ({ width, height }),
    'selection/clicked': (x: number, y: number, shiftKey: boolean) => ({
      x,
      y,
      shiftKey,
    }),
    'marquee/started': (x: number, y: number) => ({ x, y }),
    'marquee/moved': (x: number, y: number) => ({ x, y }),
    'marquee/ended': (shiftKey: boolean) => ({ shiftKey }),
    'shape/positionChanged': (
      id: string,
      axis: 'x' | 'y',
      rawValue: string
    ) => ({ id, axis, rawValue }),
    'shape/sizeChanged': (
      id: string,
      dim: 'width' | 'height',
      rawValue: string
    ) => ({ id, dim, rawValue }),
    'shape/colorChanged': (
      id: string,
      prop: 'fill' | 'stroke',
      color: string
    ) => ({ id, prop, color }),
    'resize/started': (handle: HandlePosition, x: number, y: number) => ({
      handle,
      x,
      y,
    }),
    'resize/moved': (x: number, y: number) => ({ x, y }),
    'resize/ended': () => ({}),
    'lineEndpoint/started': (
      endpoint: 'start' | 'end',
      x: number,
      y: number
    ) => ({ endpoint, x, y }),
    'lineEndpoint/moved': (x: number, y: number) => ({ x, y }),
    'lineEndpoint/ended': () => ({}),
    'move/started': (x: number, y: number) => ({ x, y }),
    'move/moved': (x: number, y: number) => ({ x, y }),
    'move/ended': () => ({}),
    'clipboard/copy': () => ({}),
    'clipboard/cut': () => ({}),
    'clipboard/paste': () => ({}),
    'selection/delete': () => ({}),
    'pan/started': (x: number, y: number) => ({ x, y }),
    'pan/moved': (x: number, y: number) => ({ x, y }),
    'pan/ended': () => ({}),
    'pan/reset': () => ({}),
    'spacebar/pressed': () => ({}),
    'spacebar/released': () => ({}),
    'history/undo': () => ({}),
    'history/redo': () => ({}),
    'mouse/moved': (x: number, y: number) => ({ x, y }),
    'mouse/left': () => ({}),
  },
  'type'
)

export type AppAction = DiscUnionOf<typeof AppActions>
