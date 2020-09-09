import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(1)
    }
  }
})
export function TagList({ tags }: { tags: string[] }) {
  let tagList = null

  const classes = useStyles()

  if (tags.length === 0 || (tags.length === 1 && tags[0] === '')) {
    tagList = <span>No tags</span>
  } else {
    tagList = tags.map((tag) => (
      <Chip
        component="span"
        key={tag}
        size="small"
        variant="outlined"
        label={tag}
        className={classes.root}
      />
    ))
  }

  return <>{tagList}</>
}
