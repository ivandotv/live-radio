import { t, Trans } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout'
import { ListStations } from 'components/ListStations'
import { ListStationsFallback } from 'components/ListStationsFallback'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { genres } from 'generated/genres'
import { createStationListRow } from 'lib/client/utils/component-utils'
import { createRadioModels } from 'lib/shared/utils'
import { ServerConfig } from 'lib/server/config'
import { getServerContainer } from 'lib/server/injection-root'
import { importTranslations, paramsWithLocales } from 'lib/server/utils'
import { SHARED_CONFIG } from 'lib/shared/config'
import { dataToRadioDTO, RadioDTO } from 'lib/shared/utils'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { RadioBrowserApi } from 'radio-browser-api'
import { useMemo } from 'react'
import { Writable } from 'ts-essentials'

//prerender most popular genres
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

  const translation = await importTranslations(ctx.locale!)

  const api = new RadioBrowserApi(SHARED_CONFIG.radioAPIUserAgent)
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
      stations: dataToRadioDTO(stations),
      genre,
      translation
    },
    revalidate: getServerContainer().resolve<ServerConfig>('config').revalidate
  }
}

export default function GenreStations({
  genre,
  stations
}: {
  stations: RadioDTO[]
  genre: string
}) {
  const router = useRouter()
  const { favoriteStations } = useRootStore()

  const stationModels = useMemo(() => createRadioModels(stations), [stations])

  if (router.isFallback) {
    return <ListStationsFallback />
  }

  const genreTranslation = genres().find(
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
      text: `${genreTranslation.t}`
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={stationModels}
      uuid="id"
      indexes={
        SHARED_CONFIG.stationSearchIndexes as Writable<
          typeof SHARED_CONFIG.stationSearchIndexes
        >
      }
    >
      <PageTitle title={t`Search For Stations in ${genreTranslation.t}`} />
      <ListStations
        breadcrumbs={breadcrumbs}
        dataRow={createStationListRow({ favoriteStations })}
        noData={
          <p>
            <Trans>
              Currently there is no data for{' '}
              <strong> ${genreTranslation.t}</strong>.
            </Trans>
          </p>
        }
      ></ListStations>
    </FilterDataStoreProvider>
  )
}

GenreStations.layout = AppDefaultLayout
