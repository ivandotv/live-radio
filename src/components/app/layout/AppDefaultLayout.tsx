import { NextApplicationPage } from '../../../pages/_app'
import { AppThemeSetup } from './AppThemeSetup'
import { RootStoreProvider } from '../providers/RootStoreProvider'
import { AppShellLayout } from './AppShellLayout'

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
