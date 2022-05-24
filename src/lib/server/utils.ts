import * as Sentry from '@sentry/nextjs'
import { CaptureContext } from '@sentry/types'
import { countries } from 'generated/countries'
import { isProduction } from 'lib/server/config'
import { logger } from 'lib/server/logger'
import {
  GetStaticProps,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse
} from 'next'

export type StationCollection = 'favorites' | 'recent'

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

export function logServerError(
  err: any,
  context: CaptureContext = {},
  url?: string
) {
  const side = 'backend'

  const data = {
    ...context,
    extra: {
      // @ts-expect-error - Sentry typings
      ...context.extra,
      url
    },
    tags: {
      // @ts-expect-error - Sentry typings
      ...context.tags,
      side
    }
  }
  if (isProduction) {
    Sentry.captureException(err, data)
  }

  logger.error(err, err.message || '', data)
}
