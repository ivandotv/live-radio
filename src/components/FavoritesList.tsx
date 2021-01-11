import { Trans } from '@lingui/macro'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ListStations } from 'components/ListStations'
import { useFilterDataStore } from 'components/providers/FilterDataStoreProvider'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { stationDataRow } from 'lib/stationUtils'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

const indexes = ['language', 'country', 'tags', 'continent', 'name']

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noDataWrap: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    noDataImage: {
      height: 'auto',
      maxHeight: '100%',
      marginTop: theme.spacing(2)
    },
    noDataText: {
      fontSize: '1.7rem',
      textAlign: 'center'
    }
  })
)

// TODO - RecentStationsList and FavoritesList are very similar components they should merged in to one
export const FavoritesList = observer(function FavoritesList() {
  const { favoriteStations } = useRootStore()
  const filterStore = useFilterDataStore()
  const classes = useStyles()

  useEffect(() => {
    ;(async function () {
      await favoriteStations.load()
      filterStore.hydrate(favoriteStations.stations, 'id', indexes)
    })()
  }, [filterStore, favoriteStations])

  useEffect(
    () =>
      reaction(
        () => favoriteStations.stations.length,
        () => {
          filterStore.hydrate(
            favoriteStations.stations,
            'id',
            indexes,
            filterStore.query
          )
        }
      ),
    [favoriteStations, filterStore]
  )

  return (
    <ListStations
      showFallback={!favoriteStations.loaded}
      showSearch={favoriteStations.stations.length > 0}
      dataRow={stationDataRow(true, true, true, true)}
      noData={
        <div className={classes.noDataWrap}>
          <Trans>
            <p className={classes.noDataText}>
              Your favorite stations will appear here
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
