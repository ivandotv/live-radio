import { RadioStation } from 'types'
import countriesJSON from 'generated/countries.json'

export function countryDataByKey(key: 'code' | 'name' | 'flag', value: string) {
  for (const [_i, continent] of Object.entries(countriesJSON)) {
    for (const [_i, country] of Object.entries(continent)) {
      if (country[key].toLowerCase() === value.toLowerCase()) {
        return country
      }
    }
  }
}

export const defaultStation: RadioStation = {
  id: 'ae503431-073b-499d-81e9-c32dfa1e32c2',
  name: 'Soma FM',
  url: 'https://ice1.somafm.com/groovesalad-256-mp3',
  homepage: 'http://www.somafm.com/',
  country: 'Internet',
  countryCode: '',
  tags: [],
  language: [],
  codec: 'MP3',
  flag: '',
  continent: '',
  continentCode: ''
}

export const continentsByCode = {
  AF: 'Africa',
  AN: 'Antarctica',
  AS: 'Asia',
  EU: 'Europe',
  NA: 'North America',
  OC: 'Oceania',
  SA: 'South America'
}
