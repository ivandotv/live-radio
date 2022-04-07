import * as Sentry from '@sentry/nextjs'
import Tinga from 'tinga'

export const logger = class extends Tinga {
  override error(...args: any[]) {
    for (const arg of args) {
      if (arg[0] instanceof Error) {
        Sentry.captureException(arg[0], { extra: { args: arg.slice(1) } })
      }
    }

    super.error(...args)
  }
}
