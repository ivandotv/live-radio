import { Trans } from '@lingui/macro'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ListStations } from 'components/ListStations'
import { PageLoadError } from 'components/PageLoadError'
import { useFilterDataStore } from 'components/providers/FilterDataStoreProvider'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { createStationListRow } from 'lib/stationUtils'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'

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
  const [firstRender, setFirstRender] = useState(true)

  console.log('favorites List')
  const classes = useStyles()

  useEffect(() => {
    setFirstRender(false)
  }, [])

  useEffect(() => {
    // do not load again on repeated client navigation
    if (favoriteStations.loadStatus !== 'resolved') {
      favoriteStations.load()
    }
  }, [favoriteStations, filterStore])

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
        // { fireImmediately: true }
      ),
    [favoriteStations, filterStore]
  )

  if (favoriteStations.loadStatus === 'rejected') {
    return (
      <>
        <PageLoadError
          onClick={() => favoriteStations.load()}
          data={
            <p>
              <Trans>
                There was an error trying to load your favorite stations.
              </Trans>
            </p>
          }
        />
      </>
    )
  }

  return (
    <ListStations
      showFallback={
        // firstRender ||
        // !favoriteStations.loadStatus ||
        favoriteStations?.loadStatus === 'pending'
      }
      showSearch={favoriteStations.stations.length > 0}
      dataRow={createStationListRow({ store: favoriteStations })}
      noData={
        <div className={classes.noDataWrap}>
          <p className={classes.noDataText}>
            <Trans>Your favorite stations will appear here</Trans>
          </p>
          <img
            className={classes.noDataImage}
            src="/images/dancing-panda.svg"
          />
        </div>
      }
    />
  )
})
