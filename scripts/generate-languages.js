const ISO6391 = require('iso-639-1')
const { inspect } = require('util')
const fs = require('fs')

const result = ISO6391.getAllNames().map((lang) => {
  return {
    raw: lang,
    t: `${lang}`
  }
})

const dir = `${__dirname}/../src/generated`

fs.mkdirSync(dir, { recursive: true })

const file = fs.createWriteStream(`${dir}/languages.js`)

file.write(`
import { t } from '@lingui/macro'

export function languages(){

  const data = ${inspect(result, { maxArrayLength: null }).replace(
    /t: '(?<name>.*)'/g,
    't: t`$<name>`'
  )}

  return data
}`)

file.end()
