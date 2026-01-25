import type { Middleware } from 'redux'
import { defaultEffects, type Effects } from '../effects'

export const createLogger =
  ({ log, now }: Effects = defaultEffects): Middleware =>
  () =>
  (next) =>
  (action) => {
    log(`[${now().toISOString()}] ${JSON.stringify(action)}`)
    return next(action)
  }

export const logger = createLogger()
