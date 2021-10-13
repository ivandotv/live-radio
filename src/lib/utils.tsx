import { t } from '@lingui/macro'
import { countries } from 'generated/countries'
import { useEffect, useState } from 'react'
import { LanguageDataRow } from 'components/LanguageDataRow'
import { CountryDataRow } from 'components/CountryDataRow'
import { GenreDataRow } from 'components/GenreDataRow'

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
    console.log('haystack needle ', hayStack[needle])

    return hayStack[needle]
  }

  return needle
}

export function useClientUrl(path = '') {
  const [url, setUrl] = useState('')
  useEffect(() => {
    setUrl(`${window.location.origin.replace(/\/$/, '')}${path}`)
  }, [path])

  return url
}

export type ClientRequest = RequestInit & {
  token?: string
  data?: Record<string, unknown>
}

export async function client<T = any>(
  endpoint: string,
  customConfig: ClientRequest = {}
): Promise<T> {
  const { data, token, headers: customHeaders, ...rest } = customConfig

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      // @ts-expect-error  - can't return undefined here
      Authorization: token ? `Bearer ${token}` : undefined,
      // @ts-expect-error - can't return undefined here
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders
    },
    ...rest
  }

  const response = await fetch(endpoint, config)
  if (response.ok) {
    return await response.json()
  } else {
    throw response
  }
}

export function booleanEnv(env: string | undefined, initial: boolean) {
  if (env) {
    return env === 'true'
  }

  return initial
}

export function globalErrorHandler(e: any) {
  //TODO -log
  console.error('global error: ', e)
}

export function isSSR() {
  return typeof window === 'undefined'
}

export function createLanguageDataRow(
  _index: number,
  data: { language: string; raw: string }
) {
  return <LanguageDataRow data={data} />
}

export function createCountryDataRow(
  _index: number,
  data: { name: string; code: string; flag: string; cont: string }
) {
  return <CountryDataRow data={data} />
}

export function createGenreDataRow(
  _index: number,
  data: { genre: string; raw: string }
) {
  return <GenreDataRow data={data} />
}
