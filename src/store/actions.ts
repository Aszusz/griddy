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
    'marquee/ended': () => ({}),
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
  },
  'type'
)

export type AppAction = DiscUnionOf<typeof AppActions>
