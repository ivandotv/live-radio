import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { getStaticTranslations } from 'lib/server/utils'
import { RemovableItemsList } from 'components/RemovableItemsList'
import { stationSearchIndexes } from 'lib/shared/config'

export { getStaticTranslations as getStaticProps }

export default function Favorites() {
  const { favoriteStations } = useRootStore()
  const noDataTitle = t`Your favorite stations will appear here`

  return (
    <>
      <PageTitle title={t`Your Favorite Radio Stations`} />
      <FilterDataStoreProvider
        initialState={[...favoriteStations.stations]}
        uuid="id"
        indexes={stationSearchIndexes}
      >
        <RemovableItemsList
          noDataTitle={noDataTitle}
          store={favoriteStations}
          indexes={stationSearchIndexes}
        />
      </FilterDataStoreProvider>
    </>
  )
}

Favorites.layout = AppDefaultLayout
