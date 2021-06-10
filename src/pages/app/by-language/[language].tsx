import { t, Trans } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { ListStations } from 'components/ListStations'
import { ListStationsFallback } from 'components/ListStationsFallback'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { languages } from 'generated/languages'
import { loadTranslation, paramsWithLocales } from 'lib/translations'
import { userAgentName } from 'app-config'
import { createStationListRow, dataToRadioStations } from 'lib/station-utils'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { RadioBrowserApi } from 'radio-browser-api'
import { RadioStation } from 'lib/station-utils'

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

  const translation = await loadTranslation(ctx.locale!)

  const api = new RadioBrowserApi(userAgentName)
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
      stations: dataToRadioStations(stations),
      // stations: [],
      language,
      translation
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
  const router = useRouter()

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
      initialState={stations}
      uuid="id"
      indexes={['language', 'country', 'tags', 'continent', 'name']}
    >
      <PageTitle title={t`Search For Stations in ${languageTrans.t}`} />
      <ListStations
        breadcrumbs={breadcrumbs}
        dataRow={createStationListRow()}
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
