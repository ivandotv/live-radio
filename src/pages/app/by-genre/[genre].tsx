import { GetStaticPaths, GetStaticProps } from 'next'
import { RadioBrowserApi } from 'radio-browser-api'
import { ListStations } from 'components/ListStations'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { PageTitle } from 'components/PageTitle'
import { stationDataRow, stationsToRadioStations } from 'lib/stationUtils'
import { RadioStation } from 'types'
import { userAgentName } from 'lib/appSettings'
import { t, Trans } from '@lingui/macro'
import { loadTranslation, paramsWithLocales } from 'initTranslations'
import { useRouter } from 'next/router'
import { ListStationsFallback } from 'components/ListStationsFallback'
import { genres } from 'generated/genres'

export const getStaticPaths: GetStaticPaths = async function ({ locales }) {
  const paths = paramsWithLocales(
    [{ genre: 'pop' }, { genre: 'rock' }],
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
      stations: stationsToRadioStations(stations),
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
        dataRow={stationDataRow()}
        noData={
          <p>
            <Trans>
              Currently there is no data for <strong>${genreTrans.t}</strong>.
              Sorry for the inconvenience.
            </Trans>
          </p>
        }
      ></ListStations>
    </FilterDataStoreProvider>
  )
}

GenreStations.layout = AppDefaultLayout
