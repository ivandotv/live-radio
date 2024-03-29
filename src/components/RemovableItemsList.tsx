import { t, Trans } from '@lingui/macro'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ListStations } from 'components/ListStations'
import { PageLoadError } from 'components/PageLoadError'
import { useFilterDataStore } from 'components/providers/FilterDataStoreProvider'
import { RadioModel } from 'lib/client/radio-model'
import { RadioStore } from 'lib/client/stores/radio-store'
import { createStationListRow } from 'lib/client/utils/component-utils'
import { reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import { useEffect } from 'react'

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
  favoriteStations,
  store,
  noDataTitle,
  indexes
}: {
  favoriteStations?: RadioStore
  store: RadioStore
  noDataTitle: string
  indexes: string[]
}) {
  const filterStore = useFilterDataStore()

  const classes = useStyles()

  useEffect(
    () =>
      reaction(
        () => store.stations.length,
        () => {
          filterStore.hydrate<RadioModel>(
            store.stations,
            'id',
            indexes,
            filterStore.query
          )
        }
      ),
    [store, filterStore, indexes]
  )

  if (store.loadStatus === 'REJECTED') {
    return (
      <>
        <PageLoadError
          onClick={() => store.loadStations()}
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
      showFallback={store?.loadStatus === 'PENDING'}
      showSearch={store.stations.length > 0}
      dataRow={createStationListRow({
        store,
        favoriteStations,
        showRemoveBtn: true
      })}
      noData={
        <div className={classes.noDataWrap}>
          <p className={classes.noDataText}>{noDataTitle}</p>
          <Image
            width="500"
            height="500"
            alt={t`background`}
            priority={true}
            className={classes.noDataImage}
            src="/images/dancing-panda.svg"
          />
        </div>
      }
    />
  )
})
