import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  PrecacheFallbackPlugin
} from 'workbox-precaching'
import {
  googleFontsCache,
  imageCache,
  staticResourceCache
} from 'workbox-recipes'
import { registerRoute } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope
export {}

console.log('hello from service worker!')

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

staticResourceCache()

imageCache()

googleFontsCache()

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkOnly({
    plugins: [
      new PrecacheFallbackPlugin({
        fallbackURL: '/offline.html'
      })
    ]
  })
)

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
