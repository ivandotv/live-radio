import { Trans } from '@lingui/macro'
import { Button } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Error from '@material-ui/icons/Warning'
import { ReactNode } from 'react'

export const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    loadError: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    },
    loadErrorSign: {
      fontSize: '4rem',
      color: 'red'
    }
  })
)

export function PageLoadError({
  data,
  onClick
}: {
  data: ReactNode
  onClick: () => {}
}) {
  const classes = useStyles()

  return (
    <div className={classes.loadError}>
      <Error className={classes.loadErrorSign} />
      {data}
      <Button onClick={onClick} variant="contained" color="primary">
        <Trans>Try again</Trans>
      </Button>
    </div>
  )
}
