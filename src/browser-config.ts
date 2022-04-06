import { t } from '@lingui/macro'
import { booleanEnv } from 'lib/utils/misc-utils'
import { LevelsByName } from 'tinga'
import linguiConfig from '../lingui.config'
/**
 * ! This file holds configuration options that can be used
 * ! in the browser as well on the server
 */

export const nodeEnv = process.env
  .NEXT_PUBLIC_NODE_ENV as typeof process.env.NODE_ENV

export const isProduction = nodeEnv === 'production'
export const isDevelopment = nodeEnv === 'development'
export const isPreview = process.env.NEXT_PUBLIC_APP_ENV === 'preview'

export const url =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://live-radio.vercel.app'
    : process.env.NEXT_PUBLIC_VERCEL_URL
    ? process.env.NEXT_PUBLIC_VERCEL_URL!.replace(/\/$/, '')
    : 'http://localhost:3000'

export const logLevel = (process.env.NEXT_PUBLIC_BROWSER_LOG_LEVEL ||
  'silent') as LevelsByName

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

export const colors = {
  favoritesHeartColor: '#ff0000'
}

export const serviceWorker = {
  path: '/sw.js',
  scope: '/',
  enable: booleanEnv(process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER, false),
  enableReload: booleanEnv(
    process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER_RELOAD,
    false
  )
}

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

export const enablePWAInstallBanner = booleanEnv(
  process.env.NEXT_PUBLIC_ENABLE_PWA_INSTALL,
  false
)

export const cookies = {
  pwaUpdated: {
    name: 'show_app_updated',
    value: '1',
    options: {
      sameSite: 'strict' as const
    }
  },
  pwaInstallDismissed: {
    name: 'pwa_install_dissmissed',
    value: '1',
    options: {
      expires: 1
    }
  },
  anonymousImportDissmissed: {
    name: 'anonymous_dissmissed',
    value: '1',
    options: {
      expires: 31 * 12, // ~ one year,
      path: '/',
      sameSite: 'strict' as const
    }
  },
  locale: {
    name: 'NEXT_LOCALE',
    options: {
      expires: 31, //one month,
      path: '/',
      sameSite: 'lax' as const
    }
  }
}

export const stationSearchIndexes = [
  'data.language',
  'data.country',
  'data.tags',
  'data.continent',
  'data.name'
]
