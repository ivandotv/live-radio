import { t } from '@lingui/macro'
import {
  CircularProgress,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Tooltip
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Error from '@material-ui/icons/Warning'
import { RadioStore } from 'lib/stores/radio-store'
import { when } from 'mobx'
import { observer } from 'mobx-react-lite'
import { MouseEvent, useEffect } from 'react'
import { usePromise } from 'react-use'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    btnRemove: {
      '&:hover': {
        transform: 'scale(1.5)'
      }
    },
    pending: {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.primary.contrastText
          : theme.palette.primary.main
    },
    rejected: {
      color:
        theme.palette.type === 'dark' ? '#ff0000' : theme.palette.error.dark
    }
  })
})

export const StationRowRemoveBtn = observer(function StationRowRemoveBtn({
  store,
  id,
  className,
  setShow
}: {
  store: RadioStore
  id: string
  className: string
  setShow: (set: boolean) => void
}) {
  const mounted = usePromise()
  const classes = useStyles()

  const storeSyncRemove = store.syncs.remove.get(id)
  const storeSyncAdd = store.syncs.add.get(id)

  const removeStation = async (e: MouseEvent) => {
    e.stopPropagation()
    if (
      storeSyncRemove?.status === 'pending' ||
      storeSyncAdd?.status === 'pending'
    )
      return

    console.log('remove')
    try {
      await mounted(store.remove(id))
    } catch {}
  }

  useEffect(
    () =>
      when(
        () => storeSyncRemove?.status === 'resolved',
        () => {
          setShow(false)
        }
      ),
    [storeSyncRemove, setShow, store, id]
  )

  return (
    <div className={className}>
      {storeSyncRemove?.status === 'pending' ? (
        <CircularProgress
          size={25}
          className={classes.pending}
          onClick={removeStation} // needed to stop propagation
        />
      ) : storeSyncRemove?.status === 'rejected' ? (
        <Tooltip title={t`Error removing the station, click to try again`}>
          <IconButton
            aria-label={t`remove`}
            className={classes.rejected}
            size="small"
            onClick={removeStation}
          >
            <Error />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={t`Remove station`}>
          <IconButton
            aria-label={t`remove`}
            className={classes.btnRemove}
            size="small"
            onClick={removeStation}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
})
