import { i18n } from '@lingui/core'
import { defaultLocale } from 'browser-config'
import { withErrorLogging } from 'lib/api/api-utils'
import createManifest from 'lib/create-manifest'
import { loadTranslations } from 'lib/utils/taranslation-utils'
import { en, sr } from 'make-plural/plurals'
import { NextApiRequest, NextApiResponse } from 'next'

i18n.loadLocaleData({
  en: { plurals: en },
  sr: { plurals: sr },
  pseudo: { plurals: en } // english plurals for pseudo
})

// chache generated manifest by locale
const cacheManifest: Record<string, unknown> = {}

/**
 * Generate manifest depending on the locale path that is used
 * Generally there are three ways to generate manifest
 * 1. check the locale via referer header
 * 2. check for accept-language header
 * 3. check for NEXT_LOCALE cookie ( set by next.js)
 * 4. use a query parameter
 *  */

const handler = async function generateManifest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const locale = (req.query.locale as string) || defaultLocale

  //cache generated manifest
  if (cacheManifest[locale]) {
    res.send(cacheManifest[locale])

    return
  }

  const translations = await loadTranslations(locale)

  cacheManifest[locale] = translations
  i18n.load(locale, translations)
  i18n.activate(locale)

  const manifest = createManifest(`../${locale}`)

  cacheManifest[locale] = manifest

  res.send(manifest)
}

export default withErrorLogging(handler)
