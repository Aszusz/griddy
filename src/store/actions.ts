import { discUnion, type DiscUnionOf } from 'disc-union'

export const AppActions = discUnion(
  {
    'app/started': () => ({}),
  },
  'type'
)

export type AppAction = DiscUnionOf<typeof AppActions>
