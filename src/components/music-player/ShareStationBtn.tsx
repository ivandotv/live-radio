import ShareIcon from '@material-ui/icons/ShareOutlined'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { observer } from 'mobx-react-lite'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      padding: 2
    },
    icon: {
      fontSize: ({ fontSize }: { fontSize: string | number }) => fontSize,
      color: theme.palette.primary.contrastText
    }
  })
)
export const ShareStationBtn = observer(function ShareStationBtn({
  fontSize
}: {
  fontSize: string | number
}) {
  const classes = useStyles({ fontSize })

  return (
    <Tooltip placement="top" title="Share station" aria-label="Share station">
      <IconButton className={classes.button} size="medium">
        <ShareIcon classes={{ root: classes.icon }} />
      </IconButton>
    </Tooltip>
  )
})
