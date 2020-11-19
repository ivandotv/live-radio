import { Station } from 'radio-browser-api'
import { RadioStation } from 'types'
import { countries, continents } from 'countries-list'
import { StationRowItem } from 'components/StationRowItem'
// @ts-ignore
import flag from 'country-code-emoji'

export function stationsToRadioStations(stations: Station[]): RadioStation[] {
  const result = []

  for (const station of stations) {
    let continentCode
    if (station.countryCode && station.country) {
      continentCode =
        countries[station.countryCode as keyof typeof countries].continent
    }
    result.push({
      tags: station.tags.slice(0, 10),
      name: station.name,
      url: station.urlResolved,
      id: station.id,
      homepage: station.homepage,
      country: station.country,
      countryCode: station.countryCode,
      language: station.language,
      codec: station.codec,
      continentCode: continentCode || '',
      continent: continentCode
        ? continents[continentCode as keyof typeof continents]
        : '',
      flag: continentCode ? flag(station.countryCode) : ''
    })
  }

  return result
}

export function stationDataRow(
  showCountry = true,
  showFlag = true,
  showTags = true
) {
  return (stations: RadioStation[]) => {
    return function DataRow(index: number) {
      const station = stations[index]

      return (
        <StationRowItem
          showCountry={showCountry}
          showFlag={showFlag}
          showTags={showTags}
          station={station}
        ></StationRowItem>
      )
    }
  }
}
