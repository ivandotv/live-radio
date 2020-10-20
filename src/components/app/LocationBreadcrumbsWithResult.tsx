import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { observer } from 'mobx-react-lite'
import { LocationBreadcrumbs } from './LocationBreadcrumbs'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      display: 'flex',
      alignItems: 'baseline'
    },
    count: {
      marginLeft: theme.spacing(0.5),
      alignSelf: 'baseline'
    }
  })
})
export const LocationBreadcrumbsWithResult = observer(
  function LocationBreadcrumbsWithResult({
    links,
    results
  }: {
    links: { href?: string; as?: string; text: string }[]
    results?: any[]
  }) {
    const classes = useStyles()

    // const count = `( ${store.filtered.length} ${
    //   store.filtered.length === 1 ? 'result' : 'results'
    // } )`

    const count = results
      ? `( ${results.length} ${results.length === 1 ? 'result' : 'results'} )`
      : ''

    return (
      <div className={classes.root}>
        <LocationBreadcrumbs links={links} />
        {results ? <span className={classes.count}>{count}</span> : null}
      </div>
    )
  }
)
