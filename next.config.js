const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

const nextConfig = {
  pwa: {
    dest: 'public',
    runtimeCaching,
    scope: '/app',
    disable: process.env.NODE_ENV === 'development'
  }

  // typescript: {
  //   // !! WARN !!
  //   // TEMP: Remove for production
  //   ignoreBuildErrors: true
  // }
}

module.exports = withBundleAnalyzer(withPWA(nextConfig))
