import { AppShell, AppThemeProvider } from 'components/layout'
import { RootStoreProvider } from 'components/providers/RootStoreProvider'
import { rootStoreFactory } from 'lib/client/injection-root'
import { SnackbarProvider } from 'notistack'
import { NextApplicationPage } from 'pages/_app'

export function AppDefaultLayout(Component: NextApplicationPage, props: any) {
  return (
    <RootStoreProvider rootStoreFactory={rootStoreFactory}>
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
