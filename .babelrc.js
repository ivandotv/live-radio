const pkg = require('./package.json')
const childProcess = require('child_process')
const pkgVersion = `${
  process.env.PKG_VERSION || pkg.version
}-${childProcess.execSync('git rev-parse --short HEAD')}`

const plugins = [
  ['inline-react-svg'],
  [
    'transform-define',
    {
      __VERSION__: pkgVersion,
      __DEV__: process.env.NODE_ENV !== 'production'
    }
  ]
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }])
}
module.exports = {
  presets: ['next/babel'],
  plugins
}
