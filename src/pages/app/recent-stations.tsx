import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { PageTitle } from 'components/PageTitle'
import { getStaticTranslations } from 'lib/translations'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { RemovableItemsList } from 'components/RemovableItemsList'
import { useRootStore } from 'components/providers/RootStoreProvider'

export { getStaticTranslations as getStaticProps }

// should not be wrapper in to observable!
export default function RecentStations() {
  const { recentStations } = useRootStore()

  return (
    <>
      <PageTitle title={t`Recently listened stations`} />
      <FilterDataStoreProvider
        initialState={[...recentStations.stations]}
        uuid="id"
        indexes={['language', 'country', 'tags', 'continent', 'name']}
      >
        <RemovableItemsList store={recentStations} />
      </FilterDataStoreProvider>
    </>
  )
}

RecentStations.layout = AppDefaultLayout
