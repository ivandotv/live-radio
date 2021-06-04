const withPlugins = require('next-compose-plugins')
const withWorkbox = require('./workbox.webpack.config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const locales = ['en', 'sr', 'xx']

// @ts-check
/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const nextConfig = {
  // reactStrictMode: true,
  future: { webpack5: true },
  i18n: {
    locales,
    defaultLocale: 'en'
  },
  workbox: {
    // disable: process.env.NODE_ENV !== 'production',
    disable: false,
    swSrc: 'src/service-worker/sw.ts',
    swDest: 'sw.js'
  },
  typescript: {
    // !! WARN !!
    // TEMP: Remove for production
    ignoreBuildErrors: false
  },
  serverRuntimeConfig: {
    locales
  }
}

module.exports = withPlugins([withBundleAnalyzer, withWorkbox], nextConfig)
