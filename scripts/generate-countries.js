const fs = require('fs')
const { countries } = require('countries-list')
const flag = require('country-code-emoji')

/* Optimize countries.json file from
    https://github.com/annexare/Countries/blob/master/data/countries.json
    - keep only the coutry name and code
    - group by continent
    e.g.
  {
    "EU": [
      { "name": "Andorra", "code": "AD", flag:"emoji" },
      { "name": "Albania", "code": "AL", flag:"emoji"},
      { "name": "Austria", "code": "AT", flag:"emoji"},
      { "name": "Åland", "code": "AX", flag:"emoji" },
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

    // kosovo is not a country
    if (countryCode === 'XK') {
      continue
    }

    result[country.continent].push({
      name: country.name,
      code: countryCode,
      flag: flag(countryCode)
    })
  }

  return result
}

const result = countriesByContinent(countries)

const dir = `${__dirname}/../src/generated`

fs.mkdirSync(dir, { recursive: true })

fs.writeFileSync(`${dir}/countries.json`, JSON.stringify(result))
