/// <reference lib="es2017" />
/// <reference lib="WebWorker" />
import { ExpirationPlugin } from 'workbox-expiration'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import {
  googleFontsCache,
  imageCache,
  staticResourceCache,
  warmStrategyCache
} from 'workbox-recipes'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { OfflineFallbackWithLocale } from './OfflineFallbackWithLocale'

declare const self: ServiceWorkerGlobalScope
export {}

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

staticResourceCache()

imageCache()

googleFontsCache()

/**
 * Next.js dynamic data (json)
 *  */
registerRoute(
  /\/_next\/data\/.+\/.+\.json$/i,
  new StaleWhileRevalidate({
    cacheName: 'next-data',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
        purgeOnQuotaError: true
      })
    ]
  })
)
/**
 * Roboto font needed for the app (material design) is requested before the
 * service worker is installed, so this needs to be done "manually" so it can
 * be available offline
 *  */
warmStrategyCache({
  urls: [
    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
  ],
  strategy: new StaleWhileRevalidate({
    cacheName: 'roboto-font'
  })
})

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    plugins: [new OfflineFallbackWithLocale('offline/[locale]-offline.html')]
  })
)

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
