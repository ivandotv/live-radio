import { ListStations } from 'components/ListStations'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { stationDataRow } from 'lib/stationUtils'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useFilterDataStore } from './providers/FilterDataStoreProvider'
import { Trans } from '@lingui/macro'

const indexes = ['language', 'country', 'tags', 'continent', 'name']

export const FavoritesList = observer(function FavoritesList() {
  const { favorites } = useRootStore()
  const filterStore = useFilterDataStore()

  useEffect(() => {
    ;(async function () {
      await favorites.load()
      filterStore.hydrate(favorites.stations, 'id', indexes)
    })()
  }, [filterStore, favorites])

  useEffect(
    () =>
      reaction(
        () => favorites.stations.length,
        () => {
          filterStore.hydrate(
            favorites.stations,
            'id',
            indexes,
            filterStore.query
          )
        }
      ),
    [favorites, filterStore]
  )

  return (
    <ListStations
      showFallback={!favorites.loaded}
      showSearch={favorites.stations.length > 15}
      dataRow={stationDataRow(true, true, true, true)}
      noData={
        <Trans>
          <p>No favorites</p>
        </Trans>
      }
    />
  )
})
