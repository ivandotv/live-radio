import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout'
import { PageTitle } from 'components/PageTitle'
import { getStaticTranslations } from 'lib/server/utils'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { RemovableItemsList } from 'components/RemovableItemsList'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { SHARED_CONFIG } from 'lib/shared/config'
import { Writable } from 'ts-essentials'

export { getStaticTranslations as getStaticProps }

export default function RecentStations() {
  const { recentStations, favoriteStations } = useRootStore()
  const noDataTitle = t`Your recently played stations will appear here`

  return (
    <>
      <PageTitle title={t`Your Recently Listened Stations`} />
      <FilterDataStoreProvider
        initialState={[...recentStations.stations]}
        uuid="id"
        indexes={
          SHARED_CONFIG.stationSearchIndexes as Writable<
            typeof SHARED_CONFIG['stationSearchIndexes']
          >
        }
      >
        <RemovableItemsList
          favoriteStations={favoriteStations}
          noDataTitle={noDataTitle}
          store={recentStations}
          indexes={
            SHARED_CONFIG.stationSearchIndexes as Writable<
              typeof SHARED_CONFIG['stationSearchIndexes']
            >
          }
        />
      </FilterDataStoreProvider>
    </>
  )
}

RecentStations.layout = AppDefaultLayout
