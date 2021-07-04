import { booleanEnv } from 'lib/utils'
import { t } from '@lingui/macro'
import linguiConfig from '../lingui.config'
/**
 *  This file holds configuration options that should also be available
 *  in the browser as well on the server
 */

export const locales = [...linguiConfig.locales]
export const defaultLocale = linguiConfig.fallbackLocales.default

export const userAgentName = 'Live Radio'

export const layout = {
  playerHeight: 73,
  mobileMenuHeight: 56,
  topBarHeight: 56,
  mainContentSpacer: 16,
  desktopDrawerWidth: 270
} as const

export function sections() {
  return {
    app: t`Search`,
    favorites: t`Favorites`,
    custom: t`Custom Search`,
    'recent-stations': t`Recent Stations`,
    'by-location': t`By Location`,
    'by-language': t`By Language`,
    'by-genre': t`By Genre`,
    settings: t`Settings`,
    about: t`About`
  }
}
export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === 'true'

export const enableServiceWorker = booleanEnv(
  process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER,
  false
)
export const enablePWAInstallBanner = booleanEnv(
  process.env.NEXT_PUBLIC_ENABLE_PWA_INSTALL,
  false
)
export const enableReloadBanner = booleanEnv(
  process.env.NEXT_PUBLIC_ENABLE_RELOAD_BANNER,
  false
)