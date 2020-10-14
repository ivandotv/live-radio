import { observer } from 'mobx-react-lite'
import { FilterDataStore } from '../../lib/stores/FilterDataStore'
import { LocationBreadcrumbs } from './LocationBreadcrumbs'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

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
    store
  }: {
    links: { href?: string; as?: string; text: string }[]
    store: FilterDataStore
  }) {
    const classes = useStyles()

    const count = `( ${store.filtered.length} ${
      store.filtered.length === 1 ? 'result' : 'results'
    } )`

    return (
      <div className={classes.root}>
        <LocationBreadcrumbs links={links} />
        <span className={classes.count}>{count}</span>
      </div>
    )
  }
)
