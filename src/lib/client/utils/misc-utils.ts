import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { RadioModel } from 'lib/client/radio-model'
import { RadioDTO } from 'lib/shared/utils'
import { en, sr } from 'make-plural/plurals'
import { useEffect, useState } from 'react'

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

export function globalErrorHandler(e: any) {
  //TODO -log to third party
  console.error('global error: ', e)
}

export function stationDataToStationModel(stations?: RadioDTO[]) {
  return stations ? stations.map((data) => new RadioModel(data)) : []
}

export function initTranslations(i18n: I18n) {
  i18n.loadLocaleData({
    en: { plurals: en },
    sr: { plurals: sr },
    pseudo: { plurals: en } // english plurals for pseudo
  })
}
