import { GetStaticPaths, GetStaticProps } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
import { BrowseBy } from 'components/BrowseBy'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { PageTitle } from 'components/PageTitle'
import { stationDataRow, stationsToRadioStations } from 'lib/stationUtils'
import { RadioStation } from 'types'

export const getStaticPaths: GetStaticPaths = async function () {
  return {
    paths: [
      { params: { language: 'english' } },
      { params: { language: 'spanish' } },
      { params: { language: 'french' } },
      { params: { language: 'german' } }
    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  const language = (ctx.params?.language as string).replace(/-/g, ' ')

  const api = new RadioBrowserApi(fetch)
  const stations = await api.searchStations({
    language,
    limit: 1500
  })

  return {
    props: {
      stations: stationsToRadioStations(stations),
      language
    },
    revalidate: 600 // 10 minutes
  }
}

export default function LanguageStations({
  language,
  stations
}: {
  stations: RadioStation[]
  language: string
}) {
  const breadcrumbs = [
    {
      href: '/app/search',
      text: 'Search'
    },
    {
      href: '/app/search/by-language',
      text: 'By Language'
    },
    {
      text: `${language}`
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={stations}
      uuid="id"
      indexes={['language', 'country', 'tags', 'continent', 'name']}
    >
      <PageTitle title="Search For Stations" />
      <BrowseBy
        filterInputText="Filter Stations"
        breadcrumbs={breadcrumbs}
        dataRow={stationDataRow()}
        noData={
          <p>
            Currently there is no data for <strong>${language}</strong>. Sorry
            for the inconvenience.
          </p>
        }
      ></BrowseBy>
    </FilterDataStoreProvider>
  )
}

LanguageStations.layout = AppDefaultLayout
