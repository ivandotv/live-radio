import { t } from '@lingui/macro'
import { continents, countries } from 'countries-list'
import flag from 'country-code-emoji'
import type Joi from 'joi'
import { Station } from 'radio-browser-api'

export function toBoolean(env: string | undefined, initial: boolean) {
  if (typeof env !== 'undefined') {
    return env === 'true'
  }

  return initial
}
export function toNumber(env: string | undefined, initial: number) {
  if (typeof env !== 'undefined') {
    return parseInt(env, 10)
  }

  return initial
}

export function assertEnv(value: string): string {
  const env = process.env[value]
  if (typeof env === 'undefined') {
    throw new Error(`Env: ${value} not present`)
  }

  return env
}

export function isSSR() {
  return typeof window === 'undefined'
}

export function asString(value: Joi.ValidationResult | Joi.AnySchema) {
  return value as unknown as string
}
export function asNumber(value: Joi.ValidationResult | Joi.AnySchema) {
  return value as unknown as number
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
