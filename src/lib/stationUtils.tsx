import { Station } from 'radio-browser-api/dist/types'
import { RadioStation } from '../types'
import { countries, continents } from 'countries-list'
import { StationRowItem } from './../components/app/StationRowItem'
// @ts-ignore
import flag from 'country-code-emoji'

export function stationsToRadioStations(stations: Station[]): RadioStation[] {
  const result = []
  const duplicateNames: { [key: string]: boolean } = {}

  for (const station of stations) {
    if (station.countrycode && station.country) {
      const { continent: continentCode } = countries[
        station.countrycode as keyof typeof countries
      ]

      // guard against results having same stations (same names) under different id
      if (duplicateNames[station.name.toLowerCase()]) continue

      duplicateNames[station.name.toLowerCase()] = true

      result.push({
        tags: [...new Set(station.tags.split(','))]
          // .map((tag) => tag.trim())
          .filter(
            (tag) => tag.length > 0 && tag.length < 10 // there are tags that are complete sentences
          ),
        name: station.name,
        url: station.url_resolved,
        id: station.stationuuid,
        favicon: station.favicon,
        homepage: station.homepage,
        country: station.country,
        countryCode: station.countrycode,
        language: station.language.split(','),
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
