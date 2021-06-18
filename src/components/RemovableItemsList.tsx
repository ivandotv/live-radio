import { Trans } from '@lingui/macro'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ListStations } from 'components/ListStations'
import { PageLoadError } from 'components/PageLoadError'
import { useFilterDataStore } from 'components/providers/FilterDataStoreProvider'
import { createStationListRow } from 'lib/station-utils'
import { RadioStore } from 'lib/stores/radio-store'
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
      // height: 'auto',
      width: 'auto',
      maxHeight: '100%',
      marginTop: theme.spacing(2)
    },
    noDataText: {
      fontSize: '1.7rem',
      textAlign: 'center'
    }
  })
)

export const RemovableItemsList = observer(function RemovableItemsList({
  store,
  noDataTitle
}: {
  store: RadioStore
  noDataTitle: string
}) {
  const filterStore = useFilterDataStore()

  const classes = useStyles()

  // useEffect(() => {
  //   // do not load again on repeated client navigation
  //   if (store.loadStatus !== 'resolved') {
  //     store.load()
  //   }
  // }, [store, filterStore])

  useEffect(
    () =>
      reaction(
        () => store.stations.length,
        () => {
          filterStore.hydrate(store.stations, 'id', indexes, filterStore.query)
        }
      ),
    [store, filterStore]
  )

  if (store.loadStatus === 'rejected') {
    return (
      <>
        <PageLoadError
          onClick={() => store.load()}
          data={
            <p>
              <Trans>There was an error trying to load your stations.</Trans>
            </p>
          }
        />
      </>
    )
  }

  return (
    <ListStations
      showFallback={store?.loadStatus === 'pending'}
      showSearch={store.stations.length > 0}
      dataRow={createStationListRow({ store: store })}
      noData={
        <div className={classes.noDataWrap}>
          <p className={classes.noDataText}>{noDataTitle}</p>
          <img
            width="500"
            height="500"
            className={classes.noDataImage}
            src="/images/dancing-panda.svg"
          />
        </div>
      }
    />
  )
})
