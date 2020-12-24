import { t } from '@lingui/macro'
import { countries } from 'generated/countries'
import { RadioStation } from 'types'

export function countryDataByKey(key: 'code' | 'name' | 'flag', value: string) {
  const countryData = countries()
  for (const [_i, continent] of Object.entries(countryData)) {
    for (const [_i, country] of Object.entries(continent)) {
      if (country[key].toLowerCase() === value.toLowerCase()) {
        return country
      }
    }
  }
}

export function httpsSwitch(url: string) {
  return url.replace(/http:/, 'https:')
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

export function continentsByCode() {
  return {
    AF: {
      raw: 'Africa',
      t: t`Africa`
    },
    AN: {
      raw: 'antarctica',
      t: t`Antarctica`
    },
    AS: {
      raw: 'asia',
      t: t`Asia`
    },
    EU: {
      raw: 'europe',
      t: t`Europe`
    },
    NA: {
      raw: 'North America',
      t: t`North America`
    },
    OC: {
      raw: 'oceania',
      t: t`Oceania`
    },
    SA: {
      raw: 'South America',
      t: t`South America`
    }
  }
}

export function searchTranslation(
  needle: string,
  hayStack: { [key: string]: string }
) {
  console.log({ hayStack })
  console.log({ needle })
  if (hayStack[needle]) {
    console.log('haystack needle ', hayStack[needle])

    return hayStack[needle]
  }

  return needle
}
