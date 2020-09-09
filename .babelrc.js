const pkg = require('./package.json')
const childProcess = require('child_process')
const pkgVersion = `${
  process.env.PKG_VERSION || pkg.version
}-${childProcess.execSync('git rev-parse --short HEAD')}`

module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['inline-react-svg'],
    [
      'transform-define',
      {
        __VERSION__: pkgVersion,
        __DEV__: process.env.NODE_ENV !== 'production'
      }
    ]
  ]
}
