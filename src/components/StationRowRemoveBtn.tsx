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
import { RadioModel } from 'lib/radio-model'
import { IRadioStore } from 'lib/stores/radio-store'
import { observer } from 'mobx-react-lite'
import { MouseEvent } from 'react'
import { usePromise } from 'react-use'
import { logger } from 'lib/logger-browser'

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
  station,
  className
}: {
  store: IRadioStore
  station: RadioModel
  className: string
}) {
  const mounted = usePromise()
  const classes = useStyles()

  const removeStation = async (e: MouseEvent) => {
    e.stopPropagation()
    if (station.isSyncing) {
      logger.log('already synching  - return !')

      return
    }

    await mounted(
      store.deleteStation(station.id, { remove: false }).catch((err) => {
        logger.error('error deleting station', err)
      })
    )
  }

  return (
    <div className={className}>
      {station.isSyncing ? (
        <CircularProgress
          size={25}
          className={classes.pending}
          onClick={removeStation} // needed to stop propagation
        />
      ) : station.deleteError ? (
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
