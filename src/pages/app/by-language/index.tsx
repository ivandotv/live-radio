import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { ListStations } from 'components/ListStations'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { languages } from 'generated/languages'
import { getStaticTranslations } from 'lib/translations'
import { createLanguageDataRow } from 'lib/utils'

export { getStaticTranslations as getStaticProps }

export default function LanguageList() {
  const langs = languages()

  const languageSearch = langs.map((language) => {
    return {
      language: language.t,
      raw: language.raw
    }
  })

  const breadcrumbs = [
    {
      href: '/app',
      text: t`Search`
    },
    {
      href: '/app/by-language',
      text: t`By Language`
    }
  ]

  return (
    <FilterDataStoreProvider
      initialState={languageSearch}
      uuid="language"
      indexes={['language']}
    >
      <PageTitle title={t`Search For Stations by Language`} />
      <ListStations
        breadcrumbs={breadcrumbs}
        dataRow={createLanguageDataRow}
      ></ListStations>
    </FilterDataStoreProvider>
  )
}

LanguageList.layout = AppDefaultLayout
