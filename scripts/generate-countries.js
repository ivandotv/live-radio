/* eslint-disable @typescript-eslint/no-var-requires */
const { inspect } = require('util')
const fs = require('fs')
const { countries } = require('countries-list')
const { default: flag } = require('country-code-emoji')
const prettier = require('prettier')
const path = require('path')

let prettierConfig
;(async () => {
  prettierConfig = await prettier.resolveConfig(
    path.resolve(__dirname, '../.prettierrc.js')
  )
})()

/* Optimize countries.json file from
    https://github.com/annexare/Countries/blob/master/data/countries.json
    - keep only the coutry name and code
    - group by continent
    e.g.
  {
    "EU": [
      { "name": "Andorra", "code": "AD", flag:"emoji" cont:"EU" },
      { "name": "Albania", "code": "AL", flag:"emoji" cont:"EU"},
  ]
}
*/

function countriesByContinent(countries) {
  const result = {}

  for (const countryCode in countries) {
    const country = countries[countryCode]

    if (!result[country.continent]) {
      result[country.continent] = []
    }

    // kosovo is not internationally recognized country
    if (countryCode === 'XK') {
      continue
    }

    result[country.continent].push({
      name: `t\`${country.name}\``,
      code: countryCode,
      flag: flag(countryCode),
      cont: country.continent
    })
  }

  return result
}

const result = countriesByContinent(countries)

const dir = `${__dirname}/../src/generated`

fs.mkdirSync(dir, { recursive: true })

const file = fs.createWriteStream(`${dir}/countries.js`)

const data = `
import { t } from '@lingui/macro'

export function countries(){
  const data = ${inspect(result).replace(/'(?<name>t`.+?`)'/g, '$<name>')}

  return data
}`

const formatted = prettier.format(data, {
  ...prettierConfig,
  parser: 'babel'
})

file.write(formatted)

file.end()
