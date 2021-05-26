import { t } from '@lingui/macro'
import { countries } from 'generated/countries'
import { useEffect, useState } from 'react'

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

export function useClientUrl(path: string = '') {
  const [url, setUrl] = useState('')
  useEffect(() => {
    setUrl(`${window.location.origin.replace(/\/$/, '')}${path}`)
  }, [url, path])

  return url
}
