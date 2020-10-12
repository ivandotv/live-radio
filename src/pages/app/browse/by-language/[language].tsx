import { GetStaticPaths, GetStaticProps } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
import { BrowseBy } from '../../../../components/app/BrowseBy'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { FilterStoreProvider } from '../../../../components/app/providers/StoreProvider'
import {
  stationDataRow,
  stationsToRadioStations
} from '../../../../lib/stationUtils'
import { RadioStation } from '../../../../types'

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

  const api = new RadioBrowserApi('radio-next', fetch)
  const stations = await api.searchStations({
    language,
    limit: 1500,
    hideBroken: true
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
      href: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-language',
      text: 'By Language'
    },
    {
      text: `${language}`
    }
  ]

  return (
    <FilterStoreProvider
      initialState={stations}
      uuid="id"
      indexes={['language', 'country', 'tags', 'continent', 'name']}
    >
      <BrowseBy
        filterInputText="Filter Stations"
        title="Browse For Stations"
        breadcrumbs={breadcrumbs}
        dataRow={stationDataRow}
        noData={
          <p>
            Currently there is no data for <strong>${language}</strong>. Sorry
            for the inconvenience.
          </p>
        }
      ></BrowseBy>
    </FilterStoreProvider>
  )
}

LanguageStations.layout = AppDefaultLayout
