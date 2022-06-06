import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { continents, countries } from 'countries-list'
import flag from 'country-code-emoji'
import { radioModelFactory } from 'lib/client/radio-model'
import { en, sr } from 'make-plural/plurals'
import { Station } from 'radio-browser-api'

export function toBoolean(value: string | undefined, initial: boolean) {
  if (typeof value !== 'undefined') {
    return value === 'true'
  }

  return initial
}
export function toNumber(value: string | undefined, initial: number) {
  if (typeof value !== 'undefined') {
    return parseInt(value, 10)
  }

  ////
  return initial
}

export function isSSR() {
  return typeof window === 'undefined'
}

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

export function sections() {
  return {
    app: t`Search`,
    favorites: t`Favorites`,
    custom: t`Custom Search`,
    recent: t`Recent Stations`,
    'by-location': t`By Location`,
    'by-language': t`By Language`,
    'by-genre': t`By Genre`,
    settings: t`Settings`,
    about: t`About`
  }
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
  if (hayStack[needle]) {
    return hayStack[needle]
  }

  return needle
}

export function globalErrorHandler(e: any) {
  //TODO -log to third party
  console.error('global error: ', e)
}

export function createRadioModels(stations?: RadioDTO[]) {
  return stations ? stations.map((data) => radioModelFactory(data)) : []
}

export function initTranslations(i18n: I18n) {
  i18n.loadLocaleData({
    en: { plurals: en },
    sr: { plurals: sr },
    pseudo: { plurals: en } // english plurals for pseudo
  })
}
