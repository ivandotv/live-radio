const withPlugins = require('next-compose-plugins')
const withWorkbox = require('./workbox.webpack.config')
const linguiConfig = require('./lingui.config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const locales = linguiConfig.locales
const defaultLocale = linguiConfig.fallbackLocales.default

// @ts-check
/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const nextConfig = {
  // reactStrictMode: true,
  future: { webpack5: true },
  api: {
    bodyParser: {
      sizeLimit: '50kb'
    }
  },
  i18n: {
    locales,
    defaultLocale
  },
  workbox: {
    // disable: process.env.NODE_ENV !== 'production',
    disable: false,
    swSrc: 'src/service-worker/sw.ts',
    swDest: 'sw.js'
  },
  typescript: {
    /**
     * I've added custom type  check task (type:check) before build
     * I have a nested TS configuration (service-worker)
     * And top level TS check (nextjs default task) is skippng the configuration
     * in the service-worker directory.
     *  */
    ignoreBuildErrors: false
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          }
        ]
      }
    ]
  }
}

module.exports = withPlugins([withBundleAnalyzer, withWorkbox], nextConfig)
