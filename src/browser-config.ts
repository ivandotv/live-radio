import { t } from '@lingui/macro'
import { booleanEnv } from 'lib/utils/misc-utils'
import linguiConfig from '../lingui.config'
/**
 * ! This file holds configuration options that can be used
 * ! in the browser as well on the server
 */

export const url =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://live-radio.vercel.app'
    : process.env.NEXT_PUBLIC_VERCEL_URL
    ? process.env.NEXT_PUBLIC_VERCEL_URL!.replace(/\/$/, '')
    : 'http://localhost:3000'

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

export const defaultArtwork = {
  src: '/pwa-icons/manifest-icon-512.png',
  sizes: '512x512',
  type: 'image/png'
}

export const favoritesHeartColor = '#ff0000'
export const serviceWorkerPath = '/sw.js'
export const serviceWorkerScope = '/'

export const defaultStation = {
  _id: '961173b5-0601-11e8-ae97-52543be04c81',
  name: 'SomaFM Lush',
  url: 'https://ice.somafm.com/lush-128-mp3',
  homepage: 'https://www.somafm.com/',
  language: [],
  tags: [],
  flag: '',
  country: 'Internet',
  countryCode: '',
  continent: '',
  continentCode: '',
  codec: 'MP3'
}

export function sections() {
  return {
    app: t`Search`,
    favorites: t`Favorites`,
    custom: t`Custom Search`,
    recent: t`Recent Stations`,
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

export const enableServiceWorkerReload = booleanEnv(
  process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER_RELOAD,
  false
)

export const enablePWAInstallBanner = booleanEnv(
  process.env.NEXT_PUBLIC_ENABLE_PWA_INSTALL,
  false
)

export const pwaUpdatedCookieName = 'show_app_updated'

export const pwaInstallDismissedCookie = 'pwa_install_dissmissed'

export const anonymousImportDissmissed = 'anonymous_dissmissed'

export const stationSearchIndexes = [
  'data.language',
  'data.country',
  'data.tags',
  'data.continent',
  'data.name'
]
