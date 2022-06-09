import { i18n } from '@lingui/core'
import parser from 'accept-language-parser'
import { ApiContext, ApiState } from 'lib/server/api/shared-middleware'
import createManifest from 'lib/server/create-manifest'
import { ServerError } from 'lib/server/server-error'
import { importTranslations } from 'lib/server/utils'
import { en, sr } from 'make-plural/plurals'
import { Koa } from 'nextjs-koa-api'

// chache generated manifest by locale
const cacheManifest: Record<string, unknown> = {}

export async function geolocation(
  ctx: Koa.ParameterizedContext<ApiState, ApiContext>,
  next: Koa.Next
) {
  const { requestIp, countryDataByKey, fetchIpInfo } = ctx.deps

  const detectedIp = requestIp.getClientIp(ctx.req)

  // if localhost is detected , send empty string
  const queryIp =
    detectedIp?.indexOf('::') !== -1 || detectedIp === '127.0.0.1'
      ? ''
      : detectedIp

  if (!queryIp.length) {
    throw new ServerError({
      status: 503,
      body: { msg: `can't detect ip` }
    })
  }

  const data = await fetchIpInfo(queryIp)

  if (!data) {
    throw new ServerError({
      status: 503,
      body: { msg: `can't fetch ip info` }
    })
  }

  const countryData = countryDataByKey('code', data.countryCode)

  if (!countryData) {
    throw new ServerError({
      status: 503,
      body: {
        msg: `Can't parse location data`
      }
    })
  }

  ctx.body = countryData

  return next()
}

/**
 * Generate manifest depending on the locale path that is used
 * Generally there are three ways to generate manifest
 * 1. check the locale via referer header
 * 2. check for accept-language header ✅
 * 3. check for NEXT_LOCALE cookie ( set by next.js)
 * 4. use a query parameter
 *  */
export async function getManifest(
  ctx: Koa.ParameterizedContext<ApiState, ApiContext & { locale: string }>,
  next: Koa.Next
) {
  i18n.loadLocaleData({
    en: { plurals: en },
    sr: { plurals: sr },
    pseudo: { plurals: en } // english plurals for pseudo
  })

  const { config } = ctx.deps

  const { locale } = ctx

  //respond from temp cache
  if (config.isProduction && cacheManifest[locale]) {
    ctx.body = cacheManifest[locale]
  } else {
    const translations = await importTranslations(locale)

    i18n.load(locale, translations)
    i18n.activate(locale)

    const { sharedConfig } = ctx.deps
    const manifest = createManifest(`${sharedConfig.url}/${locale}/app`)

    //cache generated manifest
    cacheManifest[locale] = manifest

    ctx.body = manifest
  }

  return next()
}

export async function share(
  ctx: Koa.ParameterizedContext<
    ApiState,
    ApiContext & { request: { query: { play?: string } }; locale: string }
  >,
  next: Koa.Next
) {
  const { play } = ctx.request.query

  ctx.status = 302

  if (!play) {
    //go to index
    ctx.redirect('/')
  } else {
    const playEncoded = `?play=${encodeURIComponent(play)}`

    const { locale } = ctx
    if (!locale) {
      // default language
      ctx.redirect(`/app${playEncoded}`)
    } else {
      // custom language
      ctx.redirect(`/${locale}/app${playEncoded}`)
    }
  }

  return next()
}

export function pickLocale(ctx: ApiContext, next: Koa.Next) {
  const { sharedConfig } = ctx.deps
  const localeCookie = ctx.cookies.get('NEXT_LOCALE')

  let locale

  if (localeCookie) {
    locale = parser.pick(sharedConfig.locales as string[], localeCookie)
  }

  if (!locale) {
    locale = parser.pick(
      sharedConfig.locales as string[],
      ctx.request.headers['accept-language'] || ''
    )
  }

  ctx.locale = locale || sharedConfig.defaultLocale

  return next()
}
