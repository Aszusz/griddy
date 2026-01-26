import { discUnion, type DiscUnionOf } from 'disc-union'
import type { Tool } from './state'

export const AppActions = discUnion(
  {
    'app/started': () => ({}),
    'tool/selected': (tool: Tool) => ({ tool }),
    'drawing/started': (x: number, y: number) => ({ x, y }),
    'drawing/moved': (x: number, y: number) => ({ x, y }),
    'drawing/ended': () => ({}),
    'viewport/resized': (width: number, height: number) => ({ width, height }),
  },
  'type'
)

export type AppAction = DiscUnionOf<typeof AppActions>
