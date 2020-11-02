import { AppShellLayout } from 'components/layout/AppShellLayout'
import { AppThemeSetup } from 'components/layout/AppThemeSetup'
import { RootStoreProvider } from 'components/providers/RootStoreProvider'
import { NextApplicationPage } from 'pages/_app'

export function AppDefaultLayout(Component: NextApplicationPage, props: any) {
  return (
    <RootStoreProvider>
      <AppThemeSetup>
        <AppShellLayout>
          <Component {...props} />
        </AppShellLayout>
      </AppThemeSetup>
    </RootStoreProvider>
  )
}
