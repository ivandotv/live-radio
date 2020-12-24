// import { countries, continents } from 'countries-list'
import { t, Trans } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { ListStations } from 'components/ListStations'
import { ListStationsFallback } from 'components/ListStationsFallback'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
// @ts-expect-error
import getFlag from 'country-code-emoji'
import { countries } from 'generated/countries'
import { loadTranslation, paramsWithLocales } from 'initTranslations'
import { userAgentName } from 'lib/appSettings'
import { stationDataRow, stationsToRadioStations } from 'lib/stationUtils'
import { continentsByCode } from 'lib/utils'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { RadioBrowserApi } from 'radio-browser-api'
import { RadioStation } from 'types'

const indexes = ['language', 'country', 'tags', 'continent', 'name']

export const getStaticPaths: GetStaticPaths = async function (ctx) {
  const paths = paramsWithLocales(
    [{ country: 'RS', continent: 'EU' }],
    ctx.locales!
  )

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  const translation = await loadTranslation(ctx.locale!)

  const countryCode = ctx.params?.country as string
  const continent = ctx.params?.continent as string

  const flag = getFlag(countryCode)

  const api = new RadioBrowserApi(fetch, userAgentName)
  const stationResults = await api.searchStations(
    {
      countryCode: countryCode.toUpperCase(),
      limit: 3000
    },
    undefined,
    true
  )

  return {
    props: {
      stations: stationsToRadioStations(stationResults),
      countryCode,
      continentCode: continent,
      flag,
      translation
    },
    revalidate: 600 // 10 minutes
  }
}

export default function CountryStations({
  stations,
  countryCode,
  continentCode,
  flag
}: {
  stations: RadioStation[]
  countryCode: string
  continentCode: string
  flag: string
}) {
  const router = useRouter()
  if (router.isFallback) {
    return <ListStationsFallback />
  }

  const continentName = continentsByCode()[
    continentCode as keyof ReturnType<typeof continentsByCode>
  ]

  const countryData = countries()[
    continentCode as keyof ReturnType<typeof countries>
  ].find((country) => country.code === countryCode)!

  const breadcrumbs = [
    {
      href: '/app/search',
      text: t`Search`
    },
    {
      href: '/app/search/by-location',
      text: t`By Location`
    },
    {
      href: '/app/search/by-location/[continent.raw]',
      as: `/app/search/by-location/${continentCode}`,
      text: `${continentName.t}`
    },
    {
      text: `${countryData.name} ${flag} `
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={stations}
      uuid="id"
      indexes={indexes}
    >
      <PageTitle title={t`Search For Stations in ${countryData.name}`} />
      <ListStations
        filterInputText={t`Filter Stations`}
        breadcrumbs={breadcrumbs}
        dataRow={stationDataRow(false, false)}
        noData={
          <Trans>
            <p>
              Currently there is no data!!! for
              <strong>{`${countryData.name}`}</strong>. Sorry for the
              inconvenience.
            </p>
          </Trans>
        }
      />
    </FilterDataStoreProvider>
  )
}

CountryStations.layout = AppDefaultLayout
