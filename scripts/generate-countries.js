const fs = require('fs')
const { countries } = require('countries-list')

/* Optimize countries.json file from
    https://github.com/annexare/Countries/blob/master/data/countries.json
    - keep only the coutry name and code
    - group by continent
    e.g.
  {
    "EU": [
      { "name": "Andorra", "code": "AD" },
      { "name": "Albania", "code": "AL" },
      { "name": "Austria", "code": "AT" },
      { "name": "Åland", "code": "AX" },
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
      code: countryCode
    })
  }

  return result
}

const result = countriesByContinent(countries)

const dir = `${__dirname}/../src/generated`

fs.mkdirSync(dir, { recursive: true })

fs.writeFileSync(`${dir}/countries.json`, JSON.stringify(result))
