/* eslint-disable @typescript-eslint/no-var-requires */

/* This script file generates  languages, and prepares them for translation */
const ISO6391 = require('iso-639-1')
const { inspect } = require('util')
const fs = require('fs')
const prettier = require('prettier')
const path = require('path')

let prettierConfig
;(async () => {
  prettierConfig = await prettier.resolveConfig(
    path.resolve(__dirname, '../.prettierrc.js')
  )
})()
const result = ISO6391.getAllNames().map((lang) => {
  return {
    raw: lang,
    t: `${lang}`
  }
})

const dir = `${__dirname}/../src/generated`

fs.mkdirSync(dir, { recursive: true })

const file = fs.createWriteStream(`${dir}/languages.js`)

const data = `
import { t } from '@lingui/macro'

export function languages(){

  const data = ${inspect(result, { maxArrayLength: null }).replace(
    /t: '(?<name>.*)'/g,
    't: t`$<name>`'
  )}

  return data
}`

const formatted = prettier.format(data, {
  ...prettierConfig,
  parser: 'babel'
})

file.write(formatted)
file.end()
