import { t } from '@lingui/macro'

export default function createManifest(startUrl = '') {
  return {
    theme_color: '#4a90e2',
    background_color: '#4a90e2',
    display: 'standalone',
    scope: '/',
    id: 'live-radio',
    start_url: `${startUrl}`,
    name: t`Live Radio`,
    short_name: t`Live Radio`,
    description: t`Listen to live radio`,
    orientation: 'any',
    icons: [
      {
        src: '../pwa-icons/manifest-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '../pwa-icons/manifest-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '../pwa-icons/manifest-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    shortcuts: [
      // {
      //   name: t`Go to Settings`,
      //   short_name: t`Settings`,
      //   description: t`Manage application settings`,
      //   url: `${startUrl}/app/settings`,
      //   icons: [{ src: '../pwa-shortcuts/settings.png', sizes: '192x192' }]
      // },
      {
        name: t`Go to Favorites`,
        short_name: t`Favorites`,
        description: t`Manage your favorite stations`,
        url: `${startUrl}/app/favorites`,
        icons: [{ src: '../pwa-shortcuts/favorites.png', sizes: '192x192' }]
      },
      {
        name: t`Recently played`,
        short_name: t`Recent`,
        description: t`Manage your recent stations`,
        url: `${startUrl}/app/recent-stations`,
        icons: [{ src: '../pwa-shortcuts/recent.png', sizes: '192x192' }]
      }
    ]
  }
}
