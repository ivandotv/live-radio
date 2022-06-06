import * as Sentry from '@sentry/nextjs'
import { CaptureContext } from '@sentry/types'
import { countries } from 'generated/countries'
import { ServerConfig } from 'lib/server/config'
import { GetStaticProps } from 'next'
// @ts-expect-error - no types for module
import { getStationInfo as getSongInfoCb } from 'node-internet-radio'
import pino from 'pino'
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

  if (config.isProduction) {
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
  return (err: any, context?: CaptureContext, url?: string) => {
    const side = 'backend'

    const data = {
      ...context,
      extra: {
        // @ts-expect-error - Sentry typings
        ...(context.extra ? { ...context.extra } : {}),
        url
      },
      tags: {
        // @ts-expect-error - Sentry typings
        ...(context.tags ? { ...context.tags } : {}),
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
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
  }
}
