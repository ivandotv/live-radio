/* eslint-disable @typescript-eslint/no-var-requires */

/* This script file generates music genres, and prepares them for translation */
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
const result = genres()
  .sort()
  .map((genre) => {
    return {
      raw: genre,
      t: `${genre}`
    }
  })

const dir = `${__dirname}/../src/generated`

fs.mkdirSync(dir, { recursive: true })

const file = fs.createWriteStream(`${dir}/genres.js`)

const data = `
import { t } from '@lingui/macro'

export function genres(){

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

function genres() {
  return [
    'Pop',
    'Rock',
    'Punk',
    'Punk Rock',
    'Progressive Rock',
    'Metal',
    'Heavy Metal',
    'Alternative Rock',
    'Gospel',
    'Trap',
    'Hard Rock',
    'Hardcore',
    'Instrumental',
    'Folk',
    'Dance',
    'Country',
    'Rhythm And Blues',
    'Garage',
    'Grime',
    'Gangsta Rap',
    'Soul',
    'House',
    'Techno',
    'Jungle',
    'Ambient',
    'Trance',
    'Freestyle',
    'Drum And Bass',
    'Funk',
    'Funky',
    'Minimal',
    'Disco',
    'Reggae',
    'Electronic',
    'Electro',
    'Breakbeat',
    'Swing',
    'World',
    'Tech House',
    'Progressive House',
    'Indie',
    'Deep House',
    'Deep Techno',
    'Grunge',
    'New Wave',
    'Salsa',
    'Reggaeton',
    'Ska',
    'K-pop',
    'Classical',
    'Rap',
    'Hip Hop',
    'Latin',
    'Jazz',
    'Blues',
    'Psychedelic Rock'
  ]
}
