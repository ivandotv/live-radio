import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout'
import { ListStations } from 'components/ListStations'
import { ListStationsFallback } from 'components/ListStationsFallback'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { countries } from 'generated/countries'
import { createCountryDataRow } from 'lib/client/utils/component-utils'
import { continentsByCode } from 'lib/shared/utils'
import { importTranslations, paramsWithLocales } from 'lib/server/utils'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

export const getStaticPaths: GetStaticPaths = async function ({ locales }) {
  const params = Object.keys(continentsByCode()).map((key) => ({
    continent: key
  }))

  const paths = paramsWithLocales(params, locales!)

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  const continent = (ctx.params?.continent as string).replace(/-/g, ' ')

  const translation = await importTranslations(ctx.locale!)

  return {
    props: {
      continent,
      translation
    }
  }
}

export default function CountryList({ continent }: { continent: string }) {
  const router = useRouter()

  if (router.isFallback) {
    return <ListStationsFallback />
  }

  const continentCodes = continentsByCode()
  const countryData = countries()[continent as keyof typeof countries]

  const breadcrumbs = [
    {
      href: '/app',
      text: t`Search`
    },
    {
      href: '/app/by-location',
      text: t`By Location`
    },
    {
      text: continentCodes[continent as keyof typeof continentCodes].t
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={countryData}
      uuid="name"
      indexes={['name']}
    >
      <PageTitle title={t`Search for stations by country`} />
      <ListStations
        filterInputText={t`Filter Countries`}
        breadcrumbs={breadcrumbs}
        dataRow={createCountryDataRow}
      />
    </FilterDataStoreProvider>
  )
}

CountryList.layout = AppDefaultLayout
