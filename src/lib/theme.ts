import { createTheme } from '@material-ui/core/styles'

export const LightTheme = createTheme({
  palette: {
    type: 'light',
    background: {
      default: '#eaeaea'
    }
  }
})

export const DarkTheme = createTheme({
  palette: {
    type: 'dark'
  }
})
