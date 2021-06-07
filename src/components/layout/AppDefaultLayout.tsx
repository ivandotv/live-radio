import { AppShell } from 'components/layout/AppShell'
import { AppThemeProvider } from 'components/layout/AppThemeSetup'
import { RootStoreProvider } from 'components/providers/RootStoreProvider'
import { SnackbarProvider } from 'notistack'
import { NextApplicationPage } from 'pages/_app'

export function AppDefaultLayout(Component: NextApplicationPage, props: any) {
  return (
    <RootStoreProvider>
      <AppThemeProvider>
        <SnackbarProvider maxSnack={3}>
          <AppShell>
            <Component {...props} />
          </AppShell>
        </SnackbarProvider>
      </AppThemeProvider>
    </RootStoreProvider>
  )
}
