import clsx from 'clsx'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Cancel'
import { forwardRef } from 'react'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      backgroundColor: '#2e0d66',
      color: '#fff',
      padding: theme.spacing(1),
      paddingLeft: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    closeBtn: {
      color: '#fff'
      //   paddingLeft: 0
    },
    icon: {
      fontSize: 40
    },
    title: {
      fontWeight: 'bold',
      margin: 0,
      fontSize: '1.0rem'
    }
  })
)

const PwaNotification = forwardRef<
  HTMLDivElement,
  { className: string; onClose: () => void; installFn: () => void }
>(function PwaNotification(props, ref) {
  const classes = useStyles()

  return (
    <div ref={ref} className={clsx(props.className, classes.wrapper)}>
      <div>
        <IconButton
          aria-label="close"
          className={classes.closeBtn}
          onClick={props.onClose}
        >
          <Close className={classes.icon} />
        </IconButton>
      </div>
      <div className={classes.text}>
        <p className={classes.title}>Install</p>
        <p>
          Installing this app uses almost no storage and provides a quick way to
          launch it from the home screen.
        </p>
      </div>
      <div>
        <Button
          onClick={props.installFn}
          variant="contained"
          color="primary"
          disableElevation
        >
          Install
        </Button>
      </div>
    </div>
  )
})

export default PwaNotification
