import * as Sentry from '@sentry/nextjs'
import { logLevel, remoteLogLevel, remoteLogUrl } from 'browser-config'
import { Tinga } from 'tinga'

export class BrowserLogger extends Tinga {
  override error(...args: any[]): void {
    if (args[0] instanceof Error) {
      Sentry.captureException(args[0], { extra: { args: args.slice(1) } })
    }
    super.error(...args)
  }
}

export const logger = new BrowserLogger({
  level: logLevel,
  remote: {
    url: remoteLogUrl,
    level: remoteLogLevel
  }
})
