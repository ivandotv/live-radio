import ShareIcon from '@material-ui/icons/ShareOutlined'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    button: {
      cursor: 'pointer',
      fontSize: ({ fontSize }: { fontSize: string }) => fontSize
    }
  })
)
export function ShareStationBtn({
  url,
  fontSize,
  onClick
}: {
  url: string
  fontSize: string
}) {
  const classes = useStyles({ fontSize })

  return (
    <Tooltip placement="top" title="Share station" aria-label="Share station">
      <ShareIcon onClick={onClick} className={classes.button} />
    </Tooltip>
  )
}
