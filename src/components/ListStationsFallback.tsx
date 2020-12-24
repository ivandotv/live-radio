import Paper from '@material-ui/core/Paper'
import Skeleton from '@material-ui/lab/Skeleton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    noData: {
      margin: theme.spacing(2)
    },
    skeletonItem: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      height: '4.5rem',
      flex: 1
    },
    skeleton: {
      height: '100%',
      overflow: 'hidden'
    },
    search: {
      margin: theme.spacing(2)
    }
  })
})
export function ListStationsFallback() {
  const classes = useStyles()

  return (
    <Paper className={classes.skeleton}>
      {new Array(10).fill(1).map((_, i) => (
        <Skeleton
          component="div"
          className={classes.skeletonItem}
          variant="rect"
          key={i}
          animation="wave"
        />
      ))}
    </Paper>
  )
}
