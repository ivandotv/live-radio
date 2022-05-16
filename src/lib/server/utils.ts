import * as Sentry from '@sentry/nextjs'
import { countries } from 'generated/countries'
import { logger } from 'lib/server/logger'
import { RadioDTO } from 'lib/shared/utils'
import {
  GetStaticProps,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse
} from 'next'
import { isProduction } from 'lib/server/config'

export type StationCollection = 'favorites' | 'recent'

export interface IRadioRepository {
  // getStations(ids: string[]): Promise<RadioDTO[]>
  getUserCollection(
    id: string,
    collection: StationCollection
  ): Promise<string[]>
  save(
    userId: string,
    station: RadioDTO,
    collectionName: StationCollection
  ): Promise<void>
  delete(
    userId: string,
    stationId: string,
    collectionName: StationCollection
  ): Promise<boolean>
  // createStation(station: RadioDTO): Promise<void>
  import(
    userId: string,
    data: { station: RadioDTO; date: string }[],
    collectionName: StationCollection
  ): Promise<void>
}
/**
 * Handle uncaught api errors
 */
export function onError(err: any, _req: NextApiRequest, res: NextApiResponse) {
  if (isProduction) {
    Sentry.captureException(err)
  }
  logger.warn(err)
  res.status(500).json({
    msg: 'Internal Server Error',
    debug: isProduction ? undefined : err.toString()
  })
}

/**
 * Handle 404 api requests
 */
export function onNoMatch(req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({
    msg: 'Resource not found',
    debug: isProduction
      ? undefined
      : {
          url: req.url,
          query: req.query,
          method: req.method,
          headers: req.headers
        }
  })
}

export function withErrorLogging(handler: NextApiHandler) {
  if (isProduction) {
    return Sentry.withSentry(handler)
  }

  return (req: NextApiRequest, res: NextApiResponse) => {
    return handler(req, res)
  }
}

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

export async function loadTranslations(locale: string) {
  let data
  if (isProduction) {
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
  const messages = await loadTranslations(locale!)

  return {
    props: {
      translation: messages
    }
  }
}
