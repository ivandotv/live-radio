import * as Sentry from '@sentry/nextjs'
import Tinga from 'tinga'
import { logLevel } from 'browser-config'

class Logger extends Tinga {
  override error(...args: any[]) {
    for (const arg of args) {
      if (arg[0] instanceof Error) {
        Sentry.captureException(arg[0], { extra: { args: arg.slice(1) } })
      }
    }

    super.error(...args)
  }
}
export const logger = new Logger({
  level: logLevel
})
