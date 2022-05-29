import { SHARED_CONFIG } from 'lib/shared/config'
import { pathToRegexp } from 'path-to-regexp'
import { WorkboxPlugin } from 'workbox-core/types'
import { PrecacheController } from 'workbox-precaching/PrecacheController'
import { getOrCreatePrecacheController } from 'workbox-precaching/utils/getOrCreatePrecacheController'

const regexp = pathToRegexp('/:locale/:bar*')

export class OfflineFallbackWithLocale implements WorkboxPlugin {
  constructor(
    private readonly fallbackUrl: string,
    private readonly precacheController: PrecacheController = getOrCreatePrecacheController()
  ) {}

  async handlerDidError({ request }: { request: Request }) {
    const locale = this.getLocaleFromUrlPath(new URL(request.url).pathname)

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
      if (SHARED_CONFIG.locales.includes(locale)) {
        return locale
      }
    }
  }
}
