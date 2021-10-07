import { unwrapResult } from '@fuerte/core'
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
import { observer } from 'mobx-react-lite'
import { MouseEvent } from 'react'
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
  station,
  className
}: {
  station: RadioModel
  className: string
}) {
  const mounted = usePromise()
  const classes = useStyles()

  const removeStation = async (e: MouseEvent) => {
    e.stopPropagation()
    if (station.isSyncing) {
      return
    }

    try {
      const data = unwrapResult(
        await mounted(station.delete({ remove: false }))
      )
      // const data = await station.delete({ remove: false })
      console.log('done !---', data)
    } catch (e) {
      console.log('catch!')
      console.error(e)
      //todo - log
    }
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
