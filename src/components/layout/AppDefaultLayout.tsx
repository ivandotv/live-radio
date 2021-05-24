import { AppShellLayout } from 'components/layout/AppShellLayout'
import { AppThemeProvider } from 'components/layout/AppThemeSetup'
import { RootStoreProvider } from 'components/providers/RootStoreProvider'
import { NextApplicationPage } from 'pages/_app'
import { SnackbarProvider } from 'notistack'

export function AppDefaultLayout(Component: NextApplicationPage, props: any) {
  return (
    <RootStoreProvider>
      <AppThemeProvider>
        <SnackbarProvider maxSnack={3}>
          <AppShellLayout>
            <Component {...props} />
          </AppShellLayout>
        </SnackbarProvider>
      </AppThemeProvider>
    </RootStoreProvider>
  )
}
