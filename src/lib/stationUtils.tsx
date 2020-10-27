import { Station } from 'radio-browser-api/dist/types'
import { RadioStation } from '../types'
import { countries, continents } from 'countries-list'
import { StationRowItem } from './../components/app/StationRowItem'
// @ts-ignore
import flag from 'country-code-emoji'

export function stationsToRadioStations(stations: Station[]): RadioStation[] {
  const result = []

  for (const station of stations) {
    if (station.countrycode && station.country) {
      const { continent: continentCode } = countries[
        station.countrycode as keyof typeof countries
      ]
      result.push({
        tags: station.tags,
        name: station.name,
        url: station.url_resolved,
        id: station.stationuuid,
        favicon: station.favicon,
        homepage: station.homepage,
        country: station.country,
        countryCode: station.countrycode,
        language: station.language,
        codec: station.codec,
        continentCode: continentCode,
        continent: continents[continentCode as keyof typeof continents],
        flag: flag(station.countrycode)
      })
    }
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
