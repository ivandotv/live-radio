import { t } from '@lingui/macro'

export const layout = {
  playerHeight: 73,
  mobileMenuHeight: 56,
  topBarHeight: 56,
  mainContentSpacer: 16
} as const

export const userAgentName = 'Live Radio'
export const url = process.env.NEXT_PUBLIC_VERCEL_URL!.replace(/\/$/, '')
export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === 'true'

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
