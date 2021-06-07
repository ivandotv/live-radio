import { t } from '@lingui/macro'
import linguiConfig from '../lingui.config'
export const userAgentName = 'Live Radio'
export const isProduction = process.env.NODE_ENV === 'production'
export const url =
  process.env.VERCEL_ENV === 'production'
    ? 'https://live-radio.vercel.app'
    : process.env.NEXT_PUBLIC_VERCEL_URL!.replace(/\/$/, '')

export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === 'true'

export const vercelEnv = process.env.VERCEL_ENV ?? ''

// export const serviceWorkerEnabled =
//   isProduction || process.env.SERVICE_WORKER === 'true'

export const serviceWorkerEnabled = true

export const locales = [...linguiConfig.locales]

console.log('===== APP CONFIG ======')
console.log({ locales })

export const db = {
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGO_DB_NAME
}

export const auth = {
  github: {
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string
  },
  google: {
    clientId: process.env.GOOGLE_ID as string,
    clientSecret: process.env.GOOGLE_SECRET as string
  },
  signSecret: process.env.AUTH_SIGN_SECRET,
  debug: Boolean(process.env.DEBUG_AUTH) ?? false
}

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
