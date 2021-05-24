import { StationRowItem } from 'components/StationRowItem'
import { continents, countries } from 'countries-list'
// @ts-ignore
import flag from 'country-code-emoji'
import { Station } from 'radio-browser-api'
import { RadioStore } from './stores/radio-store'

export type RadioStation = {
  tags: string[]
  name: string
  url: string
  id: string
  // favicon: string
  homepage: string
  country: string // country code?
  countryCode: string
  language: string[]
  codec: string
  continent: string
  continentCode: string
  flag: string
}
//todo - rename to dataToRadioStations
export function dataToRadioStations(stations: Station[]): RadioStation[] {
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

export function createStationListRow(opts?: {
  showCountry?: boolean
  showFlag?: boolean
  showTags?: boolean
  store?: RadioStore
}) {
  Object.assign(
    {
      showCountry: true,
      showFlag: true,
      showTags: true
    },
    opts
  )

  return (stations: RadioStation[]) => {
    return function DataRow(index: number) {
      const station = stations[index]

      return (
        <StationRowItem
          {...opts}
          // showCountry={opts?.showCountry}
          // showFlag={opts?.showFlag}
          // showTags={opts?.showTags}
          // removeBtnFn={opts!.removeBtnFn}
          // store={opts.store}
          key={station.id}
          station={station}
        ></StationRowItem>
      )
    }
  }
}

export function getDefaultStation() {
  return {
    id: 'ae503431-073b-499d-81e9-c32dfa1e32c2',
    name: 'Soma FM',
    url: 'https://ice1.somafm.com/groovesalad-256-mp3',
    homepage: 'http://www.somafm.com/',
    tags: [],
    language: [],
    codec: 'MP3',
    flag: '',
    country: 'Internet',
    countryCode: '',
    continent: '',
    continentCode: ''
  }
}
