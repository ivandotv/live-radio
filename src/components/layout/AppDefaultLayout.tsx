import { AppShellLayout } from 'components/layout/AppShellLayout'
import { AppThemeSetup } from 'components/layout/AppThemeSetup'
import { RootStoreProvider } from 'components/providers/RootStoreProvider'
import { NextApplicationPage } from 'pages/_app'
import { SnackbarProvider } from 'notistack'

export function AppDefaultLayout(Component: NextApplicationPage, props: any) {
  return (
    <RootStoreProvider>
      <AppThemeSetup>
        <SnackbarProvider maxSnack={3}>
          <AppShellLayout>
            <Component {...props} />
          </AppShellLayout>
        </SnackbarProvider>
      </AppThemeSetup>
    </RootStoreProvider>
  )
}
