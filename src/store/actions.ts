import { discUnion, type DiscUnionOf } from 'disc-union'
import type { Tool } from './state'

export const AppActions = discUnion(
  {
    'app/started': () => ({}),
    'tool/selected': (tool: Tool) => ({ tool }),
    'drawing/started': (x: number, y: number) => ({ x, y }),
    'drawing/moved': (x: number, y: number) => ({ x, y }),
    'drawing/ended': () => ({}),
  },
  'type'
)

export type AppAction = DiscUnionOf<typeof AppActions>
