const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const withPWA = require('next-pwa')
const runtimeCaching = require('./src/cache')

const nextConfig = {
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en', 'sr', 'xx'],
    defaultLocale: 'en'
  },
  pwa: {
    dest: 'public',
    runtimeCaching,
    scope: '/app',
    disable: process.env.NODE_ENV !== 'production'
  },
  typescript: {
    // !! WARN !!
    // TEMP: Remove for production
    ignoreBuildErrors: false
  }
}

module.exports = withBundleAnalyzer(withPWA(nextConfig))
