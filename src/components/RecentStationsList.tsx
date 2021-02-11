import { ListStations } from 'components/ListStations'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { createStationListRow } from 'lib/stationUtils'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useFilterDataStore } from './providers/FilterDataStoreProvider'
import { Trans } from '@lingui/macro'
import { useStyles } from 'components/FavoritesList'

const indexes = ['language', 'country', 'tags', 'continent', 'name']
// TODO - RecentStationsList and FavoritesList are very similar components they should merged in to one
export const RecentStationsList = observer(function RecentStationsList() {
  const { recentStations: history } = useRootStore()
  const filterStore = useFilterDataStore()
  const classes = useStyles()

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
      showFallback={!history.loadStatus || history.loadStatus === 'pending'}
      showSearch={history.stations.length > 0}
      dataRow={createStationListRow({ store: history })}
      noData={
        <div className={classes.noDataWrap}>
          <Trans>
            <p className={classes.noDataText}>
              Your recent stations will appear here
            </p>
          </Trans>
          <img
            className={classes.noDataImage}
            src="/images/dancing-panda.svg"
          />
        </div>
      }
    />
  )
})
