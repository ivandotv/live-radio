import { StationRowItem } from 'components/StationRowItem'
import { continents, countries } from 'countries-list'
import flag from 'country-code-emoji'
import { Station } from 'radio-browser-api'
import { RadioStore } from './stores/favorites-store'
import { RadioModel } from './radio-model'

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

export function dataToRadioStations(stations: Station[]): RadioDTO[] {
  const result = []

  const duplicates: { [key: string]: boolean } = {}

  const regex = new RegExp(/\.[a-zA-A0-9]+$/)
  for (const station of stations) {
    const urlTest = station.urlResolved.replace(regex, '')

    if (duplicates[urlTest]) continue

    duplicates[urlTest] = true

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
  store?: RadioStore
}) {
  const options = {
    showCountry: true,
    showFlag: true,
    showTags: true,
    showRemoveBtn: false,
    ...opts
  }

  // return (stations: RadioStation[]) => {
  return function StationDataRow(_: number, station: RadioModel) {
    // const station = stations[index]

    return (
      <StationRowItem
        {...options}
        key={station.id}
        station={station}
      ></StationRowItem>
    )
  }
}
// }

//TODO - da li ovo jos uvek koristim?
export function getDefaultStation(): RadioDTO {
  return {
    _id: '961173b5-0601-11e8-ae97-52543be04c81',
    name: 'SomaFM Lush',
    url: 'https://ice.somafm.com/lush-128-mp3',
    homepage: 'https://www.somafm.com/',
    language: [],
    tags: [],
    flag: '',
    country: 'Internet',
    countryCode: '',
    continent: '',
    continentCode: '',
    codec: 'MP3'
  }
}

export function stationDataToStationModel(stations?: RadioDTO[]) {
  return stations ? stations.map((data) => new RadioModel(data)) : []
}
