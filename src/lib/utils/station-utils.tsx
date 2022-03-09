import { StationRowItem } from 'components/StationRowItem'
import { continents, countries } from 'countries-list'
import flag from 'country-code-emoji'
import { Station } from 'radio-browser-api'
import { RadioModel } from '../radio-model'
import { FavoritesStore, RadioStore } from '../stores/favorites-store'

export type RadioDTO = {
  tags: string[]
  name: string
  url: string
  _id: string //match mongoDB
  homepage: string
  country: string
  countryCode: string
  language: string[]
  codec: string
  continent: string
  continentCode: string
  flag: string
}

export function dataToRadioDTO(stations: Station[]): RadioDTO[] {
  const result = []

  const duplicates: Record<string, string> = {}

  const normalizeUrl = new RegExp(/\.[a-zA-A0-9]+$/)

  for (const station of stations) {
    const urlTest = station.urlResolved.replace(normalizeUrl, '')

    if (duplicates[urlTest]) continue

    duplicates[urlTest] = urlTest

    let continentCode
    if (station.countryCode && station.country) {
      const country = countries[station.countryCode as keyof typeof countries]
      continentCode = country ? country.continent : ''
    }
    result.push({
      tags: station.tags.slice(0, 10),
      name: station.name,
      url: station.urlResolved,
      _id: station.id,
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

export function createStationListRow(opts?: {
  showCountry?: boolean
  showFlag?: boolean
  showTags?: boolean
  showRemoveBtn?: boolean
  favoriteStations?: FavoritesStore
  store?: RadioStore
}) {
  const options = {
    showCountry: true,
    showFlag: true,
    showTags: true,
    showRemoveBtn: false,
    ...opts
  }

  return function StationDataRow(_: number, station: RadioModel) {
    return (
      <StationRowItem
        {...options}
        key={station.id}
        station={station}
      ></StationRowItem>
    )
  }
}

export function stationDataToStationModel(stations?: RadioDTO[]) {
  return stations ? stations.map((data) => new RadioModel(data)) : []
}
