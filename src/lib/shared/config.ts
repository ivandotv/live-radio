import { toBoolean } from 'lib/shared/utils'
import { LevelsByName } from 'tinga'
import linguiConfig from '../../../lingui.config.js'

/**
 * ! This file holds configuration options that can be used
 * ! in the browser as well on the server
 */

const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV as typeof process.env.NODE_ENV

export type SharedConfig = typeof SHARED_CONFIG

export const SHARED_CONFIG = Object.freeze({
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
  isPreview: process.env.NEXT_PUBLIC_APP_ENV === 'preview',
  url:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? 'https://live-radio.vercel.app'
      : process.env.NEXT_PUBLIC_VERCEL_URL
      ? process.env.NEXT_PUBLIC_VERCEL_URL!.replace(/\/$/, '')
      : 'http://localhost:3000',

  logLevel: (process.env.NEXT_PUBLIC_BROWSER_LOG_LEVEL ||
    'silent') as LevelsByName,

  locales: [...linguiConfig.locales],
  defaultLocale: linguiConfig.fallbackLocales.default,

  radioAPIUserAgent: 'Live Radio',

  localDbName: 'LiveRadio',

  layout: {
    playerHeight: 73,
    mobileMenuHeight: 56,
    topBarHeight: 56,
    mainContentSpacer: 16,
    desktopDrawerWidth: 270
  } as const,

  defaultArtwork: {
    src: '/pwa-icons/manifest-icon-512.png',
    sizes: '512x512',
    type: 'image/png'
  },

  colors: {
    favoritesHeartColor: '#ff0000'
  },

  serviceWorker: {
    path: '/sw.js',
    scope: '/',
    enable: toBoolean(process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER, false),
    enableReload: toBoolean(
      process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER_RELOAD,
      false
    )
  },

  defaultStation: {
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
  },
  stationSearchIndexes: [
    'data.language',
    'data.country',
    'data.tags',
    'data.continent',
    'data.name'
  ],
  cookies: {
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
  },
  enablePWAInstallBanner: toBoolean(
    process.env.NEXT_PUBLIC_ENABLE_PWA_INSTALL,
    false
  )
} as const)
