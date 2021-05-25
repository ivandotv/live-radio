import { t, Trans } from '@lingui/macro'
import { userAgentName } from 'app-config'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { ListStations } from 'components/ListStations'
import { ListStationsFallback } from 'components/ListStationsFallback'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { genres } from 'generated/genres'
import {
  createStationListRow,
  dataToRadioStations,
  RadioStation
} from 'lib/station-utils'
import { loadTranslation, paramsWithLocales } from 'lib/translations'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { RadioBrowserApi } from 'radio-browser-api'

export const getStaticPaths: GetStaticPaths = async function ({ locales }) {
  const paths = paramsWithLocales(
    [
      { genre: 'pop' },
      { genre: 'rock' },
      { genre: 'dance' },
      { genre: 'rock' },
      { genre: 'house' }
    ],
    locales!
  )

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  const genre = (ctx.params!.genre as string).replace(/-/g, ' ')

  const translation = await loadTranslation(ctx.locale!)

  const api = new RadioBrowserApi(fetch, userAgentName)
  const stations = await api.searchStations(
    {
      tag: genre,
      limit: 1500,
      hideBroken: true
    },
    undefined,
    true
  )

  return {
    props: {
      stations: dataToRadioStations(stations),
      genre,
      translation
    },
    revalidate: 600 // 10 minutes
  }
}

export default function GenreStations({
  genre,
  stations
}: {
  stations: RadioStation[]
  genre: string
}) {
  const router = useRouter()

  if (router.isFallback) {
    console.log('fallback')

    return <ListStationsFallback />
  }

  const genreTrans = genres().find(
    (g) => genre.toLowerCase() === g.raw.toLowerCase()
  )!
  const breadcrumbs = [
    {
      href: '/app',
      text: t`Search`
    },
    {
      href: '/app/by-genre',
      text: t`By Genre`
    },
    {
      text: `${genreTrans.t}`
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={stations}
      uuid="id"
      indexes={['tags', 'name', 'country', 'continent']}
    >
      <PageTitle title={t`Search For Stations in ${genreTrans.t}`} />
      <ListStations
        breadcrumbs={breadcrumbs}
        dataRow={createStationListRow()}
        noData={
          <p>
            <Trans>
              Currently there is no data for <strong> ${genreTrans.t}</strong>.
            </Trans>
          </p>
        }
      ></ListStations>
    </FilterDataStoreProvider>
  )
}

GenreStations.layout = AppDefaultLayout
