import * as Sentry from '@sentry/nextjs'
import { CaptureContext } from '@sentry/types'
import { countries } from 'generated/countries'
import type { ServerConfig } from 'lib/server/config'
import { GetStaticProps } from 'next'
import { Koa } from 'nextjs-koa-api'
// @ts-expect-error - no types for module
import { getStationInfo as getSongInfoCb } from 'node-internet-radio'
import type pino from 'pino'
import { promisify } from 'util'
import { getServerContainer } from './injection-root'

export type StationCollection = 'favorites' | 'recent'

// promisify the function
getSongInfoCb[promisify.custom] = (url: string, stream: string) => {
  return new Promise((resolve, reject) => {
    getSongInfoCb(
      url,
      (error: Error, data: any) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      },
      stream
    )
  })
}

export const getSongInfo =
  promisify<(url: string, source: string) => Promise<{ title: string }>>(
    getSongInfoCb
  )

export function countryDataByKey(key: 'code' | 'name' | 'flag', value: string) {
  const countryData = countries()
  for (const [_i, continent] of Object.entries(countryData)) {
    for (const [_i, country] of Object.entries(continent)) {
      if (country[key].toLowerCase() === value.toLowerCase()) {
        return country
      }
    }
  }
}

export function paramsWithLocales<T = any>(
  props: T[],
  locales: string[]
): {
  params: T
  locale: string
}[] {
  return props.flatMap((prop) => {
    return locales.map((locale) => {
      return {
        params: prop,
        locale
      }
    })
  })
}

export async function importTranslations(locale: string) {
  let data
  const config = getServerContainer().resolve<ServerConfig>('config')

  if (config.isProduction || config.isTest) {
    data = await import(`../../translations/locales/${locale}/messages`)
  } else {
    data = await import(
      `@lingui/loader!../../translations/locales/${locale}/messages.po`
    )
  }

  return data.messages
}

export const getStaticTranslations: GetStaticProps<
  { translation: any },
  { locale: string }
> = async function getStaticTranslations({ locale }) {
  const messages = await importTranslations(locale!)

  return {
    props: {
      translation: messages
    }
  }
}

logServerError.inject = ['logger', 'config']
export function logServerError(logger: pino.Logger, config: ServerConfig) {
  return (
    err: any,
    koaCtx?: Koa.DefaultContext,
    sentryCtx?: CaptureContext
  ) => {
    const side = 'backend'

    const data = {
      ...sentryCtx,
      extra: {
        // @ts-expect-error - Sentry typings
        ...(sentryCtx?.extra ? { ...sentryCtx.extra } : {}),
        url: koaCtx?.url
      },
      tags: {
        endpoint: koaCtx?.request.path,
        // @ts-expect-error - Sentry typings
        ...(sentryCtx?.tags ? { ...sentryCtx.tags } : {}),
        side
      }
    }
    if (config.isProduction) {
      Sentry.captureException(err, data)
    }

    logger.error(err, err.message || '', data)
  }
}

export async function fetchIpInfo(ip: string) {
  const response = await fetch(`http://ip-api.com/json/${ip}`)

  if (response.ok) {
    return (await response.json()) as unknown as { countryCode: string }
  }
}

export class ServerError extends Error {
  status: number

  logIt: boolean

  diagnostics?: Record<string, any>

  body?: Record<string, any>

  constructor(opts?: {
    message?: string
    status?: number
    expose?: boolean
    body?: Record<string, any>
    logIt?: boolean
    diagnostics?: Record<string, any>
  }) {
    let message = 'Internal server error'
    if (opts?.message) {
      message = opts.message
    } else {
      if (opts?.body?.msg) {
        message = opts.body.msg
      }
    }

    super(message)

    this.status = opts?.status || 500
    this.logIt = opts?.logIt || true
    this.diagnostics = opts?.diagnostics

    if (opts?.body) {
      this.body = opts.body
      if (message && opts.body.message === undefined) {
        this.body.msg = message
      }
    }
  }
}
