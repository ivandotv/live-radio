import { t, Trans } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout'
import { ListStations } from 'components/ListStations'
import { ListStationsFallback } from 'components/ListStationsFallback'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { languages } from 'generated/languages'
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

export const getStaticPaths: GetStaticPaths = async function ({ locales }) {
  const paths = paramsWithLocales(
    [
      { language: 'english' },
      { language: 'spanish' },
      { language: 'french' },
      { language: 'german' }
    ],
    locales!
  )

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async function (ctx) {
  const language = (ctx.params!.language as string)
    .replace(/-/g, ' ')
    .toLowerCase()

  const translation = await importTranslations(ctx.locale!)

  const api = new RadioBrowserApi(SHARED_CONFIG.radioAPIUserAgent)
  const stations = await api.searchStations(
    {
      language,
      limit: 1500
    },
    undefined,
    true
  )

  return {
    props: {
      stations: dataToRadioDTO(stations),
      language,
      translation
    },
    revalidate: getServerContainer().resolve<ServerConfig>('config').revalidate
  }
}

export default function LanguageStations({
  language,
  stations
}: {
  stations: RadioDTO[]
  language: string
}) {
  const router = useRouter()
  const { favoriteStations } = useRootStore()

  const stationModels = useMemo(() => createRadioModels(stations), [stations])

  if (router.isFallback) {
    return <ListStationsFallback />
  }

  const languageTrans = languages().find(
    (l) => language.toLowerCase() === l.raw.toLowerCase()
  )!

  const breadcrumbs = [
    {
      href: '/app',
      text: t`Search`
    },
    {
      href: '/app/by-language',
      text: t`By Language`
    },
    {
      text: `${languageTrans.t}`
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={stationModels}
      uuid="id"
      indexes={
        SHARED_CONFIG.stationSearchIndexes as Writable<
          typeof SHARED_CONFIG['stationSearchIndexes']
        >
      }
    >
      <PageTitle title={t`Search For Stations in ${languageTrans.t}`} />
      <ListStations
        breadcrumbs={breadcrumbs}
        dataRow={createStationListRow({
          favoriteStations
        })}
        noData={
          <Trans>
            <p>
              Currently there is no data for <strong> {languageTrans.t}</strong>
              .
            </p>
          </Trans>
        }
      ></ListStations>
    </FilterDataStoreProvider>
  )
}

LanguageStations.layout = AppDefaultLayout
