const withPlugins = require('next-compose-plugins')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const withPWA = require('next-pwa')

// @ts-check
/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const nextConfig = {
  // reactStrictMode: true,
  future: { webpack5: true },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en', 'sr', 'xx'],
    defaultLocale: 'en'
  },
  pwa: {
    dest: 'public',
    scope: '/app',
    disable: process.env.NODE_ENV !== 'production'
  },
  typescript: {
    // !! WARN !!
    // TEMP: Remove for production
    ignoreBuildErrors: false
  }
}

module.exports = withPlugins([withBundleAnalyzer, withPWA], nextConfig)
