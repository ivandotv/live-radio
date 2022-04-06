import { CustomSearchResults } from 'components/CustomSearchResults'
import { AppDefaultLayout } from 'components/layout'
import { CustomSearchStoreProvider } from 'components/providers/CustomSearchStoreProvider'
import { PageTitle } from 'components/PageTitle'
import { createStationListRow } from 'lib/utils/station-utils'
import { t } from '@lingui/macro'
import { getStaticTranslations } from 'lib/utils/taranslation-utils'
import { useRootStore } from 'components/providers/RootStoreProvider'

export { getStaticTranslations as getStaticProps }

export default function CustomSearch() {
  const { favoriteStations } = useRootStore()

  const breadcrumbs = [
    {
      href: '/app',
      text: t`Search`
    },
    {
      text: t`Custom Search`
    }
  ]

  return (
    <CustomSearchStoreProvider>
      <PageTitle title={t`Custom search`} />
      <CustomSearchResults
        filterInputText={t`Search For Stations`}
        breadcrumbs={breadcrumbs}
        dataRow={createStationListRow({
          showTags: false,
          favoriteStations
        })}
      />
    </CustomSearchStoreProvider>
  )
}

CustomSearch.layout = AppDefaultLayout
