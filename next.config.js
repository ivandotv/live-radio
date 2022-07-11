/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins')
const linguiConfig = require('./lingui.config')
const { withSentryConfig } = require('@sentry/nextjs')
const { withWorkbox } = require('nextjs-workbox-config')

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  // silent: true // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const locales = linguiConfig.locales
const defaultLocale = linguiConfig.fallbackLocales.default

/** @type {import('next/dist/server/config').NextConfig}*/
const nextConfig = {
  reactStrictMode: false, // MUI v4 fails with strict mode
  i18n: {
    locales,
    defaultLocale
  },
  workbox: {
    enable: process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER === 'true',
    swSrc: 'src/lib/client/service-worker/sw.ts',
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
  // experimental: {
  //   optimizeCss: true
  // },
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

console.log('disable sentry ? ', process.env.NO_SENTRY)
console.log('from test file ', process.env.MY_NAME)
console.log('db use transactions', process.env.DB_USE_TRANSACTIONS)

if (
  process.env.NODE_ENV === 'development' ||
  // @ts-expect-error - TODO need to extend process type
  process.env.NO_SENTRY === 'true'
) {
  module.exports = withPlugins([withBundleAnalyzer, withWorkbox], nextConfig)
} else {
  module.exports = withSentryConfig(
    withPlugins([withBundleAnalyzer, withWorkbox], nextConfig),
    sentryWebpackPluginOptions
  )
}
