import * as Sentry from '@sentry/nextjs'
import { logLevel } from 'browser-config'
import Tinga from 'tinga'

export const logger = new Tinga({
  level: logLevel,
  processData: (ctx, data, info) => {
    if (info.level.name === 'error') {
      if (data[0] instanceof Error) {
        Sentry.captureException(data[0], { extra: { args: data.slice(1) } })
      }
    }

    return {
      ctx,
      data
    }
  }
})
