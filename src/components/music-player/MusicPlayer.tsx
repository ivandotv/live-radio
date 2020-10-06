import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'

// todo show only if playing
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      width: '100%',
      display: 'flex',
      bottom: 0,
      maxHeight: 120,
      borderLeft: 0,
      borderRight: 0,
      borderBottom: 'none'
    }
  })
)
// music player is a global component
export const MusicPlayer = observer(function MusicPlayer() {
  const classes = useStyles()

  return (
    <Paper variant="outlined" square className={classes.root}>
      <h1>Test</h1>
    </Paper>
  )
})
