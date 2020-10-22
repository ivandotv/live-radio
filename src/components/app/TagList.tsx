import Chip from '@material-ui/core/Chip'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(1)
    },
    clickable: {
      '&:hover': {
        backgroundColor: theme.palette.primary.main + '!important',
        color: theme.palette.primary.contrastText
      }
    }
  }
})
export function TagList({
  tags,
  onTagClick
}: {
  tags: string[]
  onTagClick: (tag: string) => void
}) {
  let tagList = null

  const classes = useStyles()

  if (tags.length === 0 || (tags.length === 1 && tags[0] === '')) {
    tagList = <span className={classes.root}>No tags</span>
  } else {
    tagList = tags.map((tag) => (
      <Chip
        component="span"
        key={tag}
        size="small"
        variant="outlined"
        label={tag}
        classes={classes}
        onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
          e.preventDefault()
          onTagClick(tag)
        }}
      />
    ))
  }

  return <>{tagList}</>
}
