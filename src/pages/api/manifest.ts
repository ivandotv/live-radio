import { i18n } from '@lingui/core'
import { defaultLocale } from 'browser-config'
import createManifest from 'lib/create-manifest'
import { loadTranslations } from 'lib/translations'
import { en, sr } from 'make-plural/plurals'
import { NextApiRequest, NextApiResponse } from 'next'

i18n.loadLocaleData({
  en: { plurals: en },
  sr: { plurals: sr },
  xx: { plurals: en } // english plurals for pseudo
})

// chache generated manifest by locale
const cacheManifest: Record<string, {}> = {}

/**
 * Generate manifest depending on the locale path that is used
 * Generally there are three ways to generate manifest
 * 1. check the locale via referer header
 * 2. check for accept-language header
 * 3. check for NEXT_LOCALE cookie ( set by next.js)
 *
 * I'm using option 1 because next.js only checks for locale on the root of the site
 * so user could be looking at locale that is different than the "accept-languge" header
 * I' need to dynamically change manifest "start_url" depending on the path used
 * TODO - separate translation files from the app (save on size)
 *  */

export default async function generateManifest(
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
  // eslint-disable-next-line
  cacheManifest[locale] = translations
  i18n.load(locale, translations)
  i18n.activate(locale)

  const manifest = createManifest(`../${locale}`)

  // eslint-disable-next-line
  cacheManifest[locale] = manifest

  res.send(manifest)
}
