import { WorkboxPlugin } from 'workbox-core/types'
import { PrecacheController } from 'workbox-precaching/PrecacheController'
import { getOrCreatePrecacheController } from 'workbox-precaching/utils/getOrCreatePrecacheController'
import { pathToRegexp } from 'path-to-regexp'
import { locales } from 'browser-config'

// const regexp = pathToRegexp('/:locale/')
const regexp = pathToRegexp('/:locale/:bar*')

export class OfflineFallbackWithLocale implements WorkboxPlugin {
  constructor(
    private readonly fallbackUrl: string,
    private readonly precacheController: PrecacheController = getOrCreatePrecacheController()
  ) {}

  async handlerDidError({ request }: { request: Request }) {
    const locale = this.getLocaleFromUrlPath(new URL(request.url).pathname)

    console.log('locale found -> ', locale)

    let fallback: string
    if (locale) {
      //localized fallback page
      fallback = this.fallbackUrl.replace('[locale]', locale)
    } else {
      // default offline page
      fallback = this.fallbackUrl.replace('[locale]-', '')
    }

    return this.precacheController.matchPrecache(fallback)
  }

  protected getLocaleFromUrlPath(url: string) {
    const pathToLocale = regexp.exec(url)
    if (pathToLocale) {
      const locale = pathToLocale[1]
      if (locales.includes(locale)) {
        return locale
      }
    }
  }
}
