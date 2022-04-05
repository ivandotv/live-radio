/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const withPlugins = require('next-compose-plugins')
const withWorkbox = require('./workbox.webpack.config')
const linguiConfig = require('./lingui.config')
const { withSentryConfig } = require('@sentry/nextjs')

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
  // reactStrictMode: true,
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
    disable: process.env.NODE_ENV !== 'production',
    // disable: false,
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

// module.exports = withPlugins(
//   [
//     withBundleAnalyzer,
//     withWorkbox,
//     [withSentryConfig(nextConfig, sentryWebpackPluginOptions)]
//   ],
//   nextConfig
// )

module.exports = withSentryConfig(
  withPlugins(
    [
      withBundleAnalyzer,
      withWorkbox
      // [withSentryConfig(nextConfig, sentryWebpackPluginOptions)]
    ],
    nextConfig
  ),
  sentryWebpackPluginOptions
)
