import * as Sentry from '@sentry/nextjs'
import { isProduction, logLevel } from 'lib/shared/config'
import Tinga from 'tinga'
/* Frontend logger */
class Logger extends Tinga {
  override error(...args: any[]) {
    if (isProduction) {
      for (const arg of args) {
        if (arg[0] instanceof Error) {
          Sentry.captureException(arg[0], {
            extra: { args: arg.slice(1) },
            tags: {
              scope: 'client'
            }
          })
        }
      }
    }

    super.error(...args)
  }
}

export const logger = new Logger({
  level: logLevel
})
