import { ListStations } from 'components/ListStations'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { stationDataRow } from 'lib/stationUtils'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useFilterDataStore } from './providers/FilterDataStoreProvider'
import { Trans } from '@lingui/macro'

const indexes = ['language', 'country', 'tags', 'continent', 'name']

export const RecentStationsList = observer(function RecentStationsList() {
  const { recentStations: history } = useRootStore()
  const filterStore = useFilterDataStore()

  useEffect(() => {
    ;(async function () {
      await history.load()
      filterStore.hydrate(history.stations, 'id', indexes)
    })()
  }, [filterStore, history])

  useEffect(
    () =>
      reaction(
        () => history.stations.length,
        () => {
          filterStore.hydrate(
            history.stations,
            'id',
            indexes,
            filterStore.query
          )
        }
      ),
    [history, filterStore]
  )

  return (
    <ListStations
      showFallback={!history.loaded}
      showSearch={history.stations.length > 0}
      dataRow={stationDataRow(true, true, true)}
      noData={
        <Trans>
          <p>No recent history</p>
        </Trans>
      }
    />
  )
})
